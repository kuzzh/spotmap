/**
 * localStorage 封装
 */

import { STORAGE_KEYS } from '../config.js';

/**
 * 获取已访问景点列表
 * @returns {number[]} 已访问景点ID列表
 */
export function getVisitedSpots() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.VISITED_SPOTS)) || [];
}

/**
 * 保存已访问景点列表
 * @param {number[]} visitedSpots - 已访问景点ID列表
 */
export function setVisitedSpots(visitedSpots) {
  localStorage.setItem(STORAGE_KEYS.VISITED_SPOTS, JSON.stringify(visitedSpots));
}

/**
 * 添加已访问景点
 * @param {number} spotId - 景点ID
 */
export function addVisitedSpot(spotId) {
  const visitedSpots = getVisitedSpots();
  if (!visitedSpots.includes(spotId)) {
    visitedSpots.push(spotId);
    setVisitedSpots(visitedSpots);
  }
}

/**
 * 移除已访问景点
 * @param {number} spotId - 景点ID
 */
export function removeVisitedSpot(spotId) {
  const visitedSpots = getVisitedSpots();
  setVisitedSpots(visitedSpots.filter(id => id !== spotId));
}

/**
 * 获取保存的省份列表
 * @returns {string[]}
 */
export function getSavedProvinces() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.SELECTED_PROVINCES)) || [];
}

/**
 * 保存省份列表
 * @param {string[]} provinces - 省份列表
 */
export function setSavedProvinces(provinces) {
  localStorage.setItem(STORAGE_KEYS.SELECTED_PROVINCES, JSON.stringify(provinces));
}

/**
 * 获取保存的最小评论数
 * @returns {string}
 */
export function getSavedMinComments() {
  return localStorage.getItem(STORAGE_KEYS.SELECTED_MIN_COMMENTS) || '500';
}

/**
 * 保存最小评论数
 * @param {string} minComments - 最小评论数
 */
export function setSavedMinComments(minComments) {
  localStorage.setItem(STORAGE_KEYS.SELECTED_MIN_COMMENTS, minComments);
}

/**
 * 获取是否只显示未访问景点
 * @returns {boolean}
 */
export function getOnlyShowUnvisited() {
  return localStorage.getItem(STORAGE_KEYS.ONLY_SHOW_UNVISITED) === '1';
}

/**
 * 设置只显示未访问景点
 * @param {boolean} value - 是否只显示未访问
 */
export function setOnlyShowUnvisited(value) {
  localStorage.setItem(STORAGE_KEYS.ONLY_SHOW_UNVISITED, value ? '1' : '0');
}

/**
 * 获取主题设置
 * @returns {string|null}
 */
export function getTheme() {
  return localStorage.getItem(STORAGE_KEYS.THEME);
}

/**
 * 保存主题设置
 * @param {string} theme - 主题名称
 */
export function setTheme(theme) {
  localStorage.setItem(STORAGE_KEYS.THEME, theme);
}

/**
 * 获取出发地
 * @returns {Object|null}
 */
export function getSelectedDeparture() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.SELECTED_DEPARTURE));
}

/**
 * 保存出发地
 * @param {Object} departure - 出发地信息
 */
export function setSelectedDeparture(departure) {
  localStorage.setItem(STORAGE_KEYS.SELECTED_DEPARTURE, JSON.stringify(departure));
}

/**
 * 清除出发地
 */
export function clearSelectedDeparture() {
  localStorage.removeItem(STORAGE_KEYS.SELECTED_DEPARTURE);
}

/**
 * 获取缓存的省份列表
 * @returns {string[]|null}
 */
export function getCachedProvinces() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.PROVINCES));
}

/**
 * 缓存省份列表
 * @param {string[]} provinces - 省份列表
 */
export function setCachedProvinces(provinces) {
  localStorage.setItem(STORAGE_KEYS.PROVINCES, JSON.stringify(provinces));
}
