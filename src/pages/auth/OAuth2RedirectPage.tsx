import { useAuth } from "@/hooks/useAuth";
import { Loader2, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export function OAuth2RedirectPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { completeOAth2Login } = useAuth();
  const [error, setError] = useState(false);
  const handle = useRef(false);

  useEffect(() => {
    if (handle.current) return;
    handle.current = true;

    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken");
    const expiresInRaw = params.get("expiresIn");
    const tokenType = params.get("tokenType") ?? "Bearer";

    if (!accessToken || !refreshToken || !expiresInRaw) {
      setError(true);
      return;
    }

    const ok = completeOAth2Login({
      accessToken,
      refreshToken,
      tokenType,
      expiresIn: Number(expiresInRaw),
    });

    if (ok) navigate("/", { replace: true });
    else setError(true);
  }, [params, completeOAth2Login, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-5 px-6 bg-gradient-to-br from-primary-700 via-secondary-700 to-primary-900 text-white">
      <div className="h-14 w-14 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center">
        <Sparkles className="h-7 w-7 text-accent-400" />
      </div>

      {error ? (
        <>
          <p className="font-medium text-center">
            Não foi possível concluir o login.
          </p>
          <button
            onClick={() => navigate("/login", { replace: true })}
            className="text-sm text-accent-300 hover:text-accent-200 underline-offset-4 hover:underline"
          >
            Voltar para o login
          </button>
        </>
      ) : (
        <>
          <Loader2 className="h-6 w-6 animate-spin text-accent-400" />
          <p className="text-sm text-white/75">Concluindo login…</p>
        </>
      )}
    </div>
  );
}
