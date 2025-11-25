'use client';

import { useEffect } from 'react';

export default function ThemeScript() {
  useEffect(() => {
    // Theme Check and Update
    const html = document.querySelector('html');
    if (!html) return;

    const isLightOrAuto = localStorage.getItem('hs_theme') === 'light' ||
      (localStorage.getItem('hs_theme') === 'auto' && !window.matchMedia('(prefers-color-scheme: dark)').matches);
    const isDarkOrAuto = localStorage.getItem('hs_theme') === 'dark' ||
      (localStorage.getItem('hs_theme') === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (isLightOrAuto && html.classList.contains('dark')) html.classList.remove('dark');
    else if (isDarkOrAuto && html.classList.contains('light')) html.classList.remove('light');
    else if (isDarkOrAuto && !html.classList.contains('dark')) html.classList.add('dark');
    else if (isLightOrAuto && !html.classList.contains('light')) html.classList.add('light');
  }, []);

  return null;
}
