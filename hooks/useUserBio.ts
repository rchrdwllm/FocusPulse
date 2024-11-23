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
import { UserBio } from "@/types";

export function useUserBio() {
  const currentUser = getCurrentUser();
  const [bio, setBio] = useState<UserBio>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  if (!currentUser)
    return { bio, loading, error: new Error("User not logged in") };

  useEffect(() => {
    setLoading(true);

    const tasksRef = collection(db, "userBios");
    const q = query(tasksRef, and(where("id", "==", currentUser.uid)));

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const bio: UserBio = querySnapshot.docs.map(
          (doc) =>
            ({
              ...doc.data(),
            }) as UserBio
        )[0];

        setBio(bio);
        setLoading(false);
      },
      (err) => {
        console.error("Error listening to user bios:", err);
        setError(err as Error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser.uid]);

  return { bio, loading, error };
}
