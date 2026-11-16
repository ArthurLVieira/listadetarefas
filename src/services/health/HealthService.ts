// src/lib/health/HealthService.ts
import axios from "axios";
import { env } from "@/config/env";

export type ApiStatus = "online" | "offline" | "checking" | "unknown";
export type HealthListener = (status: ApiStatus) => void;

interface Options {
  /** Endpoint de health check. */
  healthPath: string;
  /** Intervalo do polling quando online (ms). */
  onlinePollIntervalMs: number;
  /** Intervalo do polling quando offline (ms) — mais rápido pra reconectar. */
  offlinePollIntervalMs: number;
  /** Timeout de cada ping (ms). */
  pingTimeoutMs: number;
  /** Nº de falhas consecutivas antes de marcar offline (evita flap). */
  failureThreshold: number;
}

const DEFAULTS: Options = {
  healthPath: "/actuator/health",
  onlinePollIntervalMs: 30_000,   // 30s quando ok
  offlinePollIntervalMs: 5_000,   // 5s quando offline (reconecta rápido)
  pingTimeoutMs: 4_000,
  failureThreshold: 2,            // 2 falhas antes de declarar offline
};

class HealthService {
  private status: ApiStatus = "unknown";
  private listeners = new Set<HealthListener>();
  private pollTimer: ReturnType<typeof setTimeout> | null = null;
  private consecutiveFailures = 0;
  private checkInFlight: Promise<ApiStatus> | null = null;
  private started = false;
  private opts: Options;

  constructor(options: Partial<Options> = {}) {
    this.opts = { ...DEFAULTS, ...options };
  }

  /** Idempotente — chama no boot da aplicação. */
  start(): void {
    if (this.started) return;
    this.started = true;
    void this.check();
  }

  stop(): void {
    this.started = false;
    if (this.pollTimer) {
      clearTimeout(this.pollTimer);
      this.pollTimer = null;
    }
  }

  getStatus(): ApiStatus {
    return this.status;
  }

  isOffline(): boolean {
    return this.status === "offline";
  }

  isOnline(): boolean {
    return this.status === "online";
  }

  subscribe(listener: HealthListener): () => void {
    this.listeners.add(listener);
    listener(this.status);              // dispara estado atual imediatamente
    return () => this.listeners.delete(listener);
  }

  /** Chamado pelo interceptor de response — feedback rápido sem esperar o poll. */
  reportFailure(): void {
    this.consecutiveFailures++;
    if (this.consecutiveFailures >= this.opts.failureThreshold) {
      this.setStatus("offline");
    }
  }

  /** Chamado pelo interceptor de request — sucesso volta a "online". */
  reportSuccess(): void {
    this.consecutiveFailures = 0;
    if (this.status !== "online") {
      this.setStatus("online");
    }
  }

  /** Força um ping imediato (útil para um botão "Tentar novamente"). */
  async checkNow(): Promise<ApiStatus> {
    return this.check();
  }

  /* ── Internals ─────────────────────────────────────── */

  private async check(): Promise<ApiStatus> {
    if (this.checkInFlight) return this.checkInFlight;

    this.checkInFlight = this.doCheck().finally(() => {
      this.checkInFlight = null;
    });
    return this.checkInFlight;
  }

  private async doCheck(): Promise<ApiStatus> {
    this.setStatus("checking");

    try {
      await axios.get(`${env.apiUrl}${this.opts.healthPath}`, {
        timeout: this.opts.pingTimeoutMs,
        // não dispara interceptors do `api` — axios "cru"
      });
      this.consecutiveFailures = 0;
      this.setStatus("online");
    } catch {
      // Falha no ping NÃO conta para o threshold (é o próprio ping).
      this.setStatus("offline");
    } finally {
      this.scheduleNext();
    }

    return this.status;
  }

  private scheduleNext(): void {
    if (this.pollTimer) clearTimeout(this.pollTimer);
    if (!this.started) return;

    const interval =
      this.status === "online"
        ? this.opts.onlinePollIntervalMs
        : this.opts.offlinePollIntervalMs;

    this.pollTimer = setTimeout(() => void this.check(), interval);
  }

  private setStatus(next: ApiStatus): void {
    if (this.status === next) return;
    this.status = next;
    this.listeners.forEach((l) => l(next));
  }
}

export const healthService = new HealthService();