export interface PerformanceThresholds {
  domComplete: number;
  domContentLoaded: number;
  loadTime: number;
  firstPaint: number;
  firstContentfulPaint: number;
  ttfb: number;
  fps: number;
  memoryUsage: number;
  resourceLoadTime: number;
}

export interface PerformanceMetrics {
  pageLoad: {
    domComplete: number;
    domContentLoaded: number;
    loadTime: number;
    firstPaint: number;
    firstContentfulPaint: number;
    ttfb: number;
  };
  fps: number;
  memory?: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
  };
  resources: Array<{
    name: string;
    duration: number;
    size: number;
    type: string;
  }>;
  timing: {
    fcp: number;
    lcp: number;
    fid: number;
    cls: number;
    dnsLookup: number;
    tcpConnection: number;
    request: number;
    response: number;
    domProcessing: number;
  };
  networkInfo?: {
    effectiveType: string;
    downlink: number;
    rtt: number;
  };
}

export interface PerformanceAlert {
  metric: string;
  value: number;
  threshold: number;
  timestamp: number;
  severity: 'warning' | 'error';
} 