<template>
  <div class="performance-monitor">
    <el-card class="monitor-card" :body-style="{ padding: '20px' }">
      <template #header>
        <div class="card-header">
          <div class="title">
            <el-icon><DataLine /></el-icon>
            <span>{{ t('performance.title') }}</span>
          </div>
          <div class="controls">
            <el-button 
              v-if="store.alerts.length > 0"
              type="warning" 
              size="small"
              @click="showAlerts = true"
            >
              <el-icon><Warning /></el-icon>
              {{ t('performance.alert') }} ({{ store.alerts.length }})
            </el-button>
            <el-switch
              v-model="isCollecting"
              @change="handleCollectionChange"
              :active-text="t('performance.monitoring')"
              :inactive-text="t('performance.stopped')"
              inline-prompt
            />
          </div>
        </div>
      </template>
      
      <div class="metrics-container">
        <!-- 性能指标部分 -->
        <div class="metrics-section">
          <h3 class="section-title">
            <el-icon><Timer /></el-icon>
            {{ t('performance.sections.pageLoad') }}
          </h3>
          <div class="charts-row">
            <div ref="loadTimeChart" class="chart-wrapper">
              <div class="chart"></div>
            </div>
            <div ref="paintTimesChart" class="chart-wrapper">
              <div class="chart"></div>
            </div>
          </div>
        </div>

        <!-- 资源加载部分 -->
        <div class="metrics-section">
          <h3 class="section-title">
            <el-icon><Files /></el-icon>
            {{ t('performance.sections.resources') }}
          </h3>
          <div class="charts-row">
            <div ref="resourceLoadChart" class="chart-wrapper">
              <div class="chart"></div>
            </div>
            <div ref="resourceSizeChart" class="chart-wrapper">
              <div class="chart"></div>
            </div>
          </div>
        </div>

        <!-- 用户交互部分 -->
        <div class="metrics-section">
          <h3 class="section-title">
            <el-icon><Monitor /></el-icon>
            {{ t('performance.sections.interaction') }}
          </h3>
          <div class="charts-row">
            <div ref="fpsChart" class="chart-wrapper">
              <div class="chart"></div>
            </div>
            <div ref="memoryChart" class="chart-wrapper">
              <div class="chart"></div>
            </div>
          </div>
        </div>

        <!-- 网络性能部分 -->
        <div class="metrics-section">
          <h3 class="section-title">
            <el-icon><Connection /></el-icon>
            {{ t('performance.sections.network') }}
          </h3>
          <div class="charts-row">
            <div ref="networkSpeedChart" class="chart-wrapper">
              <div class="chart"></div>
            </div>
            <div ref="requestTimingChart" class="chart-wrapper">
              <div class="chart"></div>
            </div>
          </div>
        </div>

        <!-- 指标表格 -->
        <el-table 
          :data="getLatestMetrics" 
          stripe 
          class="metrics-table"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
        >
          <el-table-column 
            prop="category" 
            :label="t('common.category')" 
            width="200"
            :show-overflow-tooltip="true"
          />
          <el-table-column 
            prop="name" 
            :label="t('common.metrics')" 
            min-width="300"
            :show-overflow-tooltip="true"
          />
          <el-table-column 
            prop="value" 
            :label="t('common.value')" 
            width="120" 
            align="right"
          >
            <template #default="scope">
              {{ formatMetricValue(scope.row.name, scope.row.value) }}
            </template>
          </el-table-column>
          <el-table-column 
            prop="unit" 
            :label="t('common.unit')" 
            width="100" 
            align="center"
          />
          <el-table-column 
            :label="t('common.status')" 
            width="100" 
            align="center"
          >
            <template #default="scope">
              <el-tag 
                :type="getStatusType(scope.row.name, scope.row.value)"
                size="small"
                effect="light"
              >
                {{ getStatusText(scope.row.name, scope.row.value) }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>

    <!-- 性能警告弹窗 -->
    <el-dialog
      v-model="showAlerts"
      :title="t('performance.alerts.title')"
      width="50%"
    >
      <el-timeline>
        <el-timeline-item
          v-for="alert in store.alerts"
          :key="alert.timestamp"
          :type="alert.severity === 'error' ? 'danger' : 'warning'"
          :timestamp="new Date(alert.timestamp).toLocaleString()"
        >
          {{ t(`performance.metrics.${alert.metric}`) }}:
          {{ alert.value.toFixed(2) }}
          ({{ t('performance.alerts.threshold') }}: {{ alert.threshold }})
        </el-timeline-item>
      </el-timeline>
      <template #footer>
        <el-button @click="store.clearAlerts">
          {{ t('performance.alerts.clear') }}
        </el-button>
      </template>
    </el-dialog>

    <!-- 阈值设置抽屉 -->
    <el-drawer
      v-model="showSettings"
      :title="t('performance.settings.thresholds')"
      direction="rtl"
    >
      <div class="threshold-settings">
        <div v-for="(threshold, key) in store.thresholds" :key="key" class="threshold-item">
          <span>{{ t(`performance.metrics.${key}`) }}</span>
          <el-input-number 
            v-model="store.thresholds[key]"
            :min="0"
            @change="(val: number | undefined) => val !== undefined && store.updateThreshold(key, val)"
          />
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed, onUnmounted, nextTick } from 'vue';
import { usePerformanceStore } from '@/stores/performance';
import { useI18n } from 'vue-i18n';
import * as echarts from 'echarts';
import type { EChartsOption } from 'echarts';
import type { PerformanceMetrics } from '@/types/performance';
import type { EChartsInitOpts } from 'echarts/types/dist/shared';
// 导入 Element Plus 图标
import {
  DataLine,
  Warning,
  Timer,
  Files,
  Monitor,
  Connection
} from '@element-plus/icons-vue';

