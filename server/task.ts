import "react-native-get-random-values";
import { v4 } from "uuid";
import { getCurrentUser } from "./user";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import { db } from "./firebase";

export const createTask = async ({
  title,
  requiredSessions,
}: {
  title: string;
  requiredSessions: number;
}) => {
  const id = v4();
  const currentUser = getCurrentUser();

  if (!currentUser) {
    return { error: "User not found" };
  }

  try {
    const newTask = {
      id,
      title,
      sessionsCompleted: 0,
      requiredSessions,
      isCompleted: false,
      createdAt: Timestamp.now(),
      userId: currentUser.uid,
    };

    const taskRef = doc(db, "tasks", id);

    await setDoc(taskRef, newTask);

    return { success: `Created task with ID ${id}` };
  } catch (error) {
    return { error: "Error while creating task" };
  }
};
