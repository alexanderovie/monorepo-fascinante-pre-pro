'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

// Optional third-party libraries
import $ from 'jquery';
import _ from 'lodash';
import noUiSlider from 'nouislider';
import 'datatables.net';
import 'dropzone/dist/dropzone-min.js';
import * as VanillaCalendarPro from 'vanilla-calendar-pro';

window._ = _;
window.$ = $;
window.jQuery = $;
window.DataTable = $.fn.dataTable;
window.noUiSlider = noUiSlider;
window.VanillaCalendarPro = VanillaCalendarPro;

// Preline UI
async function loadPreline() {
  return import('preline/dist/index.js');
}

export default function PrelineScript() {
  const path = usePathname();

  useEffect(() => {
    const initPreline = async () => {
      await loadPreline();
    };

    initPreline();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      // Solo inicializar Preline si hay elementos en el DOM con atributos data-hs-*
      const hasPrelineElements = document.querySelectorAll('[data-hs-overlay], [data-hs-dropdown], [data-hs-collapse], [data-hs-select]').length > 0;

      if (
        hasPrelineElements &&
        window.HSStaticMethods &&
        typeof window.HSStaticMethods.autoInit === 'function'
      ) {
        window.HSStaticMethods.autoInit();
      }
    }, 100);
  }, [path]);

  return null;
}
