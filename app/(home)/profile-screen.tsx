import { ThemeProvider, useTheme } from "@/components/theme/theme-context";
import SafeAreaWrapper from "@/components/ui/safe-area-wrapper";
import * as ImagePicker from "expo-image-picker";
import { CircleUserRound, Pencil } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/server/firebase";
import { getCurrentUser, updateBio, updateOtherDetails } from "@/server/user";
import { H1, H3, H4 } from "@/components/ui/typography";
import { Text } from "@/components/ui/text";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUserBio } from "@/hooks/useUserBio";
import { useUser } from "@/hooks/useUser";
import { getAuth } from "firebase/auth";
import { router } from "expo-router";
import Analytics from "@/components/analytics/analytics";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const streak = require("@/assets/images/streak.png");

const ProfileScreen: React.FC = () => {
  const {
    currentColors: { muted, background, foreground, primary, input, border },
  } = useTheme();
  const [image, setImage] = useState<string | null>(null);
  const [streakCount, setStreakCount] = useState(0);
  const { bio: dbBio } = useUserBio();
  const [bio, setBio] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const currentUser = useUser();
  const [isSavingChanges, setIsSavingChanges] = useState(false);
  const [imagePickerLoading, setImagePickerLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.displayName || "");
      setDisplayName(currentUser.displayName || "");
      setEmail(currentUser.email || "");
      setImage(currentUser.photoURL || "");
      setBio(dbBio?.bio || "");
    }
  }, [currentUser, dbBio]);

  const pickImage = async () => {
    setImagePickerLoading(true);

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    setImagePickerLoading(false);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  useEffect(() => {
    const fetchStreak = async () => {
      const currentUser = getCurrentUser();
      if (!currentUser) {
        return;
      }

      const streakRef = doc(db, "streaks", currentUser.uid);
      const streakDoc = await getDoc(streakRef);

      if (streakDoc.exists()) {
        const streakData = streakDoc.data();
        setStreakCount(streakData.streakCount);
      }
    };

    fetchStreak();
  }, []);

  const handleSaveChanges = async () => {
    setIsSavingChanges(true);

    await updateBio(bio);
    const { success, error } = await updateOtherDetails({ name, email, image });

    if (success) {
      const { name: newName, image: newImage } = success;

      setName(newName);
      setDisplayName(newName);
      setImage(newImage);
    }

    if (error) {
      Alert.alert("Error", JSON.stringify(error));
    }

    setIsSavingChanges(false);
  };

  const handleLogOut = () => {
    const auth = getAuth();

    auth.signOut().then(() => {
      router.replace("/(auth)");
    });
  };

  return (
    <GestureHandlerRootView>
      <SafeAreaWrapper
        style={{
          backgroundColor: background,
        }}
      >
        <ScrollView contentContainerClassName="px-4 pb-8">
          <View className="flex-1 gap-4">
            <View style={styles.iconContainer}>
              {image ? (
                <Image source={{ uri: image }} style={styles.image} />
              ) : (
                <CircleUserRound
                  size={200}
                  color={foreground}
                  strokeWidth={1}
                />
              )}
              <TouchableOpacity onPress={pickImage}>
                <Pencil
                  size={35}
                  color={foreground}
                  strokeWidth={2}
                  style={styles.iconOverlap}
                />
              </TouchableOpacity>
            </View>
            <View>
              <H1 className="text-center">Hello, {displayName}!</H1>
              <Text
                className="text-center"
                style={{
                  color: muted,
                }}
              >
                Joined November 2024
              </Text>
            </View>
            <Textarea placeholder="Bio" value={bio} onChangeText={setBio} />
            <Input placeholder="Name" value={name} onChangeText={setName} />
            <Input
              placeholder="Email"
              editable={false}
              value={email}
              onChangeText={setEmail}
            />
            <View
              className="flex-row items-center justify-center gap-4 rounded-3xl px-4 py-8"
              style={{
                backgroundColor: primary,
              }}
            >
              <Image source={streak} style={styles.streakIcon} />
              <View>
                <H4 style={{ color: "white" }}>Keep your streak going!</H4>
                <Text style={{ color: "white" }}>
                  {streakCount} days and counting
                </Text>
              </View>
            </View>
            <Analytics />
            <View className="gap-4 mt-12">
              <Button
                className="border"
                style={{
                  backgroundColor: input,
                  borderColor: border,
                }}
                onPress={handleLogOut}
              >
                <Text>Log out</Text>
              </Button>
              <Button onPress={handleSaveChanges}>
                <Text style={{ color: "white" }}>Save changes</Text>
              </Button>
            </View>
          </View>
        </ScrollView>
      </SafeAreaWrapper>
      <AlertDialog open={isSavingChanges}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Saving changes</AlertDialogTitle>
          </AlertDialogHeader>
          <ActivityIndicator className="text-primary" />
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={imagePickerLoading}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Opening image picker</AlertDialogTitle>
          </AlertDialogHeader>
          <ActivityIndicator className="text-primary" />
        </AlertDialogContent>
      </AlertDialog>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  icon: {
    position: "absolute",
  },
  iconOverlap: {
    position: "absolute",
    top: -35,
    right: -85,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  streakIcon: {
    width: 55,
    height: 55,
    objectFit: "contain",
  },
  bio: {
    width: 390,
    height: 156,
    backgroundColor: "#BFBED8",
    marginTop: 20,
    borderRadius: 35,
    padding: 15,
  },
  bioText: {
    position: "absolute",
    top: 15,
    left: 20,
    color: "#000000",
    fontSize: 16,
    maxWidth: "100%",
  },
  placeholder: {
    width: 390,
    height: 400,
    backgroundColor: "#BFBED8",
    marginTop: 20,
    borderRadius: 35,
    padding: 15,
  },
  placeholderText: {
    position: "absolute",
    top: 15,
    left: 20,
    color: "#000000",
    fontSize: 16,
    maxWidth: "100%",
  },
});

export default ProfileScreen;
