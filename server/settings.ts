import { getCurrentUser } from "./user";
import {
  and,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  Timestamp,
  where,
  writeBatch,
} from "firebase/firestore";
import { db } from "./firebase";
import { Settings } from "@/types";
import "react-native-get-random-values";
import { v4 } from "uuid";

export const getSettings = async () => {
  const user = getCurrentUser();

  if (!user) {
    return { error: "No user logged in" };
  }

  try {
    const settingsRef = collection(db, "settings");
    const q = query(settingsRef, where("userId", "==", user.uid));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot) {
      return { error: "No settings configured yet" };
    }

    const settings = querySnapshot.docs.map((doc) => doc.data())[0] as Settings;

    if (!settings) {
      return { error: "No settings configured yet" };
    }

    return { success: settings };
  } catch (error) {
    return { error };
  }
};

export const initUserSettings = async () => {
  const user = getCurrentUser();

  if (!user) {
    return { error: "No user logged in" };
  }

  try {
    const { success, error } = await getSettings();

    if (error) {
      try {
        const id = v4();
        const settingsRef = doc(db, "settings", id);

        await setDoc(settingsRef, {
          autoStartBreaks: true,
          autoStartPomodoro: true,
          id,
          lastModified: Timestamp.now(),
          userId: user.uid,
        } as Settings);
      } catch (error) {
        return { error };
      }
    } else if (success) {
      return { success: `Settings already initialized for user ${user.uid}` };
    }
  } catch (error) {
    return { error };
  }
};

export const changeAutoStartBreaks = async () => {
  const user = getCurrentUser();

  if (!user) {
    return { error: "No user logged in" };
  }

  try {
    const { success: settings } = await getSettings();

    if (!settings) {
      return { error: "No settings configured yet" };
    }

    const settingsRef = doc(db, "settings", settings.id);

    if (settings.autoStartBreaks) {
      await setDoc(
        settingsRef,
        {
          autoStartBreaks: false,
          lastUpdated: Timestamp.now(),
        },
        { merge: true }
      );

      return {
        success: `Disabled auto-start breaks for settings ${settings.id}`,
      };
    } else {
      await setDoc(
        settingsRef,
        {
          autoStartBreaks: true,
          lastUpdated: Timestamp.now(),
        },
        { merge: true }
      );

      return {
        success: `Enabled auto-start breaks for settings ${settings.id}`,
      };
    }
  } catch (error) {
    return { error };
  }
};

export const changeAutoStartPomodoro = async () => {
  const user = getCurrentUser();

  if (!user) {
    return { error: "No user logged in" };
  }

  try {
    const { success: settings } = await getSettings();

    if (!settings) {
      return { error: "No settings configured yet" };
    }

    const settingsRef = doc(db, "settings", settings.id);

    if (settings.autoStartPomodoro) {
      await setDoc(
        settingsRef,
        {
          autoStartPomodoro: false,
          lastUpdated: Timestamp.now(),
        },
        { merge: true }
      );

      return {
        success: `Disabled auto-start Pomodoro for settings ${settings.id}`,
      };
    } else {
      await setDoc(
        settingsRef,
        {
          autoStartPomodoro: true,
          lastUpdated: Timestamp.now(),
        },
        { merge: true }
      );

      return {
        success: `Enabled auto-start Pomodoro for settings ${settings.id}`,
      };
    }
  } catch (error) {
    return { error };
  }
};
