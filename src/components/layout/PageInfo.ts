import { Home, ListTodo, Tag, type LucideIcon } from "lucide-react";

export interface PageInfo {
  title: string;
  subtitle: string;
  icon: LucideIcon;
}

export function getPageInfo(pathname: string): PageInfo {
  if (pathname === "/") {
    return {
      title: "Início",
      subtitle: "Visão geral do seu dia",
      icon: Home,
    };
  }

  if (pathname.startsWith("/tasks")) {
    return {
      title: "Tarefas",
      subtitle: "Organizar o que precisa ser feito",
      icon: ListTodo,
    };
  }

  if (pathname.startsWith("/categories")) {
    return {
      title: "Categorias",
      subtitle: "Agrupe suas tarefas por contexto",
      icon: Tag,
    };
  }

  return { title: "TaskFlow", subtitle: "", icon: ListTodo };
}
