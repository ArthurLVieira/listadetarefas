import { useAuth } from "@/hooks/useAuth";
import { Loader2, Sparkles, XCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "../ui/Button";

export function OAuth2RedirectPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { completeOAuth2Login } = useAuth();
  const [error, setError] = useState(false);
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken");
    const expiresInRaw = params.get("expiresIn");
    const tokenType = params.get("tokenType") ?? "Bearer";

    if (!accessToken || !refreshToken || !expiresInRaw) {
      setError(true);
      return;
    }

    const ok = completeOAuth2Login({
      accessToken,
      refreshToken,
      tokenType,
      expiresIn: Number(expiresInRaw),
    });
    if (ok) navigate("/", { replace: true });
    else setError(true);
  }, [params, completeOAuth2Login, navigate]);

  return (
    <div
      className="min-h-[100dvh] flex flex-col items-center justify-center gap-6
                    px-6 py-[max(1rem,var(--safe-top))] pb-[max(1rem,var(--safe-bottom))]
                    bg-gradient-to-br from-primary-700 via-secondary-700 to-primary-900 text-white
                    overflow-hidden"
    >
      <div
        className="grid place-items-center h-16 w-16 rounded-3xl
                      bg-white/10 backdrop-blur ring-1 ring-white/20 animate-fade-in"
      >
        <Sparkles className="h-8 w-8 text-accent-400" />
      </div>

      {error ? (
        <div className="flex flex-col items-center gap-5 max-w-sm text-center animate-slide-up">
          <XCircle className="h-10 w-10 text-red-300" />
          <div>
            <p className="font-semibold text-lg">
              Não foi possível concluir o login
            </p>
            <p className="text-sm text-white/70 mt-1">
              Algo deu errado durante a autenticação com o Google.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate("/login", { replace: true })}
          >
            Voltar para o login
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 animate-fade-in">
          <Loader2 className="h-6 w-6 animate-spin text-accent-400" />
          <p className="text-sm text-white/75">Concluindo login…</p>
        </div>
      )}
    </div>
  );
}
