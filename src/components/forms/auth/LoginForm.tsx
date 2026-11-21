import { useAuth } from "@/hooks/useAuth";
import { loginSchema, type LoginFormData } from "@/schemas/auth.schema";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ApiError } from "@/services/api-error";
import { Alert } from "@/components/ui/Alert";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { GoogleButton } from "@/components/ui/GoogleButton";
import { Link, Lock, Mail } from "lucide-react";
import { useApiStatus } from "@/hooks/useApiStatus";

export function LoginForm() {
  const { login } = useAuth();
  const { isOnline } = useApiStatus();
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
        inputMode="email"
        autoComplete="email"
        autoCapitalize="none"
        spellCheck={false}
        placeholder="voce@exemplo.com"
        iconLeft={<Mail className="h-4 w-4" />}
        error={errors.email?.message}
        {...register("email")}
      />
      <Input
        label="Senha"
        type="password"
        autoComplete="current-password"
        placeholder="Sua senha"
        iconLeft={<Lock className="h-4 w-4" />}
        error={errors.password?.message}
        {...register("password")}
      />

      <label className="flex items-center gap-2.5 min-h-[44px] py-1 cursor-pointer text-sm text-neutral-600 select-none">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-400"
          {...register("remember")}
        />
        Lembrar de mim neste dispositivo
      </label>

      <Button
        type="submit"
        loading={isSubmitting}
        disabled={!isOnline}
        fullWidth
        size="lg"
      >
        {isOnline ? "Entrar" : "Aguardando conexão…"}
      </Button>

      <Divider />

      <GoogleButton />

      <p className="text-sm text-center text-neutral-500 pt-1">
        Ainda não tem conta?{" "}
        <Link
          to="/register"
          className="font-medium text-primary-600 hover:text-primary-700
                     underline-offset-4 hover:underline"
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
