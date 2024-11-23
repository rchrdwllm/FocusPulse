import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { useEffect, useState } from "react";

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return unsubscribe;
  }, []);

  return user;
};
