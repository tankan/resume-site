// 等待元素加载
export const waitForElement = (selector: string, timeout = 4000) => {
  return new Promise((resolve, reject) => {
    const startTime = Date.now()
    const interval = setInterval(() => {
      const element = Cypress.$(selector)
      if (element.length > 0) {
        clearInterval(interval)
        resolve(element)
      } else if (Date.now() - startTime > timeout) {
        clearInterval(interval)
        reject(new Error(`Element ${selector} not found after ${timeout}ms`))
      }
    }, 100)
  })
}

// 检查性能指标
export const checkPerformanceMetrics = () => {
  return cy.window().then((win) => {
    const metrics = {
      fcp: 0,
      lcp: 0,
      cls: 0
    }

    // 获取 FCP
    const paint = win.performance.getEntriesByType('paint')
    const fcp = paint.find(entry => entry.name === 'first-contentful-paint')
    if (fcp) {
      metrics.fcp = fcp.startTime
    }

    // 获取 LCP
    const lcp = win.performance.getEntriesByType('largest-contentful-paint').pop()
    if (lcp) {
      metrics.lcp = lcp.startTime
    }

    // 获取 CLS
    let clsValue = 0
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value
        }
      }
      metrics.cls = clsValue
    }).observe({ entryTypes: ['layout-shift'] })

    return metrics
  })
}

// 检查颜色对比度
export const getContrastRatio = (color1: string, color2: string) => {
  const getLuminance = (r: number, g: number, b: number) => {
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    })
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
  }

  const getRGB = (color: string) => {
    const hex = color.replace('#', '')
    return {
      r: parseInt(hex.slice(0, 2), 16),
      g: parseInt(hex.slice(2, 4), 16),
      b: parseInt(hex.slice(4, 6), 16)
    }
  }

  const rgb1 = getRGB(color1)
  const rgb2 = getRGB(color2)
  const l1 = getLuminance(rgb1.r, rgb1.g, rgb1.b)
  const l2 = getLuminance(rgb2.r, rgb2.g, rgb2.b)

  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)

  return (lighter + 0.05) / (darker + 0.05)
} 