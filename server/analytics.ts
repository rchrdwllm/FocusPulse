import { doc, getDoc, setDoc, Timestamp, updateDoc } from "firebase/firestore";
import { getCurrentUser } from "./user";
import { db } from "./firebase";
import { Analytics } from "@/types";

export const initAnalytics = async () => {
  const currentUser = getCurrentUser();

  if (!currentUser) {
    return { error: "No user found" };
  }

  try {
    const analyticsRef = doc(db, "analytics", currentUser.uid);
    const analytics = await getDoc(analyticsRef);

    if (!analytics.exists()) {
      await setDoc(analyticsRef, {
        focus: 0,
        short: 0,
        long: 0,
        sessions: 0,
        id: currentUser.uid,
        userId: currentUser.uid,
        lastUpdated: Timestamp.now(),
      } as Analytics);

      return { success: "Analytics created" };
    }

    return { success: "Analytics already exists" };
  } catch (error) {
    return { error };
  }
};

export const updateAnalytics = async (analytics: {
  focus?: number;
  short?: number;
  long?: number;
  sessions?: number;
}) => {
  const currentUser = getCurrentUser();

  if (!currentUser) {
    return { error: "No user found" };
  }

  try {
    const analyticsRef = doc(db, "analytics", currentUser.uid);
    const analyticsDoc = await getDoc(analyticsRef);

    if (!analyticsDoc.exists()) {
      return { error: "No analytics found" };
    }

    const updatedAnalytics = {
      focus: analytics.focus
        ? analyticsDoc.data().focus + analytics.focus
        : analyticsDoc.data().focus,
      short: analytics.short
        ? analyticsDoc.data().short + analytics.short
        : analyticsDoc.data().short,
      long: analytics.long
        ? analyticsDoc.data().long + analytics.long
        : analyticsDoc.data().long,
      sessions: analytics.sessions
        ? analyticsDoc.data().sessions + analytics.sessions
        : analyticsDoc.data().sessions,
      lastUpdated: Timestamp.now(),
    };

    await updateDoc(analyticsRef, updatedAnalytics);

    return { success: "Analytics updated" };
  } catch (error) {
    return { error };
  }
};
