import { TaskContext, type TaskContextValue } from "@/contexts/TaskContext";
import { useContext } from "react";

export function useTask(): TaskContextValue {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error("useTask deve ser dentro de <TaskProvider>");
  return ctx;
}

export const useTasks = useTask;
