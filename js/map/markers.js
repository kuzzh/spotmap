/**
 * 地图标记相关操作
 */

import { state } from '../state.js';
import { MARKER_MIN_SIZE, MARKER_MAX_SIZE } from '../config.js';
import { showInfoWindow } from './infoWindow.js';
import { highlightSpotInList } from '../ui/display.js';

/**
 * 添加标记到地图
 * @param {boolean} fitView - 是否调整视图以适应所有标记
 */
export function addMarkersToMap(fitView = true) {
  // 清除现有标记
  state.markers.forEach(marker => marker.setMap(null));
  state.markers = [];

  if (state.spotData.length === 0) return;

  const { minComments, maxComments } = getCommentRange();

  state.spotData.forEach((spot, index) => {
    const marker = createMarker(spot, index, minComments, maxComments);
    marker.setMap(state.map);
    state.markers.push(marker);
  });

  if (fitView && state.markers.length > 0) {
    state.map.setFitView();
  }
}

/**
 * 获取评论数范围
 * @returns {Object} 最小和最大评论数
 */
function getCommentRange() {
  const comments = state.spotData.map(spot => spot.comment);
  return {
    minComments: Math.min(...comments),
    maxComments: Math.max(...comments)
  };
}

/**
 * 创建单个标记
 * @param {Object} spot - 景点数据
 * @param {number} index - 景点索引
 * @param {number} minComments - 最小评论数
 * @param {number} maxComments - 最大评论数
 * @returns {AMap.Marker} 标记对象
 */
function createMarker(spot, index, minComments, maxComments) {
  const size = calculateMarkerSize(spot.comment, minComments, maxComments);
  const colors = getMarkerColors(spot.visited);

  const marker = new AMap.Marker({
    position: [spot.lng, spot.lat],
    content: createMarkerContent(size, colors.normal),
    offset: new AMap.Pixel(-size / 2, -size / 2),
    title: spot.name,
  });

  // 绑定事件
  marker.on('mouseover', e => handleMarkerMouseOver(e, colors.hover));
  marker.on('mouseout', e => handleMarkerMouseOut(e, colors.normal));
  marker.on('click', () => handleMarkerClick(index));

  return marker;
}

/**
 * 计算标记大小
 * @param {number} comment - 评论数
 * @param {number} min - 最小评论数
 * @param {number} max - 最大评论数
 * @returns {number} 标记大小
 */
function calculateMarkerSize(comment, min, max) {
  if (max === min) return MARKER_MIN_SIZE;
  return MARKER_MIN_SIZE + ((comment - min) / (max - min)) * (MARKER_MAX_SIZE - MARKER_MIN_SIZE);
}

/**
 * 获取标记颜色
 * @param {boolean} visited - 是否已访问
 * @returns {Object} 正常和悬停颜色
 */
function getMarkerColors(visited) {
  return {
    normal: visited ? 'var(--marker-visited-bg)' : 'var(--marker-bg)',
    hover: visited ? 'var(--marker-visited-hover-bg)' : 'var(--marker-hover-bg)'
  };
}

/**
 * 创建标记 HTML 内容
 * @param {number} size - 标记大小
 * @param {string} color - 标记颜色
 * @returns {string} HTML 字符串
 */
function createMarkerContent(size, color) {
  return `<div class="marker" style="width:${size}px;height:${size}px;border-radius:50%;background-color:${color};transition:all 0.3s;"></div>`;
}

/**
 * 处理标记鼠标悬停事件
 * @param {Object} e - 事件对象
 * @param {string} hoverColor - 悬停颜色
 */
function handleMarkerMouseOver(e, hoverColor) {
  const el = e.target.getContentDom().querySelector('.marker');
  el.style.backgroundColor = hoverColor;
  el.style.boxShadow = '0 0 10px var(--marker-shadow)';
}

/**
 * 处理标记鼠标移出事件
 * @param {Object} e - 事件对象
 * @param {string} normalColor - 正常颜色
 */
function handleMarkerMouseOut(e, normalColor) {
  const el = e.target.getContentDom().querySelector('.marker');
  el.style.backgroundColor = normalColor;
  el.style.boxShadow = 'none';
}

/**
 * 处理标记点击事件
 * @param {number} index - 景点索引
 */
function handleMarkerClick(index) {
  const marker = state.markers[index];
  const spot = state.spotData[index];

  state.map.setCenter(marker.getPosition());
  state.map.setZoom(12);
  showInfoWindow(spot, marker);
  highlightSpotInList(index);
}

/**
 * 高亮标记
 * @param {number} index - 标记索引
 */
export function highlightMarker(index) {
  const marker = state.markers[index];
  if (marker) {
    state.map.setCenter(marker.getPosition());
    state.map.setZoom(12);
    showInfoWindow(state.spotData[index], marker);
  }
}
