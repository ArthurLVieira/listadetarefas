import { LoginForm } from "@/components/forms/Login";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";

export function LoginPage() {
  const { isAuthenticated, isLoading } = useAuth();
  if (!isLoading && isAuthenticated) return <Navigate to="/" replace />;

  return (
    <AuthLayout
      title="Bem vindo de volta"
      subtitle="Entre para continuar suas tarefas"
    >
      <LoginForm />
    </AuthLayout>
  );
}