const { t } = useI18n();
const store = usePerformanceStore();
const loadTimeChart = ref<HTMLElement | null>(null);
const paintTimesChart = ref<HTMLElement | null>(null);
const resourceLoadChart = ref<HTMLElement | null>(null);
const resourceSizeChart = ref<HTMLElement | null>(null);
const fpsChart = ref<HTMLElement | null>(null);
const memoryChart = ref<HTMLElement | null>(null);
const networkSpeedChart = ref<HTMLElement | null>(null);
const requestTimingChart = ref<HTMLElement | null>(null);
const isCollecting = ref(true);
const showAlerts = ref(false);
const showSettings = ref(false);



// 修改图表配置，添加通用样式
const getChartBaseOption = (title: string): EChartsOption => ({
  title: { 
    text: title,
    textStyle: {
      fontSize: 14,
      fontWeight: 'normal'
    },
    left: 'center',
    top: 10
  },
  grid: {
    top: 60,
    right: 20,
    bottom: 30,
    left: 50,
    containLabel: true
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      crossStyle: {
        color: '#999'
      }
    }
  },
  legend: {
    top: 30,
    textStyle: {
      fontSize: 12
    }
  }
});

// 修改图表初始化选项，只使用支持的选项
const chartInitOptions: EChartsInitOpts = {
  renderer: 'canvas',
  devicePixelRatio: window.devicePixelRatio,
  width: 'auto',
  height: 'auto',
  locale: 'ZH',
  useDirtyRect: true // 优化渲染性能
};

// 添加图表事件处理函数
const addChartEventListeners = (chart: echarts.ECharts) => {
  const zr = chart.getZr();
  zr.on('mousemove', () => {}, { passive: true });
  zr.on('mousewheel', () => {}, { passive: true });
  zr.on('touchstart', () => {}, { passive: true });
  zr.on('touchmove', () => {}, { passive: true });
};

// 定义资源类型常量
const RESOURCE_TYPES = ['script', 'stylesheet', 'image', 'font', 'media', 'other'] as const;

// 修改资源加载图表初始化函数
const initResourceLoadChart = () => {
  if (resourceLoadChart.value) {
    const chart = echarts.init(resourceLoadChart.value.querySelector('.chart') as HTMLElement);
    const option: EChartsOption = {
      title: { text: t('performance.charts.resourceLoad') },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' }
      },
      legend: {
        data: RESOURCE_TYPES.map(type => t(`performance.resourceTypes.${type}`))
      },
      xAxis: { type: 'category', data: [t('performance.charts.resourceCount')] },
      yAxis: { type: 'value' },
      series: RESOURCE_TYPES.map(type => ({
        name: t(`performance.resourceTypes.${type}`),
        type: 'bar',
        stack: 'total',
        data: [0]
      }))
    };
    chart.setOption(option);
  }
};

