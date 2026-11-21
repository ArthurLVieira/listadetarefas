import axios from "axios";
import { env } from "@/config/env";

export type ApiStatus = "online" | "offline" | "checking" | "unknown";
export type HealthListener = (status: ApiStatus) => void;

interface Options {
  healthPath: string;
  onlinePollIntervalMs: number;
  offlinePollIntervalMs: number;
  pingTimeoutMs: number;
  failureThreshold: number;
}

const DEFAULTS: Options = {
  healthPath: "/actuator/health",
  onlinePollIntervalMs: 30_000,
  offlinePollIntervalMs: 5_000,
  pingTimeoutMs: 4_000,
  failureThreshold: 2,
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
    listener(this.status);
    return () => this.listeners.delete(listener);
  }

  reportFailure(): void {
    this.consecutiveFailures++;
    if (this.consecutiveFailures >= this.opts.failureThreshold) {
      this.setStatus("offline");
    }
  }

  reportSuccess(): void {
    this.consecutiveFailures = 0;
    if (this.status !== "online") {
      this.setStatus("online");
    }
  }

  async checkNow(): Promise<ApiStatus> {
    return this.check();
  }

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
      await axios.get(`${env.hostUrl}${this.opts.healthPath}`, {
        timeout: this.opts.pingTimeoutMs,
      });
      this.consecutiveFailures = 0;
      this.setStatus("online");
    } catch {
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
