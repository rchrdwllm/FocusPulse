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
import { Task } from "@/types";

export function useTasks() {
  const currentUser = getCurrentUser();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  if (!currentUser)
    return { tasks, loading, error: new Error("User not logged in") };

  useEffect(() => {
    setLoading(true);

    const tasksRef = collection(db, "tasks");
    const q = query(
      tasksRef,
      and(
        where("userId", "==", currentUser.uid),
        where("isCompleted", "==", false)
      ),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const taskList: Task[] = querySnapshot.docs.map(
          (doc) =>
            ({
              ...doc.data(),
            }) as Task
        );

        setTasks(taskList);
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

  return { tasks, loading, error };
}

export const useCompletedTasks = () => {
  const currentUser = getCurrentUser();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  if (!currentUser)
    return { tasks, loading, error: new Error("User not logged in") };

  useEffect(() => {
    setLoading(true);

    const tasksRef = collection(db, "tasks");
    const q = query(
      tasksRef,
      and(
        where("userId", "==", currentUser.uid),
        where("isCompleted", "==", true)
      ),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const taskList: Task[] = querySnapshot.docs.map(
          (doc) =>
            ({
              ...doc.data(),
            }) as Task
        );

        setTasks(taskList);
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

  return { tasks, loading, error };
};
