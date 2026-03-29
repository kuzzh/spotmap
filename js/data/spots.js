/**
 * 景点数据相关操作
 */

import { DATA_URL } from '../config.js';
import { state } from '../state.js';
import {
  getVisitedSpots,
  addVisitedSpot,
  removeVisitedSpot,
  getCachedProvinces,
  setCachedProvinces
} from './storage.js';

/**
 * 获取省份列表
 * @returns {Promise<string[]>} 省份列表
 */
export async function fetchProvinces() {
  let provinces = getCachedProvinces();

  if (!provinces) {
    const response = await fetch(DATA_URL);
    const spots = await response.json();
    provinces = [...new Set(spots.map(spot => spot.province))].sort();
    setCachedProvinces(provinces);
  }

  // 渲染省份列表到 select 元素
  renderProvinceOptions(provinces);

  return provinces;
}

/**
 * 渲染省份选项到 select 元素
 * @param {string[]} provinces - 省份列表
 */
function renderProvinceOptions(provinces) {
  const provinceSelect = document.getElementById('province-select');
  if (!provinceSelect) return;

  // 清空现有选项（保留第一个空选项）
  const emptyOption = provinceSelect.querySelector('option[value=""]');
  provinceSelect.innerHTML = '';
  if (emptyOption) {
    provinceSelect.appendChild(emptyOption);
  }

  // 添加省份选项
  provinces.forEach(province => {
    const option = document.createElement('option');
    option.value = province;
    option.textContent = province;
    provinceSelect.appendChild(option);
  });
}

/**
 * 获取景点列表
 * @param {string[]} provinces - 省份列表
 * @param {number} minComments - 最小评论数
 * @param {boolean} showAll - 是否显示所有景点
 * @returns {Promise<Object[]>} 景点列表
 */
export async function fetchSpots(provinces, minComments, showAll) {
  const response = await fetch(DATA_URL);
  const allSpots = await response.json();
  const visitedSpots = getVisitedSpots();

  // 将访问状态应用到景点数据
  const spotsWithVisitedStatus = allSpots.map(spot => ({
    ...spot,
    visited: visitedSpots.includes(spot.id)
  }));

  // 筛选和排序
  return spotsWithVisitedStatus
    .filter(spot => provinces.includes(spot.province))
    .filter(spot => spot.comment >= minComments)
    .filter(spot => showAll || (!showAll && !spot.visited))
    .sort((a, b) => b.comment - a.comment);
}

/**
 * 切换景点访问状态
 * @param {number} index - 景点在 spotData 中的索引
 * @param {boolean} visited - 是否已访问
 */
export function toggleSpotVisited(index, visited) {
  const spot = state.spotData[index];
  const spotId = spot.id;

  if (visited) {
    addVisitedSpot(spotId);
  } else {
    removeVisitedSpot(spotId);
  }

  // 更新内存中的数据
  state.spotData[index].visited = visited;
}

/**
 * 根据ID查找景点索引
 * @param {number} id - 景点ID
 * @returns {number} 景点索引
 */
export function findSpotIndexById(id) {
  return state.spotData.findIndex(spot => spot.id === id);
}

/**
 * 获取景点统计信息
 * @returns {Object} 统计信息
 */
export function getSpotStats() {
  const total = state.spotData.length;
  const visited = state.spotData.filter(spot => spot.visited).length;
  return { total, visited };
}
