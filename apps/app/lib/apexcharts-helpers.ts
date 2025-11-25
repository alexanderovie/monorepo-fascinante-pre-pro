/**
 * ApexCharts Helper Functions
 * Funciones helper escalables para ApexCharts tooltips y configuración
 */

export interface TooltipOptions {
  title?: string;
  mode?: 'light' | 'dark';
  hasTextLabel?: boolean;
  wrapperExtClasses?: string;
  labelDivider?: string;
  labelExtClasses?: string;
}

export interface TooltipCompareOptions extends TooltipOptions {
  compareLabels?: string[];
}

/**
 * Construye un tooltip básico para ApexCharts
 */
export function buildTooltip(props: any, options: TooltipOptions): string {
  const {
    title,
    mode = 'light',
    hasTextLabel = false,
    wrapperExtClasses = '',
    labelDivider = ':',
    labelExtClasses = '',
  } = options;

  const { series, seriesIndex, dataPointIndex, w } = props;
  const isDark = mode === 'dark';

  // Clases base según el modo
  const bgClass = isDark ? 'bg-neutral-800' : 'bg-white';
  const textClass = isDark ? 'text-neutral-200' : 'text-gray-800';
  const borderClass = isDark ? 'border-neutral-700' : 'border-gray-200';

  let html = `<div class="${bgClass} ${textClass} border ${borderClass} rounded-lg shadow-lg p-3 ${wrapperExtClasses}">`;

  // Título si existe
  if (title) {
    html += `<div class="font-semibold mb-2 text-sm ${textClass}">${title}</div>`;
  }

  // Datos de la serie
  if (series && series[seriesIndex] !== undefined) {
    const value = series[seriesIndex][dataPointIndex];
    const seriesName = w.globals.seriesNames[seriesIndex] || `Series ${seriesIndex + 1}`;

    html += `<div class="flex items-center gap-2 text-sm">`;
    if (hasTextLabel) {
      html += `<span class="${textClass}">${seriesName}${labelDivider}</span>`;
    }
    html += `<span class="font-semibold ${textClass} ${labelExtClasses}">${formatValue(value)}</span>`;
    html += `</div>`;
  }

  html += `</div>`;
  return html;
}

/**
 * Construye un tooltip para comparar dos series
 */
export function buildTooltipCompareTwo(
  props: any,
  options: TooltipCompareOptions
): string {
  const {
    title,
    mode = 'light',
    hasTextLabel = false,
    wrapperExtClasses = '',
    compareLabels = [],
  } = options;

  const { series, dataPointIndex, w } = props;
  const isDark = mode === 'dark';

  // Clases base según el modo
  const bgClass = isDark ? 'bg-neutral-800' : 'bg-white';
  const textClass = isDark ? 'text-neutral-200' : 'text-gray-800';
  const borderClass = isDark ? 'border-neutral-700' : 'border-gray-200';

  let html = `<div class="${bgClass} ${textClass} border ${borderClass} rounded-lg shadow-lg p-3 ${wrapperExtClasses}">`;

  // Título si existe
  if (title) {
    html += `<div class="font-semibold mb-2 text-sm ${textClass}">${title}</div>`;
  }

  // Comparar las dos primeras series
  if (series && series.length >= 2) {
    const value1 = series[0][dataPointIndex];
    const value2 = series[1][dataPointIndex];
    const label1 = compareLabels[0] || w.globals.seriesNames[0] || 'Series 1';
    const label2 = compareLabels[1] || w.globals.seriesNames[1] || 'Series 2';

    html += `<div class="space-y-1 text-sm">`;
    html += `<div class="flex items-center justify-between gap-4">`;
    html += `<span class="${textClass}">${label1}:</span>`;
    html += `<span class="font-semibold ${textClass}">${formatValue(value1)}</span>`;
    html += `</div>`;
    html += `<div class="flex items-center justify-between gap-4">`;
    html += `<span class="${textClass}">${label2}:</span>`;
    html += `<span class="font-semibold ${textClass}">${formatValue(value2)}</span>`;
    html += `</div>`;
    html += `</div>`;
  }

  html += `</div>`;
  return html;
}

/**
 * Formatea un valor numérico para mostrar en tooltips
 */
function formatValue(value: number | string): string {
  if (typeof value === 'string') return value;
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
  return value.toLocaleString();
}

/**
 * Configura buildChart helper para ApexCharts
 */
export function setupApexChartsHelpers(ApexCharts: any) {
  if (typeof window === 'undefined') return;

  // Función helper para buildChart
  (window as any).buildChart = function (
    selector: string,
    configFn: (mode: 'light' | 'dark') => any,
    lightOptions?: any,
    darkOptions?: any
  ) {
    const mode = document.documentElement.classList.contains('dark')
      ? 'dark'
      : 'light';
    const options = mode === 'dark' ? darkOptions : lightOptions;
    const config = configFn(mode);
    const finalConfig = { ...config, ...options };

    const element = document.querySelector(selector);
    if (element && ApexCharts) {
      const chart = new ApexCharts(element, finalConfig);
      chart.render();

      // Manejar cambios de tema
      const handleThemeChange = (e: CustomEvent) => {
        const newMode = e.detail === 'dark' ? 'dark' : 'light';
        const newOptions = newMode === 'dark' ? darkOptions : lightOptions;
        const newConfig = configFn(newMode);
        chart.updateOptions({ ...newConfig, ...newOptions });
      };

      document.addEventListener('hsThemeChangeEvent', handleThemeChange as EventListener);

      return chart;
    }
  };

  // Función helper para buildTooltip
  (window as any).buildTooltip = function (props: any, options: TooltipOptions) {
    return buildTooltip(props, options);
  };

  // Función helper para buildTooltipCompareTwo
  (window as any).buildTooltipCompareTwo = function (
    props: any,
    options: TooltipCompareOptions
  ) {
    return buildTooltipCompareTwo(props, options);
  };
}