// 修改资源加载图表更新函数
const updateResourceLoadChart = (latest: PerformanceMetrics) => {
  if (resourceLoadChart.value) {
    const chart = echarts.getInstanceByDom(resourceLoadChart.value.querySelector('.chart') as HTMLElement);
    if (chart) {
      const resourceCounts = RESOURCE_TYPES.reduce((acc, type) => {
        acc[type] = latest.resources.filter(r => r.type === type).length;
        return acc;
      }, {} as Record<string, number>);

      const series = RESOURCE_TYPES.map(type => ({
        name: t(`performance.resourceTypes.${type}`),
        type: 'bar',
        stack: 'total',
        data: [resourceCounts[type]]
      }));

      chart.setOption({
        series: series
      });
    }
  }
};

// 修改图表初始化和更新函数中的 DOM 操作
const getChartDom = (element: HTMLElement | null): HTMLElement | null => {
  return element?.querySelector('.chart') as HTMLElement;
};

// 修改图表初始化逻辑
const initCharts = () => {
  // 清理现有图表实例
  [loadTimeChart, paintTimesChart, fpsChart, memoryChart, resourceLoadChart, 
   resourceSizeChart, networkSpeedChart, requestTimingChart].forEach(chartRef => {
    if (chartRef.value) {
      const chartDom = getChartDom(chartRef.value);
      if (chartDom) {
        const existingChart = echarts.getInstanceByDom(chartDom);
        if (existingChart) {
          existingChart.dispose();
        }
      }
    }
  });

  // 初始化各个图表
  initLoadTimeChart();
  initPaintTimesChart();
  initFpsChart();
  initMemoryChart();
  initResourceLoadChart();
  initResourceSizeChart();
  initNetworkSpeedChart();
  initRequestTimingChart();
};

// 优化窗口大小变化处理
const handleResize = () => {
  [loadTimeChart, paintTimesChart, fpsChart, memoryChart, resourceLoadChart, 
   resourceSizeChart, networkSpeedChart, requestTimingChart].forEach(chartRef => {
    if (chartRef.value) {
      const chartDom = getChartDom(chartRef.value);
      if (chartDom) {
        const chart = echarts.getInstanceByDom(chartDom);
        chart?.resize({
          animation: {
            duration: 300,
            easing: 'cubicInOut'
          }
        });
      }
    }
  });
};

// 优化事件监听器
onMounted(() => {
  initCharts();
  window.addEventListener('resize', handleResize, { passive: true });
  // 添加其他事件监听器
  const chartContainers = document.querySelectorAll('.chart');
  chartContainers.forEach(container => {
    container.addEventListener('mousewheel', () => {}, { passive: true });
    container.addEventListener('touchstart', () => {}, { passive: true });
    container.addEventListener('touchmove', () => {}, { passive: true });
  });
  // 自动开启监控
  store.startCollecting();
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  // 移除其他事件监听器
  const chartContainers = document.querySelectorAll('.chart');
  chartContainers.forEach(container => {
    container.removeEventListener('mousewheel', () => {});
    container.removeEventListener('touchstart', () => {});
    container.removeEventListener('touchmove', () => {});
  });

  if (isCollecting.value) {
    store.stopCollecting();
  }
  // 清理图表实例
  const chartRefs = [
    loadTimeChart, paintTimesChart, resourceLoadChart, resourceSizeChart,
    fpsChart, memoryChart, networkSpeedChart, requestTimingChart
  ];
  
  chartRefs.forEach(chartRef => {
    if (chartRef.value) {
      const chartDom = getChartDom(chartRef.value);
      if (chartDom) {
        const chart = echarts.getInstanceByDom(chartDom);
        chart?.dispose();
      }
    }
  });
});

// 监听语言变化，重新初始化图表
watch(() => t('performance.charts.loadTime'), () => {
  nextTick(() => {
    initCharts();
  });
});

