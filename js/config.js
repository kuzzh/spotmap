/**
 * 应用配置常量
 * 优先从 config.local.js 读取配置，如不存在则使用默认值
 */

// 尝试加载本地配置
let localConfig = {};
try {
  const module = await import('./config.local.js');
  localConfig = module;
} catch (e) {
  // 本地配置不存在，使用默认空值
}

// 高德地图配置
// AMAP_KEY: 高德地图 API Key，用于调用地图服务
// 获取方式：登录高德开放平台 (https://console.amap.com/) -> 应用管理 -> 创建应用 -> 添加 Key
export const AMAP_KEY = localConfig.AMAP_KEY || '';

// AMAP_SECURITY_CONFIG: 高德地图安全密钥配置
// securityJsCode: 安全密钥，用于增强 API 访问安全性，防止 Key 被滥用
// 获取方式：登录高德开放平台 -> 应用管理 -> 对应应用的"安全密钥"选项
export const AMAP_SECURITY_CONFIG = localConfig.AMAP_SECURITY_CONFIG || {
  securityJsCode: '',
};

// 地图样式
export const MAP_LIGHT_STYLE = 'amap://styles/whitesmoke';
export const MAP_DARK_STYLE = 'amap://styles/dark';

// 地图默认配置
export const DEFAULT_CENTER = [104.195397, 35.86166];
export const DEFAULT_ZOOM = 5;

// 标记大小配置
export const MARKER_MIN_SIZE = 10;
export const MARKER_MAX_SIZE = 50;

// 默认筛选配置
export const DEFAULT_MIN_COMMENTS = '500';

// 默认省份
export const DEFAULT_PROVINCES = ['北京'];

// 默认主题 ('light' 或 'dark')
export const DEFAULT_THEME = 'light';

// 数据源
export const DATA_URL = 'data/spots.json';

// localStorage 键名
export const STORAGE_KEYS = {
  PROVINCES: 'provinces',
  VISITED_SPOTS: 'visitedSpots',
  SELECTED_PROVINCES: 'selectedProvinces',
  SELECTED_MIN_COMMENTS: 'selectedMinComments',
  ONLY_SHOW_UNVISITED: 'onlyShowUnvisited',
  THEME: 'theme',
  SELECTED_DEPARTURE: 'selectedDeparture'
};
