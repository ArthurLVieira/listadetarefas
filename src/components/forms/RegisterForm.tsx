import { useAuth } from "@/hooks/useAuth";
import { registerSchema, type RegisterFormData } from "@/schemas/auth.schema";
import { ApiError } from "@/services/api-error";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { GoogleButton } from "../ui/GoogleButton";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Alert } from "../ui/Alert";

export function RegisterForm() {
  const { register: RegisterUser } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const onSubmit = async ({ name, email, password }: RegisterFormData) => {
    setFormError(null);
    try {
      await RegisterUser({ name, email, password });
    } catch (err) {
      setFormError(
        err instanceof ApiError
          ? err.firstErrorMessage()
          : "Não foi possivel criar a conta.",
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {formError && <Alert message={formError} />}

      <Input
        label="Nome"
        placeholder="Como podemos te chamar?"
        autoComplete="name"
        error={errors.name?.message}
        {...register("name")}
      />

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
        placeholder="Mínimo 8 caracteres"
        autoComplete="new-password"
        error={errors.password?.message}
        {...register("password")}
      />

      <Button type="submit" loading={isSubmitting} fullwidth className="mt-2">
        Criar conta
      </Button>

      <Divider />
      <GoogleButton />

      <p className="text-sm text-center text-neutral-500 pt-2">
        Já possui conta?{" "}
        <Link
          to="/login"
          className="font-medium text-primary-600 hover:text-primary-700"
        >
          Entrar
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
