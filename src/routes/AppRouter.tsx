import { LoginPage } from "@/pages/auth/Login";
import { OAuth2RedirectPage } from "@/pages/auth/OAuth2RedirectPage";
import { RegisterPage } from "@/pages/auth/Register";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { HomePage } from "@/pages/home/HomePage";
import { CategoriesPage } from "@/pages/category/CategoriesPage";
import { AppLayout } from "@/components/layout/AppLayout";
import { TasksPage } from "@/pages/task/TasksPage";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/oauth2/redirect" element={<OAuth2RedirectPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/tasks" element={<TasksPage />} />

            <Route path="/home" element={<Navigate to="/" replace />} />
          </Route>
        </Route>

        <Route path="*" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}