// 更新所有图表数据
watch(() => store.metrics, (newMetrics: PerformanceMetrics[]) => {
  if (newMetrics.length === 0) return;
  
  const timeLabels = newMetrics.map((_, index) => 
    `${t('performance.charts.sample')}${index + 1}`
  );
  const latest = newMetrics[newMetrics.length - 1];

  // 更新页面加载时间图表
  if (loadTimeChart.value) {
    const chartDom = getChartDom(loadTimeChart.value);
    if (chartDom) {
      const chart = echarts.getInstanceByDom(chartDom);
      if (chart) {
        const loadTimeData = newMetrics.map(m => ({
          loadTime: Number((m.pageLoad.loadTime || 0).toFixed(2)),
          domComplete: Number((m.pageLoad.domComplete || 0).toFixed(2)),
          domContentLoaded: Number((m.pageLoad.domContentLoaded || 0).toFixed(2))
        }));

        chart.setOption({
          xAxis: { data: timeLabels },
          series: [
            { 
              data: loadTimeData.map(d => d.loadTime),
              name: t('performance.metrics.loadTime')
            },
            { 
              data: loadTimeData.map(d => d.domComplete),
              name: t('performance.metrics.domComplete')
            },
            { 
              data: loadTimeData.map(d => d.domContentLoaded),
              name: t('performance.metrics.domContentLoaded')
            }
          ]
        });
      }
    }
  }

  // 更新绘制时间图表
  if (paintTimesChart.value) {
    const chartDom = getChartDom(paintTimesChart.value);
    if (chartDom) {
      const chart = echarts.getInstanceByDom(chartDom);
      if (chart) {
        chart.setOption({
          xAxis: { data: timeLabels },
          series: [
            { data: newMetrics.map(m => m.pageLoad.firstPaint) },
            { data: newMetrics.map(m => m.pageLoad.firstContentfulPaint) }
          ]
        });
      }
    }
  }

  // 更新FPS图表
  if (fpsChart.value) {
    const chartDom = getChartDom(fpsChart.value);
    if (chartDom) {
      const chart = echarts.getInstanceByDom(chartDom);
      if (chart) {
        chart.setOption({
          series: [{
            data: [{ value: latest.fps }]
          }]
        });
      }
    }
  }

  // 更新内存使用图表
  if (memoryChart.value) {
    const chartDom = getChartDom(memoryChart.value);
    if (chartDom) {
      const chart = echarts.getInstanceByDom(chartDom);
      if (chart) {
        const memoryData = newMetrics.map(m => 
          m.memory ? (m.memory.usedJSHeapSize / 1024 / 1024).toFixed(2) : 0
        );
        chart.setOption({
          xAxis: { data: timeLabels },
          series: [{ data: memoryData }]
        });
      }
    }
  }

  // 更新资源加载图表
  if (resourceLoadChart.value) {
    const chartDom = getChartDom(resourceLoadChart.value);
    if (chartDom) {
      const chart = echarts.getInstanceByDom(chartDom);
      if (chart) {
        const resourceCounts = latest.resources.reduce((acc, r) => {
          acc[r.type] = (acc[r.type] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        chart.setOption({
          tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' }
          },
          legend: {
            data: Object.keys(resourceCounts).map(type => t(`performance.resourceTypes.${type}`))
          },
          xAxis: { type: 'category', data: [t('performance.charts.resourceCount')] },
          yAxis: { type: 'value' },
          series: Object.entries(resourceCounts).map(([type, count]) => ({
            name: t(`performance.resourceTypes.${type}`),
            type: 'bar',
            stack: 'total',
            data: [count]
          }))
        });
      }
    }
  }

  // 更新资源大小图表
  if (resourceSizeChart.value) {
    const chartDom = getChartDom(resourceSizeChart.value);
    if (chartDom) {
      const chart = echarts.getInstanceByDom(chartDom);
      if (chart) {
        const resourceSizes = latest.resources.reduce((acc, r) => {
          acc[r.type] = (acc[r.type] || 0) + (r.size / 1024 / 1024); // 转换为 MB
          return acc;
        }, {} as Record<string, number>);

        chart.setOption({
          series: [{
            type: 'pie',
            data: Object.entries(resourceSizes).map(([type, size]) => ({
              name: t(`performance.resourceTypes.${type}`),
              value: Number(size.toFixed(2))
            }))
          }]
        });
      }
    }
  }

  // 更新网络速度图表
  if (networkSpeedChart.value) {
    const chartDom = getChartDom(networkSpeedChart.value);
    if (chartDom) {
      const chart = echarts.getInstanceByDom(chartDom);
      if (chart) {
        const networkData = newMetrics.map(m => m.networkInfo?.downlink || 0);
        chart.setOption({
          xAxis: { data: timeLabels },
          series: [{ data: networkData }]
        });
      }
    }
  }

  // 更新请求时序图表
  if (requestTimingChart.value && latest.timing) {
    const chartDom = getChartDom(requestTimingChart.value);
    if (chartDom) {
      const chart = echarts.getInstanceByDom(chartDom);
      if (chart) {
        const timingData = [
          { name: t('performance.metrics.dns'), value: latest.timing.dnsLookup || 0 },
          { name: t('performance.metrics.tcp'), value: latest.timing.tcpConnection || 0 },
          { name: t('performance.metrics.request'), value: latest.timing.request || 0 },
          { name: t('performance.metrics.response'), value: latest.timing.response || 0 },
          { name: t('performance.metrics.processing'), value: latest.timing.domProcessing || 0 }
        ].map(item => ({
          ...item,
          value: Number(item.value.toFixed(2))
        }));

        chart.setOption({
          yAxis: { data: timingData.map(item => item.name) },
          series: [{
            type: 'bar',
            data: timingData
          }]
        });
      }
    }
  }
}, { deep: true });

// 添加计算属性来获取最新的指标数据
const getLatestMetrics = computed(() => {
  if (store.metrics.length === 0) return [];
  
  const latest = store.metrics[store.metrics.length - 1];
  return [
    // 页面加载性能
    {
      category: t('performance.sections.pageLoad'),
      name: t('performance.metrics.loadTime'),
      value: latest.pageLoad.loadTime,
      unit: t('performance.units.milliseconds')
    },
    {
      category: t('performance.sections.pageLoad'),
      name: t('performance.metrics.domComplete'),
      value: latest.pageLoad.domComplete,
      unit: t('performance.units.milliseconds')
    },
    // ... 其他页面加载指标 ...

    // 资源加载性能
    {
      category: t('performance.sections.resources'),
      name: t('performance.metrics.resourceCount'),
      value: latest.resources.length,
      unit: t('common.count')
    },
    {
      category: t('performance.sections.resources'),
      name: t('performance.metrics.totalResourceSize'),
      value: latest.resources.reduce((sum: number, r: { size: number }) => sum + r.size, 0) / 1024 / 1024,
      unit: t('performance.units.megabytes')
    },
    // ... 其他资源指标 ...

    // 用户交互性能
    {
      category: t('performance.sections.interaction'),
      name: t('performance.metrics.fps'),
      value: latest.fps,
      unit: t('performance.units.fps')
    },
    {
      category: t('performance.sections.interaction'),
      name: t('performance.metrics.memoryUsage'),
      value: latest.memory ? 
        (latest.memory.usedJSHeapSize / latest.memory.totalJSHeapSize * 100) : 0,
      unit: t('performance.units.percentage')
    },
    // ... 其他交互指标 ...

    // 网络性能
    {
      category: t('performance.sections.network'),
      name: t('performance.metrics.ttfb'),
      value: latest.pageLoad.ttfb,
      unit: t('performance.units.milliseconds')
    }
    // ... 其他网络指标 ...
  ];
});

// 取状态类型
const getStatusType = (metric: string, value: number) => {
  const threshold = store.thresholds[metric as keyof typeof store.thresholds];
  if (!threshold) return 'info';
  if (value > threshold * 1.5) return 'danger';
  if (value > threshold) return 'warning';
  return 'success';
};

// 获取状态文本
const getStatusText = (metric: string, value: number) => {
  const type = getStatusType(metric, value);
  return t(`performance.status.${type}`);
};

// 更新所有图表
watch(() => store.performanceTrends, (trends: any) => {
  const timeLabels = trends.loadTimes.map((_: any, index: number) => 
    `${t('performance.charts.sample')}${index + 1}`
  );

  // 更新加载时间图表
  if (loadTimeChart.value) {
    const chartDom = getChartDom(loadTimeChart.value);
    if (chartDom) {
      const chart = echarts.getInstanceByDom(chartDom);
      if (chart) {
        chart.setOption({
          xAxis: { data: timeLabels },
          series: [
            { data: trends.loadTimes },
            { data: trends.fcpTimes },
            { data: trends.fpTimes }
          ]
        });
      }
    }
  }

  // 更新FPS图表
  if (fpsChart.value) {
    const chartDom = getChartDom(fpsChart.value);
    if (chartDom) {
      const chart = echarts.getInstanceByDom(chartDom);
      if (chart) {
        const latestFPS = trends.fps[trends.fps.length - 1] || 60;
        chart.setOption({
          series: [{
            data: [{ value: latestFPS }]
          }]
        });
      }
    }
  }

  // 更新内存图表
  if (memoryChart.value) {
    const chartDom = getChartDom(memoryChart.value);
    if (chartDom) {
      const chart = echarts.getInstanceByDom(chartDom);
      if (chart) {
        chart.setOption({
          xAxis: { data: timeLabels },
          series: [{
            data: trends.memory
          }]
        });
      }
    }
  }
}, { deep: true });

// 添加指标值格式化函数
const formatMetricValue = (metric: string, value: number) => {
  // FPS 和百分比类指标保留整数
  if (metric === 'fps' || metric.includes('percentage')) {
    return Math.round(value);
  }
  // 内存相关指标保留 1 位小数
  if (metric.includes('memory') || metric.includes('Size')) {
    return value.toFixed(1);
  }
  // 时间相关指标保留 2 位小数
  if (metric.includes('Time') || metric.includes('Duration')) {
    return value.toFixed(2);
  }
  // 其他指标保留 2 位小数
  return value.toFixed(2);
};

// 修改图表初始化函数
const initLoadTimeChart = () => {
  if (loadTimeChart.value) {
    const chartDom = getChartDom(loadTimeChart.value);
    if (chartDom) {
      const chart = echarts.init(chartDom);
      const option: EChartsOption = {
        title: { text: t('performance.charts.loadTime') },
        tooltip: { trigger: 'axis' },
        legend: {
          data: [
            t('performance.metrics.loadTime'),
            t('performance.metrics.domComplete'),
            t('performance.metrics.domContentLoaded')
          ]
        },
        xAxis: { type: 'category', data: [] },
        yAxis: { type: 'value', name: t('performance.units.milliseconds') },
        series: [
          {
            name: t('performance.metrics.loadTime'),
            type: 'line',
            data: []
          },
          {
            name: t('performance.metrics.domComplete'),
            type: 'line',
            data: []
          },
          {
            name: t('performance.metrics.domContentLoaded'),
            type: 'line',
            data: []
          }
        ]
      };
      chart.setOption(option);
    }
  }
};

const initPaintTimesChart = () => {
  if (paintTimesChart.value) {
    const chartDom = getChartDom(paintTimesChart.value);
    if (chartDom) {
      const chart = echarts.init(chartDom);
      const option: EChartsOption = {
        title: { text: t('performance.charts.paintTiming') },
        tooltip: { trigger: 'axis' },
        legend: {
          data: [
            t('performance.metrics.firstPaint'),
            t('performance.metrics.firstContentfulPaint')
          ]
        },
        xAxis: { type: 'category', data: [] },
        yAxis: { type: 'value', name: t('performance.units.milliseconds') },
        series: [
          {
            name: t('performance.metrics.firstPaint'),
            type: 'line',
            data: []
          },
          {
            name: t('performance.metrics.firstContentfulPaint'),
            type: 'line',
            data: []
          }
        ]
      };
      chart.setOption(option);
    }
  }
};

const initFpsChart = () => {
  if (fpsChart.value) {
    const chartDom = getChartDom(fpsChart.value);
    if (chartDom) {
      const chart = echarts.init(chartDom);
      const option: EChartsOption = {
        title: { text: t('performance.charts.fps') },
        series: [{
          type: 'gauge',
          min: 0,
          max: 60,
          detail: { formatter: '{value}' },
          data: [{ value: 0 }]
        }]
      };
      chart.setOption(option);
    }
  }
};

const initMemoryChart = () => {
  if (memoryChart.value) {
    const chartDom = getChartDom(memoryChart.value);
    if (chartDom) {
      const chart = echarts.init(chartDom);
      const option: EChartsOption = {
        title: { text: t('performance.charts.memory') },
        tooltip: { trigger: 'axis' },
        xAxis: { type: 'category', data: [] },
        yAxis: { type: 'value', name: t('performance.units.megabytes') },
        series: [{
          type: 'line',
          data: []
        }]
      };
      chart.setOption(option);
    }
  }
};

// 修改资源大小图表初始化函数
const initResourceSizeChart = () => {
  if (resourceSizeChart.value) {
    const chartDom = getChartDom(resourceSizeChart.value);
    if (chartDom) {
      const chart = echarts.init(chartDom);
      const option: EChartsOption = {
        title: { text: t('performance.charts.resourceSize') },
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c}MB ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: RESOURCE_TYPES.map(type => t(`performance.resourceTypes.${type}`))
        },
        series: [{
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: true,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: true,
            formatter: '{b}: {c}MB'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 14,
              fontWeight: 'bold'
            }
          },
          data: RESOURCE_TYPES.map(type => ({
            name: t(`performance.resourceTypes.${type}`),
            value: 0
          }))
        }]
      };
      chart.setOption(option);
    }
  }
};

