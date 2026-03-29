/**
 * 全局状态管理
 */

export const state = {
  // 地图相关
  map: null,
  currentInfoWindow: null,
  markers: [],

  // 数据相关
  spotData: [],

  // 地图插件
  autoComplete: null,
  driving: null,
  routeOverlay: null,

  // 路线规划
  selectedDeparture: null,
  startLngLat: null,
  endLngLat: null,
  destName: null
};

/**
 * 更新状态
 * @param {string} key - 状态键名
 * @param {*} value - 状态值
 */
export function setState(key, value) {
  state[key] = value;
}

/**
 * 获取状态
 * @param {string} key - 状态键名
 * @returns {*} 状态值
 */
export function getState(key) {
  return state[key];
}
