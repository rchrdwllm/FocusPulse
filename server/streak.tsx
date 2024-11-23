import { doc, getDoc, setDoc } from "firebase/firestore";
import moment from "moment-timezone";
import { db } from "@/server/firebase";
import { getCurrentUser } from "./user";

export const updateStreak = async () => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return { error: "User not logged in" };
  }

  const streakRef = doc(db, "streaks", currentUser.uid);
  const streakDoc = await getDoc(streakRef);

  const today = moment().tz("UTC").format("YYYY-MM-DD");
  const yesterday = moment().tz("UTC").subtract(1, "day").format("YYYY-MM-DD");

  if (streakDoc.exists()) {
    const streakData = streakDoc.data();
    const lastCompletedDate = streakData.lastCompletedDate;
    const streakCount = streakData.streakCount;

    if (lastCompletedDate === today) {
      return;
    }

    if (lastCompletedDate === yesterday) {
      await setDoc(
        streakRef,
        {
          lastCompletedDate: today,
          streakCount: streakCount + 1,
        },
        { merge: true }
      );
    } else {
      await setDoc(
        streakRef,
        {
          lastCompletedDate: today,
          streakCount: 1,
        },
        { merge: true }
      );
    }
  } else {
    await setDoc(streakRef, {
      lastCompletedDate: today,
      streakCount: 1,
    });
  }
};
