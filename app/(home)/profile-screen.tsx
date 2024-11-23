import Analytics from "@/components/analytics/analytics";
import { useTheme } from "@/components/theme/theme-context";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SafeAreaWrapper from "@/components/ui/safe-area-wrapper";
import { Text } from "@/components/ui/text";
import { Textarea } from "@/components/ui/textarea";
import { H1, H4 } from "@/components/ui/typography";
import { useUser } from "@/hooks/useUser";
import { useUserBio } from "@/hooks/useUserBio";
import { db } from "@/server/firebase";
import { getCurrentUser, updateBio, updateOtherDetails } from "@/server/user";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { CircleUserRound, Pencil } from "lucide-react-native";
import moment from "moment-timezone";
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

        // Parse Firestore's custom formatted date
        const lastCompletedDate = moment(
          streakData.lastCompletedDate,
          "MMMM DD, YYYY [at] hh:mm:ss A [UTC]Z"
        );
        const today = moment().tz("UTC");

        // Check if last completed date is today
        if (lastCompletedDate.isSame(today, "day")) {
          setStreakCount(streakData.streakCount);
        } else {
          setStreakCount(0); // Reset streak if the day doesn't match
        }
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
              <Image
                source={streakCount >= 10 ? streak : streak}
                style={[
                  styles.streakIcon,
                  streakCount === 0 && { opacity: 0.5 },
                ]}
              />
              <View>
                <H4 style={{ color: "white" }}>Keep your streak going!</H4>
                <Text style={{ color: "white" }}>
                  {streakCount === 0
                    ? "Streak reset! Start again!"
                    : `${streakCount} days and counting`}
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
      </SafeAreaWrapper>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
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
});

export default ProfileScreen;
