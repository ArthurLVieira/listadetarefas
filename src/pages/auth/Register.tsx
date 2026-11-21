import { RegisterForm } from "@/components/forms/auth/RegisterForm";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";

export function RegisterPage() {
  const { isAuthenticated, isLoading } = useAuth();
  if (!isLoading && isAuthenticated) return <Navigate to="/" replace />;

  return (
    <AuthLayout
      title="Crie sua conta"
      subtitle="Começe a organizar sei dia agora"
    >
      <RegisterForm />
    </AuthLayout>
  );
}
