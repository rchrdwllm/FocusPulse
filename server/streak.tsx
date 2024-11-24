
import { db } from "@/server/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import moment from "moment-timezone";
import { getCurrentUser } from "./user";

// Function to update the user's streak
export const updateStreak = async () => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      return { error: "User not logged in" };
    }

    // References to Firestore documents/collections
    const streakRef = doc(db, "streaks", currentUser.id);
    const streakDoc = await getDoc(streakRef);

    const today = moment()
      .tz("UTC")
      .format("MMMM DD, YYYY [at] hh:mm:ss A [UTC]Z");
    const tasksRef = collection(db, "tasks");
    const q = query(tasksRef, where("userId", "==", currentUser.uid));
    const querySnapshot = await getDocs(q);

    let hasTaskForToday = false;

    // Check if the user has completed a task today
    querySnapshot.forEach((doc) => {
      const task = doc.data();
      const createdAt = task.createdAt.toDate();
      const createdAtDate = moment(createdAt)
        .tz("UTC")
        .format("MMMM DD, YYYY [at] hh:mm:ss A [UTC]Z");

      if (createdAtDate === today) {
        hasTaskForToday = true;
      }
    });

    // Update streak data in Firestore
    if (hasTaskForToday) {
      if (streakDoc.exists()) {
        const streakData = streakDoc.data();
        const lastCompletedDate = moment(
          streakData.lastCompletedDate,
          "MMMM DD, YYYY [at] hh:mm:ss A [UTC]Z"
        );

        // Only increment streak if today is a new streak day
        if (
          !lastCompletedDate.isSame(
            moment(today, "MMMM DD, YYYY [at] hh:mm:ss A [UTC]Z"),
            "day"
          )
        ) {
          await setDoc(
            streakRef,
            {
              lastCompletedDate: today,
              streakCount: streakData.streakCount + 1,
            },
            { merge: true }
          );
        }
      } else {
        // Start a new streak if no streak document exists
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
      // Reset streak if no task is completed today
      await setDoc(
        streakRef,
        {
          lastCompletedDate: today,
          streakCount: 0,
        },
        { merge: true }
      );
    }

    return { success: true };
  } catch (error) {
    // Safely handle the `error` object
    if (error instanceof Error) {
      console.error("Error updating streak:", error.message);
      return { error: error.message };
    } else {
      console.error("Unknown error updating streak:", error);
      return { error: "An unknown error occurred" };
    }
  }
};
