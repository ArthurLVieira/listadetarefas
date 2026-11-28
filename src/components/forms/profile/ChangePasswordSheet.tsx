import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Sheet } from "@/components/ui/Sheet";
import { changePasswordSchema, type ChangePasswordFormData } from "@/schemas/profile.schema";
import { ApiError } from "@/services/api-error";
import { userRepository } from "@/services/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface Props {
  onClose: () => void;
}

export function ChangePasswordSheet({ onClose }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const savePassword = async ({
    currentPassword,
    newPassword,
  }: ChangePasswordFormData) => {
    setError(null);
    setSuccess(null);
    try {
      await userRepository.changePassword({ currentPassword, newPassword });
      reset();
      setSuccess("Senha alterada com sucesso.");
    } catch (cause) {
      setError(
        cause instanceof ApiError
          ? cause.firstErrorMessage()
          : "Não foi possível alterar sua senha.",
      );
    }
  };

  return (
    <Sheet open onClose={onClose} title="Alterar senha">
      <form
        onSubmit={handleSubmit(savePassword)}
        className="space-y-4 pb-4"
        noValidate
      >
        {success && <Alert message={success} variant="success" />}
        {error && <Alert message={error} />}
        <Input
          label="Senha atual"
          type="password"
          autoComplete="current-password"
          error={errors.currentPassword?.message}
          {...register("currentPassword")}
        />
        <Input
          label="Nova senha"
          type="password"
          autoComplete="new-password"
          hint="Use pelo menos 8 caracteres."
          error={errors.newPassword?.message}
          {...register("newPassword")}
        />
        <Input
          label="Confirmar nova senha"
          type="password"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />
        <Button type="submit" fullWidth loading={isSubmitting}>
          Alterar senha
        </Button>
      </form>
    </Sheet>
  );
}
