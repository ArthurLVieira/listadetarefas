import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Sheet } from "@/components/ui/Sheet";
import { useAuth } from "@/hooks/useAuth";
import { userRepository } from "@/services/api";
import {
  profileSchema,
  type ProfileFormData,
} from "@/schemas/profile.schema";
import { ApiError } from "@/services/api-error";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface Props {
  onClose: () => void;
}

export function UserProfileSheet({ onClose }: Props) {
  const { updateUser } = useAuth();
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileRetry, setProfileRetry] = useState(0);
  const [profileLoadError, setProfileLoadError] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [profileEmail, setProfileEmail] = useState("");

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    reset: resetProfile,
    formState: { errors: profileErrors, isSubmitting: profileSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: "" },
  });

  useEffect(() => {
    let active = true;

    userRepository
      .findMe()
      .then((profile) => {
        if (!active) return;
        resetProfile({ name: profile.name ?? "" });
        setProfileEmail(profile.email ?? "");
        updateUser(profile);
      })
      .catch((error: unknown) => {
        if (!active) return;
        setProfileLoadError(
          error instanceof ApiError
            ? error.firstErrorMessage()
            : "Não foi possível carregar seu perfil.",
        );
      })
      .finally(() => {
        if (active) setProfileLoading(false);
      });

    return () => {
      active = false;
    };
  }, [profileRetry, resetProfile, updateUser]);

  const retryProfile = () => {
    setProfileLoading(true);
    setProfileLoadError(null);
    setProfileRetry((retry) => retry + 1);
  };

  const saveProfile = async ({ name }: ProfileFormData) => {
    setProfileError(null);
    setProfileSuccess(null);
    try {
      const profile = await userRepository.updateMe({ name: name.trim() });
      updateUser(profile);
      resetProfile({ name: profile.name ?? "" });
      setProfileSuccess("Perfil atualizado com sucesso.");
    } catch (error) {
      setProfileError(
        error instanceof ApiError
          ? error.firstErrorMessage()
          : "Não foi possível atualizar seu perfil.",
      );
    }
  };

  return (
    <Sheet open onClose={onClose} title="Editar usuário">
      <div className="space-y-4 pb-4">
        {profileLoading ? (
          <div className="flex items-center justify-center gap-2 py-8 text-sm text-neutral-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            Carregando perfil...
          </div>
        ) : profileLoadError ? (
          <div className="space-y-3">
            <Alert message={profileLoadError} />
            <Button
              type="button"
              variant="outline"
              fullWidth
              onClick={retryProfile}
            >
              Tentar novamente
            </Button>
          </div>
        ) : (
          <form
            onSubmit={handleProfileSubmit(saveProfile)}
            className="space-y-4"
            noValidate
          >
            {profileSuccess && (
              <Alert message={profileSuccess} variant="success" />
            )}
            {profileError && <Alert message={profileError} />}
            <Input
              label="Nome"
              placeholder="Como podemos te chamar?"
              autoComplete="name"
              maxLength={100}
              error={profileErrors.name?.message}
              {...registerProfile("name")}
            />
            <Input
              label="E-mail"
              type="email"
              autoComplete="email"
              readOnly
              value={profileEmail}
              hint="O e-mail da conta não pode ser alterado aqui."
            />
            <Button
              type="submit"
              fullWidth
              loading={profileSubmitting}
              disabled={profileLoading}
            >
              Salvar alterações
            </Button>
          </form>
        )}
      </div>
    </Sheet>
  );
}
