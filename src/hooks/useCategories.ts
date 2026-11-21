import {
  CategoryContext,
  type CategoryContextValue,
} from "@/contexts/CategoryContext";
import { useContext } from "react";

export function useCategory(): CategoryContextValue {
  const ctx = useContext(CategoryContext);
  if (!ctx) {
    throw new Error("useCategory deve ser usado dentro de <CategoryProvider>");
  }
  return ctx;
}
