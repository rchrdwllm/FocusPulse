import { db } from "@/server/firebase";
import { getCurrentUser } from "@/server/user";
import {
  and,
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { Analytics, Task } from "@/types";

export function useAnalytics() {
  const currentUser = getCurrentUser();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  if (!currentUser)
    return { analytics, loading, error: new Error("User not logged in") };

  useEffect(() => {
    setLoading(true);

    const analyticsRef = collection(db, "analytics");
    const q = query(analyticsRef, and(where("userId", "==", currentUser.uid)));

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const analytics: Analytics = querySnapshot.docs.map(
          (doc) =>
            ({
              ...doc.data(),
            }) as Analytics
        )[0];

        setAnalytics(analytics);
        setLoading(false);
      },
      (err) => {
        console.error("Error listening to analytics:", err);
        setError(err as Error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser.uid]);

  return { analytics, loading, error };
}
