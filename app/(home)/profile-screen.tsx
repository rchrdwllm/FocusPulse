import { ThemeProvider, useTheme } from "@/components/theme/theme-context";
import SafeAreaWrapper from "@/components/ui/safe-area-wrapper";
import * as ImagePicker from "expo-image-picker";
import { CircleUserRound, Pencil } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/server/firebase";
import { getCurrentUser } from "@/server/user";
import { H1, H3, H4 } from "@/components/ui/typography";
import { Text } from "@/components/ui/text";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const streak = require("@/assets/images/streak.png");

const ProfileScreen: React.FC = () => {
  const {
    currentColors: { muted, background, foreground, primary },
  } = useTheme();
  const [image, setImage] = useState<string | null>(null);
  const [streakCount, setStreakCount] = useState(0);
  const [bio, setBio] = useState("");

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

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
              <H1 className="text-center">Hello, user!</H1>
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
          </View>
        </ScrollView>
        <View className="px-4 py-8">
          <Button>
            <Text>Save changes</Text>
          </Button>
        </View>
      </SafeAreaWrapper>
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
