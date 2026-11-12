import { LoginPage } from "@/pages/auth/Login";
import { OAuth2RedirectPage } from "@/pages/auth/OAuth2RedirectPage";
import { RegisterPage } from "@/pages/auth/Register";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { HomePage } from "@/pages/home/HomePage";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/oauth2/redirect" element={<OAuth2RedirectPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<HomePage />} />
        </Route>

        <Route path="*" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}