// 修改资源大小图表更新函数
const updateResourceSizeChart = (latest: PerformanceMetrics) => {
  if (resourceSizeChart.value) {
    const chartDom = getChartDom(resourceSizeChart.value);
    if (chartDom) {
      const chart = echarts.getInstanceByDom(chartDom);
      if (chart) {
        const resourceSizes = RESOURCE_TYPES.map(type => ({
          name: t(`performance.resourceTypes.${type}`),
          value: Number((latest.resources
            .filter(r => r.type === type)
            .reduce((sum, r) => sum + r.size, 0) / 1024 / 1024)
            .toFixed(2))
        }));

        chart.setOption({
          series: [{
            data: resourceSizes
          }]
        });
      }
    }
  }
};

// 添加网络速度图表初始化函数
const initNetworkSpeedChart = () => {
  if (networkSpeedChart.value) {
    const chartDom = getChartDom(networkSpeedChart.value);
    if (chartDom) {
      const chart = echarts.init(chartDom);
      const option: EChartsOption = {
        title: { text: t('performance.charts.networkSpeed') },
        tooltip: { trigger: 'axis' },
        xAxis: { type: 'category', data: [] },
        yAxis: { type: 'value', name: t('performance.units.bytesPerSecond') },
        series: [{
          type: 'line',
          data: []
        }]
      };
      chart.setOption(option);
    }
  }
};

