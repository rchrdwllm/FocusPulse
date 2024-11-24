import { deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
import moment from "moment-timezone";
import { db } from "@/server/firebase";
import { getCurrentUser } from "./user";

export const updateStreak = async () => {
  const currentUser = getCurrentUser();

  if (!currentUser) {
    return { error: "User not logged in" };
  }

  try {
    const streakRef = doc(db, "streaks", currentUser.uid);
    const streakDoc = await getDoc(streakRef);

    const today = moment().tz("UTC").format();

    if (streakDoc.exists()) {
      const streakData = streakDoc.data();
      const lastCompletedDate = streakData.lastCompletedDate;
      const streakCount = streakData.streakCount;

      const todayValue = moment(today).valueOf();
      const lastCompletedDateValue = moment(lastCompletedDate).valueOf();
      const after24hrs = moment(lastCompletedDate).add(2, "days").valueOf();

      if (todayValue - lastCompletedDateValue <= 86400000) {
        return { success: "Already on a streak" };
      } else if (
        todayValue - lastCompletedDateValue >= 86400000 &&
        todayValue < after24hrs
      ) {
        await setDoc(
          streakRef,
          {
            lastCompletedDate: today,
            streakCount: streakCount + 1,
            id: currentUser.uid,
            userId: currentUser.uid,
          },
          { merge: true }
        );

        return { success: "Streak updated" };
      } else {
        await setDoc(
          streakRef,
          {
            lastCompletedDate: today,
            streakCount: 1,
            id: currentUser.uid,
            userId: currentUser.uid,
          },
          { merge: true }
        );

        return { success: "Streak reset" };
      }
    } else {
      await setDoc(streakRef, {
        lastCompletedDate: today,
        streakCount: 1,
        id: currentUser.uid,
        userId: currentUser.uid,
      });

      return { success: "Streak started" };
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error updating streak:", error.message);
      return { error: error.message };
    } else {
      console.error("Unknown error updating streak:", error);
      return { error: "An unknown error occurred" };
    }
  }
};

export const initStreakReset = async () => {
  const currentUser = getCurrentUser();

  if (!currentUser) {
    return { error: "User not logged in" };
  }

  try {
    const streakRef = doc(db, "streaks", currentUser.uid);
    const streakDoc = await getDoc(streakRef);

    const today = moment().tz("UTC").format();

    if (streakDoc.exists()) {
      const streakData = streakDoc.data();
      const lastCompletedDate = streakData.lastCompletedDate;

      const todayValue = moment(today).valueOf();
      const after24hrs = moment(lastCompletedDate).add(2, "days").valueOf();

      if (todayValue >= after24hrs) {
        await deleteDoc(streakRef);

        return { success: "Streak reset" };
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error updating streak:", error.message);
      return { error: error.message };
    } else {
      console.error("Unknown error updating streak:", error);
      return { error: "An unknown error occurred" };
    }
  }
};
