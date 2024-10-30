import type { ErrorInfo } from "@/types/error";
import { MonitorService } from "./monitor";

export class ErrorService {
  private static instance: ErrorService;
  private monitor: MonitorService;
  private apiEndpoint: string;

  private constructor() {
    this.monitor = MonitorService.getInstance();
    this.apiEndpoint = import.meta.env.VITE_ERROR_API || "/api/error";
    this.setupGlobalHandlers();
  }

  static getInstance(): ErrorService {
    if (!ErrorService.instance) {
      ErrorService.instance = new ErrorService();
    }
    return ErrorService.instance;
  }

  private setupGlobalHandlers() {
    // 全局错误处理
    window.addEventListener("error", (event) => {
      this.reportError({
        type: "runtime",
        message: event.message,
        stack: event.error?.stack,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      });
    });

    // Promise 错误处理
    window.addEventListener("unhandledrejection", (event) => {
      this.reportError({
        type: "promise",
        message: event.reason?.message || "Promise rejection",
        stack: event.reason?.stack,
      });
    });
  }

  async reportError(error: ErrorInfo) {
    const errorInfo = {
      ...error,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
    };

    try {
      await fetch(this.apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(errorInfo),
      });
    } catch (e) {
      console.error("Failed to report error:", e);
    }

    // 同时记录性能指标
    this.monitor.reportMetrics({
      type: "error",
      name: error.type,
      value: 1,
    });
  }
}
