export default {
  header: {
    title: "前端工程师简历",
    theme: {
      light: "浅色模式",
      dark: "深色模式",
    },
    language: {
      zh: "中文",
      en: "EN",
    },
    performance: "性能监控",
  },
  theme: {
    title: "主题设置",
    mode: "主题模式",
    primaryColor: "主题色",
    textColor: "文本颜色",
    backgroundColor: "背景颜色",
    reset: "重置",
  },
  home: {
    name: "张三",
    title: "高级前端工程师",
    description:
      "10年前端开发经验，专注于现代化前端架构设计与性能优化，擅长Vue.js生态系统开发。",
    contact: "联系我",
    viewProjects: "查看项目",
    info: {
      title: "个人信息",
      experience: "工作年限",
      status: "当前状态",
      location: "所在城市",
    },
  },
  footer: {
    copyright: "© {year} 前端工程师简历. All Rights Reserved.",
  },
  error: {
    title: "发生错误",
    message: "抱歉，页面出现了一些问题",
    retry: "重试",
    back: "返回首页",
    details: "错误详情",
  },
  common: {
    metrics: '指标',
    value: '值',
    unit: '单位',
    status: '状态',
    category: '类别',
    count: '数量',
    table: {
      empty: '暂无数据',
      loading: '加载中...'
    }
  },
  performance: {
    title: '性能监控',
    monitoring: '监控中',
    stopped: '已停止',
    alert: '性能警告',
    alerts: {
      title: '性能警告详情',
      empty: '暂无警告',
      time: '时间',
      metric: '指标',
      value: '值',
      threshold: '阈值',
      clear: '清除所有',
      count: '警告数量'
    },
    settings: {
      title: '监控设置',
      thresholds: '性能阈值',
      interval: '采样间隔',
      dataRetention: '数据保留',
      save: '保存设置',
      reset: '重置默认',
      apply: '应用更改'
    },
    metrics: {
      domComplete: 'DOM完成时间',
      domContentLoaded: 'DOM内容加载时间',
      loadTime: '页面完全加载时间',
      firstPaint: '首次绘制时间',
      firstContentfulPaint: '首次内容绘制时间',
      memoryUsage: 'JS堆内存使用',
      ttfb: '首字节时间',
      fps: '帧率',
      resourceLoadTime: '资源加载时间',
      networkLatency: '网络延迟',
      bandwidthUsage: '带宽使用',
      resourceCount: '资源总数',
      totalResourceSize: '资源总大小',
      avgResourceLoad: '平均加载时间',
      requestCount: '请求数量',
      networkSpeed: '网络速度',
      dnsLookup: 'DNS查询时间',
      tcpConnection: 'TCP连接时间',
      request: '请求时间',
      response: '响应时间',
      requestTiming: '请求时序',
      domInteractive: 'DOM可交互时间',
      scriptLoad: '脚本加载时间',
      styleLoad: '样式加载时间',
      imageLoad: '图片加载时间',
      apiResponse: 'API响应时间',
      dns: 'DNS查询',
      tcp: 'TCP连接',
      processing: 'DOM处理',
    },
    units: {
      milliseconds: '毫秒',
      megabytes: 'MB',
      percentage: '%',
      fps: '帧/秒',
      bytesPerSecond: 'B/s'
    },
    charts: {
      loadTime: '页面加载时间趋势',
      timeAxis: '时间(毫秒)',
      sample: '采样',
      fps: '实时帧率',
      memory: '内存使用趋势',
      resource: '资源加载性能',
      networkSpeed: '网络速度',
      loadTimeDistribution: '加载时间分布',
      resourceSize: '资源大小',
      resourceTiming: '资源时序',
      pageLoadTrend: '页面加载趋势',
      paintTiming: '页面绘制时间',
      resourceLoad: '资源加载分布',
      requestTiming: '请求时序分析',
      axis: {
        time: '时间',
        value: '值',
        count: '数量',
        size: '大小'
      },
      legend: {
        loadTime: '加载时间',
        fcp: '首次内容绘制',
        ttfb: '首字节时间',
        fps: '帧率',
        memory: '内存使用',
        resources: '资源加载'
      },
      tooltip: {
        time: '时间',
        value: '值',
        type: '类型',
        size: '大小',
        duration: '持续时间',
        percentage: '百分比'
      },
      detail: {
        min: '最小值',
        max: '最大值',
        avg: '平均值',
        current: '当前值'
      },
      resourceCount: '资源数量',
      resourceDistribution: '资源分布',
      resourceTrend: '资源趋势',
      resourceBreakdown: '资源明细'
    },
    status: {
      success: '正常',
      warning: '警告',
      danger: '异常',
      info: '未知'
    },
    resourceTypes: {
      script: '脚本',
      stylesheet: '样式表',
      image: '图片',
      font: '字体',
      other: '其他',
      media: '媒体',
      document: '文档',
      video: '视频',
      link: '链接',
      audio: '音频'
    },
    sections: {
      pageLoad: '页面加载性能',
      resources: '资源加载性能',
      interaction: '用户交互性能',
      network: '网络请求性能'
    },
    analysis: {
      title: '性能分析',
      summary: '性能概览',
      details: '详细分析',
      recommendations: '优化建议',
      metrics: {
        good: '良好',
        moderate: '一般',
        poor: '较差'
      }
    }
  },
};
