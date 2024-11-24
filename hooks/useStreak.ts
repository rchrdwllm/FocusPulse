import { db } from "@/server/firebase";
import { getCurrentUser } from "@/server/user";
import { and, collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Settings, Streak } from "@/types";

export function useStreak() {
  const currentUser = getCurrentUser();
  const [streak, setStreak] = useState<Streak | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  if (!currentUser)
    return { streak, loading, error: new Error("User not logged in") };

  useEffect(() => {
    setLoading(true);

    const streakRef = collection(db, "streaks");
    const q = query(streakRef, and(where("userId", "==", currentUser.uid)));

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const streak: Streak = querySnapshot.docs.map(
          (doc) =>
            ({
              ...doc.data(),
            }) as Streak
        )[0];

        setStreak(streak);
        setLoading(false);
      },
      (err) => {
        console.error("Error listening to streaks:", err);
        setError(err as Error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser.uid]);

  return { streak, loading, error };
}
