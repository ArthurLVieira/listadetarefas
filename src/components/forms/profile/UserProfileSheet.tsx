import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Sheet } from "@/components/ui/Sheet";
import { useAuth } from "@/hooks/useAuth";
import { userRepository } from "@/services/api";
import {
  changePasswordSchema,
  profileSchema,
  type ChangePasswordFormData,
  type ProfileFormData,
} from "@/schemas/profile.schema";
import { ApiError } from "@/services/api-error";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound, Loader2, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface Props {
  onClose: () => void;
}

type Tab = "profile" | "password";

export function UserProfileSheet({ onClose }: Props) {
  const { updateUser } = useAuth();
  const [tab, setTab] = useState<Tab>("profile");
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileRetry, setProfileRetry] = useState(0);
  const [profileLoadError, setProfileLoadError] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
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

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    formState: { errors: passwordErrors, isSubmitting: passwordSubmitting },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    let active = true;

    userRepository
      .findMe()
      .then((profile) => {
        if (!active) return;
        resetProfile({ name: profile.name });
        setProfileEmail(profile.email);
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
      resetProfile({ name: profile.name });
      setProfileSuccess("Perfil atualizado com sucesso.");
    } catch (error) {
      setProfileError(
        error instanceof ApiError
          ? error.firstErrorMessage()
          : "Não foi possível atualizar seu perfil.",
      );
    }
  };

  const savePassword = async ({
    currentPassword,
    newPassword,
  }: ChangePasswordFormData) => {
    setPasswordError(null);
    setPasswordSuccess(null);
    try {
      await userRepository.changePassword({ currentPassword, newPassword });
      resetPassword();
      setPasswordSuccess("Senha alterada com sucesso.");
    } catch (error) {
      setPasswordError(
        error instanceof ApiError
          ? error.firstErrorMessage()
          : "Não foi possível alterar sua senha.",
      );
    }
  };

  const changeTab = (nextTab: Tab) => {
    setTab(nextTab);
    setProfileError(null);
    setProfileSuccess(null);
    setPasswordError(null);
    setPasswordSuccess(null);
  };

  return (
    <Sheet open onClose={onClose} title="Editar usuário">
      <div className="space-y-4 pb-4">
        <div
          role="tablist"
          aria-label="Opções de edição do usuário"
          className="grid grid-cols-2 gap-1 rounded-2xl bg-neutral-100 p-1"
        >
          <button
            type="button"
            role="tab"
            aria-selected={tab === "profile"}
            onClick={() => changeTab("profile")}
            className={`flex min-h-10 items-center justify-center gap-2 rounded-xl px-3 text-sm font-medium transition-colors ${
              tab === "profile"
                ? "bg-white text-neutral-900 shadow-sm"
                : "text-neutral-500 hover:text-neutral-700"
            }`}
          >
            <UserRound className="h-4 w-4" />
            Perfil
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === "password"}
            onClick={() => changeTab("password")}
            className={`flex min-h-10 items-center justify-center gap-2 rounded-xl px-3 text-sm font-medium transition-colors ${
              tab === "password"
                ? "bg-white text-neutral-900 shadow-sm"
                : "text-neutral-500 hover:text-neutral-700"
            }`}
          >
            <KeyRound className="h-4 w-4" />
            Senha
          </button>
        </div>

        {tab === "profile" ? (
          profileLoading ? (
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
          )
        ) : (
          <form
            onSubmit={handlePasswordSubmit(savePassword)}
            className="space-y-4"
            noValidate
          >
            {passwordSuccess && (
              <Alert message={passwordSuccess} variant="success" />
            )}
            {passwordError && <Alert message={passwordError} />}
            <Input
              label="Senha atual"
              type="password"
              autoComplete="current-password"
              error={passwordErrors.currentPassword?.message}
              {...registerPassword("currentPassword")}
            />
            <Input
              label="Nova senha"
              type="password"
              autoComplete="new-password"
              hint="Use pelo menos 8 caracteres."
              error={passwordErrors.newPassword?.message}
              {...registerPassword("newPassword")}
            />
            <Input
              label="Confirmar nova senha"
              type="password"
              autoComplete="new-password"
              error={passwordErrors.confirmPassword?.message}
              {...registerPassword("confirmPassword")}
            />
            <Button type="submit" fullWidth loading={passwordSubmitting}>
              Alterar senha
            </Button>
          </form>
        )}
      </div>
    </Sheet>
  );
}
