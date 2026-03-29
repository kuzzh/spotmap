/**
 * 应用入口文件
 * 负责初始化和协调各个模块
 */

import { state } from './state.js';
import { initMap, initMapPlugins } from './map/init.js';
import { fetchProvinces } from './data/spots.js';
import { getSelectedDeparture } from './data/storage.js';
// 导入 route.js 以触发全局函数暴露 (calculateRoute, clearRoute)
import './map/route.js';
// 导入 infoWindow.js 以触发全局函数暴露 (handleToggleVisited)
import './map/infoWindow.js';
import { openAmapNavigation } from './map/route.js';
import {
  setupEventListeners,
  initializeFilters,
  initDepartureClearButton
} from './ui/events.js';
import { setupThemeToggle, setupOnlyShowUnvisitedToggle } from './ui/theme.js';

/**
 * 初始化出发地
 */
function initSelectedDeparture() {
  state.selectedDeparture = getSelectedDeparture();
  if (state.selectedDeparture) {
    const departureSearch = document.getElementById('departureSearch');
    if (departureSearch) {
      departureSearch.value = state.selectedDeparture.name;
    }
  }
}

/**
 * 初始化高德导航按钮
 */
function initNavigationButton() {
  const navigateBtn = document.getElementById('navigateInAMap');
  if (navigateBtn) {
    navigateBtn.addEventListener('click', openAmapNavigation);
  }
}

/**
 * 初始化应用
 */
async function initializeApp() {
  initMap();

  // 确保地图初始化完成后再初始化 AutoComplete
  state.map.on('complete', function () {
    initMapPlugins();
  });

  await fetchProvinces();
  initializeFilters();
  initSelectedDeparture();
  initDepartureClearButton();
  initNavigationButton();
  setupEventListeners();
  setupThemeToggle();
  setupOnlyShowUnvisitedToggle();
}

// 页面加载完成后初始化
window.onload = async () => {
  if (typeof AMap !== 'undefined') {
    await initializeApp();
  } else {
    // 如果 AMap 还没有加载完成，等待它加载
    window.addEventListener('AMapLoaded', initializeApp);
  }
};
