/**
 * UI 显示相关操作
 */

import { state } from '../state.js';
import { highlightMarker } from '../map/markers.js';
import { toggleVisited } from './events.js';

/**
 * 显示景点列表
 */
export function displaySpots() {
  const spotList = document.getElementById('spot-list');
  if (!spotList) return;

  spotList.innerHTML = '';

  let visitedCount = 0;
  let spotSn = 1;

  state.spotData.forEach((spot, index) => {
    const spotElement = createSpotElement(spot, index, spotSn++);
    spotList.appendChild(spotElement);

    if (spot.visited) {
      visitedCount += 1;
    }
  });

  updateSpotCount(visitedCount);
}

/**
 * 创建景点元素
 * @param {Object} spot - 景点数据
 * @param {number} index - 景点索引
 * @param {number} serialNumber - 序号
 * @returns {HTMLElement} 景点元素
 */
function createSpotElement(spot, index, serialNumber) {
  const spotElement = document.createElement('div');
  spotElement.className = 'spot-item';
  spotElement.innerHTML = `
    <h3>${spot.name}</h3>
    <p>${spot.intro || '暂无简介'}</p>
    <p>排名: ${spot.rank || '暂无'} | 星级: ${spot.star || '暂无'} | 评论数: ${spot.comment}</p>
    <div class="spot-item-footer">
      <span class="badge ${spot.visited ? 'badge-success' : 'badge-secondary'}" onclick="window.handleToggleVisited(${index}); event.stopPropagation();">
        ${spot.visited ? '已去过' : '未去过'}
      </span>
      <span class="spot-index">${serialNumber}</span>
    </div>
  `;

  spotElement.addEventListener('click', () => {
    highlightMarker(index);
    highlightSpotInList(index);
  });

  return spotElement;
}

/**
 * 更新景点计数显示
 * @param {number} visitedCount - 已访问数量
 */
function updateSpotCount(visitedCount) {
  const spotCountElement = document.getElementById('spotCount');
  if (spotCountElement) {
    spotCountElement.textContent = `景点数: ${state.spotData.length} 已去过：${visitedCount}`;
  }
}

/**
 * 高亮列表中的景点
 * @param {number} index - 景点索引
 */
export function highlightSpotInList(index) {
  const spotItems = document.querySelectorAll('.spot-item');
  spotItems.forEach((item, i) => {
    if (i === index) {
      item.classList.add('active');
      item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else {
      item.classList.remove('active');
    }
  });
}

// 暴露到全局供 HTML 调用
window.handleToggleVisited = toggleVisited;
