export interface ErrorInfo {
  type: "runtime" | "promise" | "vue" | "network";
  message: string;
  stack?: string;
  filename?: string;
  lineno?: number;
  colno?: number;
  timestamp?: number;
  url?: string;
  userAgent?: string;
}
