/**
 * 主题切换相关
 */

import { state } from '../state.js';
import { setMapTheme } from '../map/init.js';
import { addMarkersToMap } from '../map/markers.js';
import { closeInfoWindow } from '../map/infoWindow.js';
import { getTheme, setTheme, getOnlyShowUnvisited, setOnlyShowUnvisited } from '../data/storage.js';
import { updateSpots } from './events.js';
import { DEFAULT_THEME } from '../config.js';

/**
 * 应用主题
 * @param {string} theme - 主题名称 ('light' 或 'dark')
 */
function applyTheme(theme) {
  const body = document.body;
  const isLight = theme === 'light';

  if (isLight) {
    body.classList.add('light-theme');
  } else {
    body.classList.remove('light-theme');
  }

  setMapTheme(theme);
}

/**
 * 设置主题切换按钮
 */
export function setupThemeToggle() {
  const themeToggle = document.querySelector('.theme-toggle');

  if (!themeToggle) return;

  // 恢复保存的主题，如果没有则使用默认主题
  const savedTheme = getTheme();
  const theme = savedTheme || DEFAULT_THEME;

  applyTheme(theme);

  themeToggle.addEventListener('click', () => {
    const body = document.body;
    body.classList.toggle('light-theme');
    const isLight = body.classList.contains('light-theme');
    const newTheme = isLight ? 'light' : 'dark';

    setMapTheme(newTheme);
    setTheme(newTheme);

    // 更新标记
    addMarkersToMap(true);

    // 关闭信息窗口
    closeInfoWindow();
  });
}

/**
 * 设置只显示未访问景点切换
 */
export function setupOnlyShowUnvisitedToggle() {
  const unvisitedToggle = document.querySelector('.unvisited-toggle');
  const body = document.body;

  if (!unvisitedToggle) return;

  // 恢复保存的设置
  if (getOnlyShowUnvisited()) {
    body.classList.add('only-show-unvisited');
  }

  unvisitedToggle.addEventListener('click', () => {
    body.classList.toggle('only-show-unvisited');
    const isOnlyShowUnvisited = body.classList.contains('only-show-unvisited');

    setOnlyShowUnvisited(isOnlyShowUnvisited);
    updateSpots();
  });
}
