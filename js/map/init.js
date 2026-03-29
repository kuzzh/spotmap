/**
 * 地图初始化
 */

import { MAP_LIGHT_STYLE, MAP_DARK_STYLE, DEFAULT_CENTER, DEFAULT_ZOOM, DEFAULT_THEME } from '../config.js';
import { state } from '../state.js';
import { getTheme } from '../data/storage.js';

/**
 * 获取地图样式
 * @param {string} theme - 主题名称
 * @returns {string} 地图样式
 */
function getMapStyle(theme) {
  return theme === 'light' ? MAP_LIGHT_STYLE : MAP_DARK_STYLE;
}

/**
 * 初始化地图
 */
export function initMap() {
  const savedTheme = getTheme();
  const theme = savedTheme || DEFAULT_THEME;
  const mapStyle = getMapStyle(theme);

  state.map = new AMap.Map('map-container', {
    zoom: DEFAULT_ZOOM,
    center: DEFAULT_CENTER,
    mapStyle: mapStyle,
  });

  state.map.on('click', function () {
    if (state.currentInfoWindow) {
      state.currentInfoWindow.close();
      state.currentInfoWindow = null;
    }
  });
}

/**
 * 初始化地图插件
 */
export function initMapPlugins() {
  console.log('Initializing AutoComplete...');

  if (typeof AMap === 'undefined') {
    console.error('AMap is not defined. Make sure the AMap script is loaded correctly.');
    return;
  }

  AMap.plugin(['AMap.AutoComplete', 'AMap.Driving', 'AMap.GeoCoder'], function () {
    try {
      state.autoComplete = new AMap.AutoComplete({
        input: 'departureSearch',
      });

      state.driving = new AMap.Driving({
        map: state.map,
        panel: null,
        autoFitView: false,
        policy: 0,
      });

      state.autoComplete.on('select', handleAutoCompleteSelect);
    } catch (error) {
      console.error('Error initializing AutoComplete:', error);
    }
  });
}

/**
 * 处理自动完成选择事件
 * @param {Object} e - 事件对象
 */
function handleAutoCompleteSelect(e) {
  console.log('AutoComplete select event triggered:', e);

  state.selectedDeparture = {
    name: e.poi.name,
    adcode: e.poi.adcode,
    city: e.poi.city,
    district: e.poi.district,
    location: e.poi.location ? [e.poi.location.lng, e.poi.location.lat] : null,
  };

  if (!state.selectedDeparture.location) {
    geocodeDeparture();
  } else {
    saveDeparture();
  }
}

/**
 * 地理编码出发地
 */
function geocodeDeparture() {
  const geocoder = new AMap.Geocoder({
    city: state.selectedDeparture.adcode,
  });

  geocoder.getLocation(state.selectedDeparture.name, function (status, result) {
    if (status === 'complete' && result.info === 'OK' && result.geocodes.length > 0) {
      state.selectedDeparture.location = [
        result.geocodes[0].location.lng,
        result.geocodes[0].location.lat
      ];
      saveDeparture();
    }
  });
}

/**
 * 保存出发地到 localStorage
 */
function saveDeparture() {
  import('../data/storage.js').then(({ setSelectedDeparture }) => {
    setSelectedDeparture(state.selectedDeparture);
  });
}

/**
 * 设置地图主题
 * @param {string} theme - 主题名称 ('light' 或 'dark')
 */
export function setMapTheme(theme) {
  if (state.map) {
    state.map.setMapStyle(getMapStyle(theme));
  }
}
