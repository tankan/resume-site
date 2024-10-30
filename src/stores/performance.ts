import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { PerformanceMetrics, PerformanceThresholds, PerformanceAlert } from '../types/performance';

export const usePerformanceStore = defineStore('performance', () => {
  const metrics = ref<PerformanceMetrics[]>([]);
  const isCollecting = ref(false);
  const alerts = ref<PerformanceAlert[]>([]);
  
  // 性能阈值设置
  const thresholds = ref<PerformanceThresholds>({
    domComplete: 2000,
    domContentLoaded: 1500,
    loadTime: 3000,
    firstPaint: 1000,
    firstContentfulPaint: 1500,
    ttfb: 500,
    fps: 30,
    memoryUsage: 80,
    resourceLoadTime: 1000
  });

  // 检查性能指标是否超过阈值
  const checkThresholds = (metrics: PerformanceMetrics) => {
    const checks = [
      {
        metric: 'domComplete',
        value: metrics.pageLoad.domComplete,
        threshold: thresholds.value.domComplete
      },
      {
        metric: 'loadTime',
        value: metrics.pageLoad.loadTime,
        threshold: thresholds.value.loadTime
      },
      {
        metric: 'fps',
        value: metrics.fps,
        threshold: thresholds.value.fps,
        compare: (v: number, t: number) => v < t
      }
    ];

    checks.forEach(({ metric, value, threshold, compare = (v, t) => v > t }) => {
      if (compare(value, threshold)) {
        alerts.value.push({
          metric,
          value,
          threshold,
          timestamp: Date.now(),
          severity: value > threshold * 1.5 ? 'error' : 'warning'
        });
      }
    });
  };

  // 计算性能趋势数据
  const performanceTrends = computed(() => ({
    loadTimes: metrics.value.map((m: PerformanceMetrics) => m.pageLoad.loadTime),
    fcpTimes: metrics.value.map((m: PerformanceMetrics) => m.pageLoad.firstContentfulPaint),
    fpTimes: metrics.value.map((m: PerformanceMetrics) => m.pageLoad.firstPaint),
    fps: metrics.value.map((m: PerformanceMetrics) => m.fps),
    memory: metrics.value.map((m: PerformanceMetrics) => m.memory ? 
      (m.memory.usedJSHeapSize / m.memory.totalJSHeapSize) * 100 : 0
    )
  }));

  // FPS 计算
  let frameCount = 0;
  let lastTime = performance.now();
  let animationFrameId: number;
  
  const calculateFPS = () => {
    if (!isCollecting.value) return;

    const now = performance.now();
    frameCount++;
    
    if (now - lastTime >= 1000) {
      // 使用 requestAnimationFrame 进行节流
      requestAnimationFrame(() => {
        const fps = Math.round((frameCount * 1000) / (now - lastTime));
        frameCount = 0;
        lastTime = now;
        
        // 只在 FPS 发生显著变化时更新
        const lastMetric = metrics.value[metrics.value.length - 1];
        if (!lastMetric || Math.abs(lastMetric.fps - fps) > 5) {
          updateMetrics({ fps });
        }
      });
    }
    
    animationFrameId = requestAnimationFrame(calculateFPS);
  };

  // 更新指标数据
  const updateMetrics = (newData: Partial<PerformanceMetrics>) => {
    const lastMetric = metrics.value[metrics.value.length - 1] || createEmptyMetrics();
    const updatedMetric = {
      ...lastMetric,
      ...newData,
      timestamp: Date.now()
    } as PerformanceMetrics;
    
    // 检查是否有实质性变化
    if (hasSignificantChanges(lastMetric, updatedMetric)) {
      metrics.value.push(updatedMetric);
      // 限制存储的历史数据量
      if (metrics.value.length > 100) {
        metrics.value.shift();
      }
      checkThresholds(updatedMetric);
    }
  };

  // 创建空的指标数据结构
  const createEmptyMetrics = (): PerformanceMetrics => ({
    pageLoad: {
      domComplete: 0,
      domContentLoaded: 0,
      loadTime: 0,
      firstPaint: 0,
      firstContentfulPaint: 0,
      ttfb: 0
    },
    fps: 0,
    resources: [],
    timing: {
      fcp: 0,
      lcp: 0,
      fid: 0,
      cls: 0,
      dnsLookup: 0,
      tcpConnection: 0,
      request: 0,
      response: 0,
      domProcessing: 0
    }
  });

  // 检查指标是否有显著变化
  const hasSignificantChanges = (oldMetrics: PerformanceMetrics, newMetrics: PerformanceMetrics): boolean => {
    // FPS 变化超过 5
    if (Math.abs(oldMetrics.fps - newMetrics.fps) > 5) return true;
    
    // 内存使用变化超过 5%
    if (oldMetrics.memory && newMetrics.memory) {
      const oldUsage = oldMetrics.memory.usedJSHeapSize / oldMetrics.memory.totalJSHeapSize;
      const newUsage = newMetrics.memory.usedJSHeapSize / newMetrics.memory.totalJSHeapSize;
      if (Math.abs(oldUsage - newUsage) > 0.05) return true;
    }
    
    // 加载时间变化超过 100ms
    if (Math.abs(oldMetrics.pageLoad.loadTime - newMetrics.pageLoad.loadTime) > 100) return true;
    
    // 网络延迟变化超过 50ms
    if (oldMetrics.networkInfo && newMetrics.networkInfo) {
      if (Math.abs(oldMetrics.networkInfo.rtt - newMetrics.networkInfo.rtt) > 50) return true;
    }
    
    // 资源数量变化
    if (oldMetrics.resources.length !== newMetrics.resources.length) return true;
    
    return false;
  };

  // 优化性能数据收集
  const collectPerformanceData = () => {
    if (!isCollecting.value) return;

    try {
      const performance = window.performance;
      const entries = performance.getEntriesByType('navigation');
      const navigation = entries[0] as PerformanceNavigationTiming;
      
      if (!navigation) {
        console.warn('Navigation timing data not available');
        return;
      }

      // 收集页面加载相关指标
      const pageLoadMetrics = {
        pageLoad: {
          domComplete: navigation.domComplete || 0,
          domContentLoaded: navigation.domContentLoadedEventEnd || 0,
          loadTime: navigation.loadEventEnd || 0,
          firstPaint: 0,
          firstContentfulPaint: 0,
          ttfb: navigation.responseStart ? (navigation.responseStart - navigation.requestStart) : 0
        }
      };

      // 收集绘制时间
      const paintEntries = performance.getEntriesByType('paint');
      paintEntries.forEach(entry => {
        if (entry.name === 'first-paint') {
          pageLoadMetrics.pageLoad.firstPaint = entry.startTime;
        }
        if (entry.name === 'first-contentful-paint') {
          pageLoadMetrics.pageLoad.firstContentfulPaint = entry.startTime;
        }
      });

      // 收集资源加载性能
      const resourceEntries = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      const resources = resourceEntries
        .filter(entry => 
          entry.initiatorType !== 'fetch' && 
          entry.initiatorType !== 'xmlhttprequest'
        )
        .map(resource => ({
          name: resource.name,
          duration: resource.duration,
          size: resource.transferSize || 0,
          type: getResourceType(resource.initiatorType)
        }));

      // 按资源类型分类统计
      const resourceStats = {
        script: resources.filter(r => r.type === 'script'),
        stylesheet: resources.filter(r => r.type === 'css' || r.type === 'stylesheet'),
        image: resources.filter(r => r.type === 'img' || r.type === 'image'),
        font: resources.filter(r => r.type === 'font'),
        other: resources.filter(r => !['script', 'css', 'stylesheet', 'img', 'image', 'font'].includes(r.type))
      };

      // 收集网络信息
      const networkInfo = (navigator as any).connection;
      const networkMetrics = networkInfo ? {
        networkInfo: {
          effectiveType: networkInfo.effectiveType,
          downlink: networkInfo.downlink,
          rtt: networkInfo.rtt
        }
      } : {};

      // 收集内存信息
      const performanceMemory = (performance as any).memory;
      const memoryMetrics = performanceMemory ? {
        memory: {
          usedJSHeapSize: performanceMemory.usedJSHeapSize || 0,
          totalJSHeapSize: performanceMemory.totalJSHeapSize || 0
        }
      } : {};

      // 集请求时序息
      const timingMetrics = {
        timing: {
          dnsLookup: navigation.domainLookupEnd - navigation.domainLookupStart,
          tcpConnection: navigation.connectEnd - navigation.connectStart,
          request: navigation.responseStart - navigation.requestStart,
          response: navigation.responseEnd - navigation.responseStart,
          domProcessing: navigation.domComplete - navigation.responseEnd,
          fcp: pageLoadMetrics.pageLoad.firstContentfulPaint,
          lcp: getLargestContentfulPaint(),
          fid: getFirstInputDelay(),
          cls: getCumulativeLayoutShift()
        }
      };

      // 更新指标数据，确保所有必需的字段都存在
      updateMetrics({
        ...pageLoadMetrics,
        resources,
        ...networkMetrics,
        ...memoryMetrics,
        timing: {
          fcp: pageLoadMetrics.pageLoad.firstContentfulPaint,
          lcp: getLargestContentfulPaint(),
          fid: getFirstInputDelay(),
          cls: getCumulativeLayoutShift(),
          dnsLookup: navigation.domainLookupEnd - navigation.domainLookupStart,
          tcpConnection: navigation.connectEnd - navigation.connectStart,
          request: navigation.responseStart - navigation.requestStart,
          response: navigation.responseEnd - navigation.responseStart,
          domProcessing: navigation.domComplete - navigation.responseEnd
        }
      });

      // 清理性能条目以避免内存泄漏
      performance.clearResourceTimings();
      performance.clearMarks();
      performance.clearMeasures();
    } catch (error) {
      console.error('Error collecting performance data:', error);
      isCollecting.value = false;
    }
  };

  // 获取 Web Vitals 指标
  const getLargestContentfulPaint = () => {
    let lcp = 0;
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      lcp = lastEntry.startTime;
    });
    observer.observe({ entryTypes: ['largest-contentful-paint'] });
    return lcp;
  };

  interface FirstInputEntry extends PerformanceEntry {
    processingStart: number;
    startTime: number;
  }

  const getFirstInputDelay = () => {
    let fid = 0;
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries() as FirstInputEntry[];
      const firstInput = entries[0];
      fid = firstInput.processingStart - firstInput.startTime;
    });
    observer.observe({ entryTypes: ['first-input'] });
    return fid;
  };

  const getCumulativeLayoutShift = () => {
    let cls = 0;
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          cls += (entry as any).value;
        }
      }
    });
    observer.observe({ entryTypes: ['layout-shift'] });
    return cls;
  };

  // 资源类型映射
  const resourceTypeMap: Record<string, string> = {
    'script': 'script',
    'css': 'stylesheet',
    'stylesheet': 'stylesheet',
    'img': 'image',
    'image': 'image',
    'font': 'font',
    'video': 'video',
    'audio': 'audio',
    'link': 'link',
    'media': 'media',
    'document': 'document'
  };

  const getResourceType = (type: string): string => {
    return resourceTypeMap[type] || 'other';
  };

  return {
    metrics,
    alerts,
    thresholds,
    isCollecting,
    performanceTrends,
    startCollecting: () => {
      isCollecting.value = true;
      frameCount = 0;
      lastTime = performance.now();
      animationFrameId = requestAnimationFrame(calculateFPS);
      collectPerformanceData();
    },
    stopCollecting: () => {
      isCollecting.value = false;
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    },
    clearAlerts: () => {
      alerts.value = [];
    },
    updateThreshold: (metric: keyof PerformanceThresholds, value: number) => {
      thresholds.value[metric] = value;
    }
  };
}); 