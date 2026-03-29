/**
 * 通用工具函数
 */

/**
 * 编码景点名称，移除英文字母和空格
 * @param {Object} spot - 景点对象
 * @returns {string} 编码后的名称
 */
export function encodeSpotName(spot) {
  return encodeURIComponent(spot.name.replace(/[a-zA-Z\s]/g, ''));
}

/**
 * 切换加载状态显示
 * @param {boolean} show - 是否显示加载状态
 */
export function toggleLoading(show) {
  const loadingElement = document.getElementById('loading');
  if (loadingElement) {
    loadingElement.style.display = show ? 'flex' : 'none';
  }
}

/**
 * 检测是否为移动设备
 * @returns {boolean}
 */
export function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * 格式化路线时间
 * @param {number} seconds - 秒数
 * @returns {string} 格式化后的时间字符串
 */
export function formatRouteTime(seconds) {
  const totalMinutes = Math.round(seconds / 60);
  if (totalMinutes >= 60) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours} 小时 ${minutes} 分钟`;
  }
  return `${totalMinutes} 分钟`;
}

/**
 * 格式化路线距离
 * @param {number} meters - 米数
 * @returns {string} 格式化后的距离字符串（公里）
 */
export function formatRouteDistance(meters) {
  return (meters / 1000).toFixed(2);
}
