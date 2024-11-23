import { ThemeProvider, useTheme } from "@/components/theme/theme-context";
import SafeAreaWrapper from "@/components/ui/safe-area-wrapper";
import * as ImagePicker from "expo-image-picker";
import { CircleUserRound, Pencil } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/server/firebase";
import { getCurrentUser } from "@/server/user";
const streak = require("@/assets/images/streak.png");

const ProfileScreen: React.FC = () => {
  const { currentColors } = useTheme();
  const { background, foreground } = currentColors;
  const [image, setImage] = useState<string | null>(null);
  const [streakCount, setStreakCount] = useState(0);

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
    <ThemeProvider>
      <GestureHandlerRootView>
        <View style={{ flex: 1, backgroundColor: background }}>
          <SafeAreaWrapper className="px-4 pb-8">
            <ScrollView contentContainerStyle={styles.scrollContainer}>
              <View className="flex-1 gap-1">
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
                <Text className="text-center text-4xl text-[#ffffff] font-bold">
                  Hello, user!
                </Text>
                <Text className="text-center text-base text-[#827D95]">
                  Joined November 2024
                </Text>
                <View style={styles.bio}>
                  <Text style={styles.bioText}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Cras mattis magna in leo facilisis fermentum. Cras lorem
                    dolor, egestas in metus et, porttitor vehicula libero. Sed
                    tincidunt tortor posuere, consequat velit hendrerit, iaculis
                    erat. Duis at mattis nisl.
                  </Text>
                </View>
                <View
                  style={styles.streak}
                  className="flex-row items-center justify-center"
                >
                  <Image source={streak} style={styles.streakIcon} />
                  <View>
                    <Text className="text-3xl text-[#ffffff] font-bold">
                      Keep your streak going!
                    </Text>
                    <Text className="text-base text-[#ffffff]">
                      {streakCount} days and counting
                    </Text>
                  </View>
                </View>
                <View style={styles.placeholder}>
                  <Text style={styles.placeholderText}>
                    Placeholder for additional content
                  </Text>
                </View>
              </View>
            </ScrollView>
          </SafeAreaWrapper>
        </View>
      </GestureHandlerRootView>
    </ThemeProvider>
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
  streak: {
    width: 390,
    height: 100,
    backgroundColor: "#594EFC",
    marginTop: 20,
    borderRadius: 20,
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