// 添加请求时序图表初始化函数
const initRequestTimingChart = () => {
  if (requestTimingChart.value) {
    const chartDom = getChartDom(requestTimingChart.value);
    if (chartDom) {
      const chart = echarts.init(chartDom);
      const option: EChartsOption = {
        title: { text: t('performance.charts.requestTiming') },
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' }
        },
        legend: { show: false },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          name: t('performance.units.milliseconds')
        },
        yAxis: {
          type: 'category',
          data: []
        },
        series: [{
          type: 'bar',
          data: []
        }]
      };
      chart.setOption(option);
    }
  }
};

// 修改切换收集状态的处理函数
const handleCollectionChange = (val: string | number | boolean) => {
  const isActive = Boolean(val);
  if (isActive) {
    store.startCollecting();
  } else {
    store.stopCollecting();
  }
};
</script>

<style scoped lang="scss">
.performance-monitor {
  padding: 24px;
  
  .monitor-card {
    border-radius: 8px;
    box-shadow: var(--el-box-shadow-light);
    
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;

      .title {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 16px;
        font-weight: 500;

        .el-icon {
          font-size: 18px;
        }
      }

      .controls {
        display: flex;
        gap: 16px;
        align-items: center;
      }
    }
  }
  
  .metrics-container {
    .metrics-section {
      margin-bottom: 32px;
      
      .section-title {
        margin: 0 0 20px;
        font-size: 15px;
        font-weight: 500;
        color: var(--el-text-color-primary);
        display: flex;
        align-items: center;
        gap: 8px;

        .el-icon {
          font-size: 16px;
        }
      }

      .charts-row {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 24px;
        
        .chart-wrapper {
          background: var(--el-bg-color-page);
          border-radius: 4px;
          padding: 16px;
          box-shadow: var(--el-box-shadow-lighter);
          
          .chart {
            height: 320px;
            width: 100%;
          }
        }
      }
    }

    .metrics-table {
      margin-top: 32px;
      border-radius: 4px;
      box-shadow: var(--el-box-shadow-lighter);

      :deep(.el-table__header) {
        border-radius: 4px 4px 0 0;
        th {
          font-weight: 500;
          background: var(--el-fill-color-light);
          white-space: nowrap;
        }
      }

      :deep(.el-table__body) {
        td {
          padding: 8px 0;
        }
      }

      :deep(.el-table__row) {
        &:last-child td {
          border-bottom: none;
        }
      }
    }
  }

  .threshold-settings {
    padding: 24px;

    .threshold-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding: 12px;
      background: var(--el-bg-color-page);
      border-radius: 4px;

      &:hover {
        background: var(--el-fill-color-light);
      }
    }
  }
}
</style> 