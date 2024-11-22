import { db } from "@/server/firebase";
import { getCurrentUser } from "@/server/user";
import { and, collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Settings } from "@/types";

export function useSettings() {
  const currentUser = getCurrentUser();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  if (!currentUser)
    return { settings, loading, error: new Error("User not logged in") };

  useEffect(() => {
    setLoading(true);

    const settingsRef = collection(db, "settings");
    const q = query(settingsRef, and(where("userId", "==", currentUser.uid)));

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const settings: Settings = querySnapshot.docs.map(
          (doc) =>
            ({
              ...doc.data(),
            }) as Settings
        )[0];

        setSettings(settings);
        setLoading(false);
      },
      (err) => {
        console.error("Error listening to tasks:", err);
        setError(err as Error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser.uid]);

  return { settings, loading, error };
}
