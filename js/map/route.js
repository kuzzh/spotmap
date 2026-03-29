/**
 * 路线规划相关操作
 */

import { state } from '../state.js';
import { closeInfoWindow } from './infoWindow.js';
import { formatRouteTime, formatRouteDistance, isMobileDevice } from '../utils/helpers.js';

/**
 * 计算路线
 * @param {number} destLng - 目的地经度
 * @param {number} destLat - 目的地纬度
 * @param {string} destName - 目的地名称
 */
export function calculateRoute(destLng, destLat, destName) {
  console.log('calculateRoute called:', destLng, destLat, destName);

  if (!state.selectedDeparture || !state.selectedDeparture.location) {
    alert('请先选择正确的出发地');
    document.getElementById('departureSearch').focus();
    return;
  }

  state.startLngLat = state.selectedDeparture.location;
  state.endLngLat = [destLng, destLat];
  state.destName = destName;

  console.log('Searching route with locations:', state.startLngLat, state.endLngLat);

  state.driving.search(state.startLngLat, state.endLngLat, function (status, result) {
    handleRouteResult(status, result);
  });
}

/**
 * 处理路线规划结果
 * @param {string} status - 状态
 * @param {Object} result - 结果对象
 */
function handleRouteResult(status, result) {
  console.log('Search result:', status, result);

  if (status === 'complete') {
    console.log('绘制驾车路线完成');
    if (result.routes && result.routes.length > 0) {
      displayRouteInfo(result.routes[0]);

      // 在移动设备上显示导航按钮
      if (isMobileDevice()) {
        document.getElementById('navigateInAMap').style.display = 'inline-block';
      }
    } else {
      console.error('No routes found in the result');
      alert('未找到可行的路线');
    }
  } else {
    console.error('获取驾车数据失败：', result);
    alert('获取驾车数据失败：' + status);
  }
}

/**
 * 显示路线信息
 * @param {Object} route - 路线对象
 */
function displayRouteInfo(route) {
  document.getElementById('destPlace').value = state.destName;
  document.getElementById('routeDistance').value = formatRouteDistance(route.distance);
  document.getElementById('routeTime').value = formatRouteTime(route.time);

  closeInfoWindow();
}

/**
 * 清除路线
 */
export function clearRoute() {
  if (state.driving) {
    state.driving.clear();
  }
  document.getElementById('destPlace').value = '';
  document.getElementById('routeDistance').value = '';
  document.getElementById('routeTime').value = '';
}

/**
 * 打开高德导航
 */
export function openAmapNavigation() {
  if (!state.startLngLat || !state.endLngLat) return;

  const amapUrl = `amapuri://route/plan/?sid=BGVIS1&slat=${state.startLngLat[1]}&slon=${state.startLngLat[0]}&sname=${encodeURIComponent(state.selectedDeparture.name)}&did=BGVIS2&dlat=${state.endLngLat[1]}&dlon=${state.endLngLat[0]}&dname=${encodeURIComponent(state.destName)}&dev=0&t=0`;

  const webNavUrl = `https://uri.amap.com/navigation?from=${state.startLngLat[0]},${state.startLngLat[1]},${encodeURIComponent(state.selectedDeparture.name)}&to=${state.endLngLat[0]},${state.endLngLat[1]},${encodeURIComponent(state.destName)}&mode=car&policy=1&src=mypage&coordinate=gaode`;

  if (isMobileDevice()) {
    window.location.href = amapUrl;
  } else {
    window.open(webNavUrl, '_blank');
  }
}

// 暴露到全局供 HTML 调用
window.calculateRoute = calculateRoute;
window.clearRoute = clearRoute;
