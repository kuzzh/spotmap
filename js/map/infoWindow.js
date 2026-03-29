/**
 * 信息窗口相关操作
 */

import { state } from '../state.js';
import { encodeSpotName } from '../utils/helpers.js';
import { toggleVisited } from '../ui/events.js';

/**
 * 显示信息窗口
 * @param {Object} spot - 景点数据
 * @param {AMap.Marker} marker - 标记对象
 */
export function showInfoWindow(spot, marker) {
  const content = createInfoWindowContent(spot);

  // 关闭当前打开的信息窗口
  if (state.currentInfoWindow) {
    state.currentInfoWindow.close();
  }

  const markerSize = getMarkerSize(marker);
  const offset = new AMap.Pixel(0, -markerSize / 2 - 3);

  const infoWindow = new AMap.InfoWindow({
    content: content,
    offset: offset,
    isCustom: false,
    autoMove: false,
    closeWhenClickMap: true,
  });

  infoWindow.open(state.map, marker.getPosition());
  state.currentInfoWindow = infoWindow;
}

/**
 * 创建信息窗口内容
 * @param {Object} spot - 景点数据
 * @returns {string} HTML 内容
 */
function createInfoWindowContent(spot) {
  const spotIndex = state.spotData.indexOf(spot);

  return `
    <div class="info-window">
      <h3>${spot.name}</h3>
      <p>${spot.intro || '暂无简介'}</p>
      <p>排名: ${spot.rank || '暂无'} | 星级: ${spot.star || '暂无'} | 评论数: ${spot.comment}</p>
      <div class="info-window-icon">
        <a href="https://you.ctrip.com/globalsearch/?keyword=${encodeSpotName(spot)}" target="_blank" title="在携程中搜索">
          <img src="images/xiecheng-icon.svg" alt="携程" style="vertical-align: middle;">
        </a>
        <a href="https://travel.qunar.com/search/all/${encodeSpotName(spot)}" target="_blank" title="在去哪儿中搜索">
          <img src="images/qunaer-icon.svg" alt="去哪儿" style="vertical-align: middle;">
        </a>
        <a href="https://www.xiaohongshu.com/search_result?keyword=${encodeSpotName(spot)}&source=web_explore_feed" target="_blank" title="在小红书中搜索">
          <img src="images/xiaohongshu-icon.svg" alt="小红书" style="vertical-align: middle;">
        </a>
        <div class="info-window-bottom-right">
          <button class="route-button" onclick="window.calculateRoute(${spot.lng}, ${spot.lat}, '${spot.name}')">到这里</button>
          <span class="badge ${spot.visited ? 'badge-success' : 'badge-secondary'}" onclick="window.handleToggleVisited(${spotIndex}); event.stopPropagation();">
            ${spot.visited ? '已去过' : '未去过'}
          </span>
        </div>
      </div>
    </div>
  `;
}

/**
 * 获取标记大小
 * @param {AMap.Marker} marker - 标记对象
 * @returns {number} 标记大小
 */
function getMarkerSize(marker) {
  const markerElement = marker.getContentDom().querySelector('.marker');
  return markerElement ? markerElement.offsetWidth : 20;
}

/**
 * 关闭信息窗口
 */
export function closeInfoWindow() {
  if (state.currentInfoWindow) {
    state.currentInfoWindow.close();
    state.currentInfoWindow = null;
  }
}

// 将 toggleVisited 暴露到全局，供 HTML  onclick 使用
window.handleToggleVisited = toggleVisited;
