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
import { updateBio, updateOtherDetails } from "@/server/user";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { getAuth } from "firebase/auth";
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
import Streak from "@/components/streak/streak";

const ProfileScreen: React.FC = () => {
  const {
    currentColors: { muted, background, foreground, input, border },
  } = useTheme();
  const [image, setImage] = useState<string | null>(null);
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
            <Streak />
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
});

export default ProfileScreen;
