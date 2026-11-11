import { useAuth } from "@/hooks/useAuth";
import { loginSchema, type LoginFormData } from "@/schemas/auth.schema";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ApiError } from "@/services/api-error";
import { Button } from "../ui/Button";
import { Link } from "react-router-dom";
import { Alert } from "../ui/Alert";
import { Input } from "../ui/Input";

export function LoginForm() {
  const { login } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", remember: true },
  });

  const onSubmit = async ({ email, password, remember }: LoginFormData) => {
    setFormError(null);
    try {
      await login({ email, password }, remember);
    } catch (err) {
      setFormError(
        err instanceof ApiError
          ? err.firstErrorMessage()
          : "Não foi possível entrar.",
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {formError && <Alert message={formError} />}

      <Input
        label="E-mail"
        type="email"
        placeholder="voce@exemplo.com"
        autoComplete="email"
        error={errors.email?.message}
        {...register("email")}
      />

      <Input
        label="Senha"
        type="password"
        placeholder="Sua senha"
        autoComplete="current-password"
        error={errors.password?.message}
        {...register("password")}
      />

      <label className="flex items-center gap-2 text-sm text-neutral-600 select-none pt-1">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-400"
          {...register("remember")}
        />
        Lembrar de mim
      </label>

      <Button type="submit" loading={isSubmitting} fullwidth className="mt-2">
        Entrar
      </Button>

      <Divider />
      <GoogleButton />

      <p className="text-sm text-center text-neutral-500 pt-2">
        Ainda não tem conta?{" "}
        <Link
          to="/register"
          className="font-medium text-primary-600 hover:text-primary-700"
        >
          Cadastre-se
        </Link>
      </p>
    </form>
  );
}

function Divider() {
  return (
    <div className="relative my-1">
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t border-neutral-200" />
      </div>
      <div className="relative flex justify-center text-xs">
        <span className="bg-white px-3 text-neutral-400">ou</span>
      </div>
    </div>
  );
}
