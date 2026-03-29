/**
 * UI 事件处理
 */

import { state } from "../state.js";
import { fetchSpots, toggleSpotVisited } from "../data/spots.js";
import { toggleLoading } from "../utils/helpers.js";
import { displaySpots } from "./display.js";
import { addMarkersToMap } from "../map/markers.js";
import { showInfoWindow } from "../map/infoWindow.js";
import {
  getSavedProvinces,
  setSavedProvinces,
  getSavedMinComments,
  setSavedMinComments,
} from "../data/storage.js";
import { DEFAULT_PROVINCES } from "../config.js";

/**
 * 设置事件监听器
 */
export function setupEventListeners() {
  const commentSelect = document.getElementById("comment-select");
  const toggleSidebar = document.getElementById("toggle-sidebar");

  if (commentSelect) {
    commentSelect.addEventListener("change", updateSpots);
  }

  if (toggleSidebar) {
    toggleSidebar.addEventListener("click", toggleSidebarVisibility);
  }

  // 阻止筛选器点击事件冒泡
  const filters = document.querySelector(".filters");
  if (filters) {
    filters.addEventListener("click", (e) => e.stopPropagation());
  }
}

/**
 * 切换侧边栏显示
 */
function toggleSidebarVisibility() {
  document.querySelector(".sidebar-left")?.classList.toggle("show");
  document.querySelector(".filters")?.classList.toggle("show");
}

/**
 * 初始化筛选器
 */
export function initializeFilters() {
  const provinceSelect = document.getElementById("province-select");
  const commentSelect = document.getElementById("comment-select");

  if (!provinceSelect || !commentSelect) return;

  const savedProvinces = getSavedProvinces();
  const savedMinComments = getSavedMinComments();

  commentSelect.value = savedMinComments;

  // 恢复已保存的省份选择
  if (savedProvinces.length > 0) {
    Array.from(provinceSelect.options).forEach((option) => {
      if (savedProvinces.includes(option.value)) {
        option.selected = true;
      }
    });
    loadSpots(savedProvinces, savedMinComments);
  } else {
    Array.from(provinceSelect.options).forEach(option => {
      if (DEFAULT_PROVINCES.includes(option.value)) {
        option.selected = true;
      }
    });
    setSavedProvinces(DEFAULT_PROVINCES);
    loadSpots(DEFAULT_PROVINCES, savedMinComments);
  }

  // 初始化多选下拉框
  initMultiSelect(provinceSelect);
}

/**
 * 初始化多选下拉框
 * @param {HTMLSelectElement} provinceSelect - 省份选择元素
 */
function initMultiSelect(provinceSelect) {
  if (typeof MultiSelectDropdown !== "undefined") {
    new MultiSelectDropdown("province-select", {
      placeholder: "请选择区域",
      onChange: function (selectedValues) {
        if (selectedValues.length > 0) {
          updateSpots();
        }
      },
    });
  }
}

/**
 * 更新景点列表
 */
export function updateSpots() {
  const provinceSelect = document.getElementById("province-select");
  const minComments = document.getElementById("comment-select")?.value;

  if (!provinceSelect) return;

  const selectedProvinces = Array.from(provinceSelect.selectedOptions)
    .map((option) => option.value)
    .filter((value) => value !== "");

  if (selectedProvinces.length > 0) {
    setSavedProvinces(selectedProvinces);
    setSavedMinComments(minComments);
    loadSpots(selectedProvinces, minComments);
  }
}

/**
 * 加载景点数据
 * @param {string[]} provinces - 省份列表
 * @param {number} minComments - 最小评论数
 */
async function loadSpots(provinces, minComments) {
  toggleLoading(true);
  try {
    const { getOnlyShowUnvisited } = await import("../data/storage.js");
    const showAll = !getOnlyShowUnvisited();

    state.spotData = await fetchSpots(
      provinces,
      parseInt(minComments),
      showAll,
    );
    displaySpots();
    addMarkersToMap(true);
  } catch (error) {
    console.error("Error loading spots:", error);
  } finally {
    toggleLoading(false);
  }
}

/**
 * 切换景点访问状态
 * @param {number} index - 景点索引
 */
export async function toggleVisited(index) {
  const badge = event?.target;
  if (badge) {
    badge.style.transform = "scale(0.9)";
    setTimeout(() => {
      badge.style.transform = "scale(1)";
    }, 100);
  }

  const visited = !state.spotData[index].visited;

  try {
    toggleSpotVisited(index, visited);

    displaySpots();
    addMarkersToMap(false);

    // 更新信息窗口
    if (state.currentInfoWindow?.getIsOpen()) {
      const marker = state.markers[index];
      showInfoWindow(state.spotData[index], marker);
    }
  } catch (error) {
    console.error("Error updating spot visited status:", error);
  }
}

/**
 * 初始化出发地清除按钮
 */
export function initDepartureClearButton() {
  const departureSearch = document.getElementById("departureSearch");
  const clearDeparture = document.getElementById("clearDeparture");

  if (!departureSearch || !clearDeparture) return;

  clearDeparture.addEventListener("click", () => {
    import("../data/storage.js").then(({ clearSelectedDeparture }) => {
      clearSelectedDeparture();
      state.selectedDeparture = null;
      departureSearch.value = "";
      departureSearch.focus();
    });
  });
}
