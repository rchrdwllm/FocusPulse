import "react-native-get-random-values";
import { v4 } from "uuid";
import { getCurrentUser } from "./user";
import {
  and,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  Timestamp,
  where,
  writeBatch,
} from "firebase/firestore";
import { db } from "./firebase";
import { Task } from "@/types";

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

export const completeTask = async (id: string) => {
  try {
    const taskRef = doc(db, "tasks", id);
    const q = await getDoc(taskRef);

    if (!q.exists()) {
      return { error: "Task not found" };
    }

    const task = q.data();

    if (task.isCompleted) {
      await setDoc(taskRef, { isCompleted: false }, { merge: true });

      return { success: `Uncompleted task with ID ${id}` };
    } else {
      await setDoc(taskRef, { isCompleted: true }, { merge: true });

      return { success: `Completed task with ID ${id}` };
    }
  } catch (error) {
    return { error: "Error while completing task" };
  }
};

export const incrementTaskSessions = async (id: string) => {
  const currentUser = getCurrentUser();

  if (!currentUser) {
    return { error: "User not found" };
  }

  try {
    // update single task, no batch updates needed
    const taskRef = doc(db, "tasks", id);
    const q = await getDoc(taskRef);

    if (!q.exists()) {
      return { error: "Task not found" };
    }

    const task = q.data();

    if (task.userId !== currentUser.uid) {
      return { error: "User not authorized" };
    }

    if (task.sessionsCompleted === task.requiredSessions) {
      return { error: "Task already completed" };
    }

    await setDoc(
      taskRef,
      {
        sessionsCompleted: task.sessionsCompleted + 1,
        isCompleted: task.sessionsCompleted + 1 === task.requiredSessions,
      },
      { merge: true }
    );

    return { success: `Incremented task sessions with ID ${id}` };
  } catch (error) {
    return { error };
  }
};
