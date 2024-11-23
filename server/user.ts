import { getAuth, updateEmail, updateProfile } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

export const getCurrentUser = () => {
  const auth = getAuth();

  return auth.currentUser;
};

export const updateBio = async (bio: string) => {
  const currentUser = getCurrentUser();

  if (!currentUser) {
    return { error: "No user logged in" };
  }

  try {
    const userRef = doc(db, "userBios", currentUser.uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      try {
        await setDoc(userRef, { bio, id: currentUser.uid }, { merge: true });

        return { success: "Bio updated" };
      } catch (error) {
        return { error };
      }
    }

    await updateDoc(userRef, { bio });

    return { success: "Bio updated" };
  } catch (error) {
    return { error };
  }
};

export const updateOtherDetails = async ({
  name,
  email,
  image,
}: {
  name: string;
  email: string;
  image: string | null;
}) => {
  const currentUser = getCurrentUser();

  if (!currentUser) {
    return { error: "No user logged in" };
  }

  try {
    const auth = getAuth();

    await updateProfile(auth.currentUser!, {
      displayName: name,
      photoURL: image,
    });

    currentUser.reload();

    return { success: { name, image } };
  } catch (error) {
    return { error };
  }
};
