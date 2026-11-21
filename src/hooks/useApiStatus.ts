import { healthService, type ApiStatus } from "@/services/health/HealthService";
import { useEffect, useState } from "react";

export function useApiStatus() {
  const [status, setStatus] = useState<ApiStatus>(healthService.getStatus());

  useEffect(() => {
    return healthService.subscribe(setStatus);
  }, []);

  return {
    status,
    isOnline: status === "online",
    isChecking: status === "checking",
    isOffline: status === "offline",
    retry: () => void healthService.checkNow(),
  };
}
