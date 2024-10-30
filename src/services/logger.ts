type LogLevel = "info" | "warn" | "error" | "debug";

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: number;
  data?: any;
}

export class Logger {
  private static instance: Logger;
  private logQueue: LogEntry[] = [];
  private maxQueueSize: number = 100;
  private apiEndpoint: string;

  private constructor() {
    this.apiEndpoint = import.meta.env.VITE_LOG_API || "/api/logs";
    this.setupPeriodicFlush();
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private setupPeriodicFlush() {
    setInterval(() => {
      this.flush();
    }, 30000); // 每30秒刷新一次
  }

  private async flush() {
    if (this.logQueue.length === 0) return;

    const logs = [...this.logQueue];
    this.logQueue = [];

    try {
      await fetch(this.apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(logs),
      });
    } catch (error) {
      console.error("Failed to send logs:", error);
      // 失败时将日志放回队列前部
      this.logQueue.unshift(...logs);
    }
  }

  log(level: LogLevel, message: string, data?: any) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: Date.now(),
      data,
    };

    this.logQueue.push(entry);

    // 开发环境同时在控制台输出
    if (import.meta.env.DEV) {
      console[level](message, data);
    }

    if (this.logQueue.length >= this.maxQueueSize) {
      this.flush();
    }
  }

  info(message: string, data?: any) {
    this.log("info", message, data);
  }

  warn(message: string, data?: any) {
    this.log("warn", message, data);
  }

  error(message: string, data?: any) {
    this.log("error", message, data);
  }

  debug(message: string, data?: any) {
    this.log("debug", message, data);
  }
}
