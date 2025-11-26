'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { buildTooltipCompareTwo } from '../../lib/apexcharts-helpers';

// Importar ReactApexChart dinámicamente para evitar problemas de SSR
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

/**
 * Hook para detectar el tamaño de la ventana y breakpoints
 * Elite: Maneja SSR correctamente y optimiza rendimiento
 */
function useWindowSize() {
  const [windowSize, setWindowSize] = useState<{ width: number; height: number }>(() => {
    // Estado inicial seguro para SSR
    if (typeof window === 'undefined') {
      return { width: 1920, height: 1080 };
    }
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    // Throttle para optimizar rendimiento
    let timeoutId: NodeJS.Timeout;
    const throttledResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleResize, 150);
    };

    window.addEventListener('resize', throttledResize, { passive: true });
    // Inicializar con el tamaño actual
    handleResize();

    return () => {
      window.removeEventListener('resize', throttledResize);
      clearTimeout(timeoutId);
    };
  }, []);

  return windowSize;
}

export interface SeriesData {
  name: string;
  data: number[];
}

export interface SalesLineChartProps {
  className?: string;
  tooltipTitle?: string;
  seriesLabels?: [string, string];
  seriesData?: [number[], number[]];
  xAxisCategories?: string[];
  valueFormatter?: (value: number) => string;
  currencySymbol?: string;
  height?: number;
}

/**
 * Gráfico de área doble escalable para comparar dos series de datos
 *
 * @example
 * <SalesLineChart
 *   tooltipTitle="Traffic"
 *   seriesLabels={['This month', 'Last month']}
 *   seriesData={[[18000, 51000], [27000, 38000]]}
 * />
 */
export default function SalesLineChart({
  className = 'min-h-[415px]',
  tooltipTitle = 'Traffic',
  seriesLabels = ['This month', 'Last month'],
  seriesData = [
    [18000, 51000, 60000, 38000, 88000, 50000, 40000, 52000, 88000, 80000, 60000, 70000],
    [27000, 38000, 60000, 77000, 40000, 50000, 49000, 29000, 42000, 27000, 42000, 50000],
  ],
  xAxisCategories = [
    '25 January 2023',
    '28 January 2023',
    '31 January 2023',
    '1 February 2023',
    '3 February 2023',
    '6 February 2023',
    '9 February 2023',
    '12 February 2023',
    '15 February 2023',
    '18 February 2023',
    '21 February 2023',
    '25 February 2023',
  ],
  valueFormatter,
  currencySymbol = '',
  height = 400,
}: SalesLineChartProps) {
  // Patrón moderno Next.js 15/React: useState + useEffect para evitar hydration mismatch
  // Basado en documentación oficial: https://react.dev/link/hydration-mismatch
  const [isClient, setIsClient] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [dynamicHeight, setDynamicHeight] = useState(height);
  const { width: windowWidth } = useWindowSize();

  // Inicializar solo en el cliente (patrón recomendado por React/Next.js)
  useEffect(() => {
    setIsClient(true);

    // Detectar tema actual
    const checkTheme = () => {
      const html = document.documentElement;
      setIsDark(html.classList.contains('dark'));
    };

    checkTheme();

    // Escuchar cambios de tema
    const handleThemeChange = (e: CustomEvent) => {
      setIsDark(e.detail === 'dark');
    };

    document.addEventListener('hsThemeChangeEvent', handleThemeChange as EventListener);

    return () => {
      document.removeEventListener('hsThemeChangeEvent', handleThemeChange as EventListener);
    };
  }, []);

  // Calcular altura dinámica solo después del mount (evita hydration mismatch)
  useEffect(() => {
    if (!isClient) return;

    const calculateHeight = () => {
      if (windowWidth < 640) {
        // Mobile: altura más pequeña
        return Math.max(250, height * 0.6);
      } else if (windowWidth < 1024) {
        // Tablet: altura media
        return Math.max(300, height * 0.75);
      }
      // Desktop: altura completa
      return height;
    };

    setDynamicHeight(calculateHeight());
  }, [isClient, windowWidth, height]);

  const mode = isDark ? 'dark' : 'light';

  // Formatter por defecto si no se proporciona uno
  const defaultFormatter = (value: number) => {
    if (value >= 1000) {
      return `${value / 1000}k`;
    }
    return String(value);
  };

  const formatValue = valueFormatter || defaultFormatter;

  const series: SeriesData[] = [
    {
      name: seriesLabels[0],
      data: seriesData[0],
    },
    {
      name: seriesLabels[1],
      data: seriesData[1],
    },
  ];

  const baseOptions = {
    chart: {
      height: isClient ? dynamicHeight : height, // Usar altura por defecto durante SSR
      type: 'area' as const,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
      animations: {
        enabled: isClient, // Deshabilitar animaciones durante SSR
        easing: 'easeinout',
        speed: 800,
      },
    },
    series,
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'straight' as const,
      width: 2,
    },
    fill: {
      type: 'gradient' as const,
      gradient: {
        type: 'vertical' as const,
        shadeIntensity: 1,
        opacityFrom: 0.2,
        opacityTo: 0.8,
      },
    },
    xaxis: {
      type: 'category' as const,
      tickPlacement: 'on' as const,
      categories: xAxisCategories,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      crosshairs: {
        stroke: {
          dashArray: 0,
        },
        dropShadow: {
          show: false,
        },
      },
      tooltip: {
        enabled: false,
      },
      labels: {
        style: {
          colors: mode === 'dark' ? '#a3a3a3' : '#9ca3af',
          fontSize: '13px',
          fontFamily: 'Inter, ui-sans-serif',
          fontWeight: 400,
        },
        formatter: (title: string) => {
          let t = title;
          if (t) {
            const newT = t.split(' ');
            t = `${newT[0]} ${newT[1].slice(0, 3)}`;
          }
          return t;
        },
      },
    },
    yaxis: {
      labels: {
        align: 'left' as const,
        minWidth: 0,
        maxWidth: 140,
        style: {
          colors: mode === 'dark' ? '#a3a3a3' : '#9ca3af',
          fontSize: '12px',
          fontFamily: 'Inter, ui-sans-serif',
          fontWeight: 400,
        },
        formatter: formatValue,
      },
    },
    tooltip: {
      x: {
        format: 'MMMM yyyy',
      },
      y: {
        formatter: (value: number) => {
          const formatted = formatValue(value);
          return currencySymbol ? `${currencySymbol}${formatted}` : formatted;
        },
      },
      custom: function (props: any) {
        return buildTooltipCompareTwo(props, {
          title: tooltipTitle,
          mode,
          hasTextLabel: true,
          wrapperExtClasses: 'min-w-48',
          compareLabels: seriesLabels,
        });
      },
    },
    responsive: [
      {
        breakpoint: 1024,
        options: {
          chart: {
            height: Math.max(300, height * 0.75),
          },
          xaxis: {
            labels: {
              style: {
                colors: mode === 'dark' ? '#a3a3a3' : '#9ca3af',
                fontSize: '12px',
                fontFamily: 'Inter, ui-sans-serif',
                fontWeight: 400,
              },
            },
          },
        },
      },
      {
        breakpoint: 768,
        options: {
          chart: {
            height: Math.max(280, height * 0.7),
          },
          xaxis: {
            labels: {
              style: {
                colors: mode === 'dark' ? '#a3a3a3' : '#9ca3af',
                fontSize: '11px',
                fontFamily: 'Inter, ui-sans-serif',
                fontWeight: 400,
              },
              offsetX: -1,
            },
          },
          yaxis: {
            labels: {
              maxWidth: 80,
              style: {
                fontSize: '11px',
              },
            },
          },
        },
      },
      {
        breakpoint: 640,
        options: {
          chart: {
            height: Math.max(250, height * 0.6),
          },
          xaxis: {
            labels: {
              style: {
                colors: mode === 'dark' ? '#a3a3a3' : '#9ca3af',
                fontSize: '10px',
                fontFamily: 'Inter, ui-sans-serif',
                fontWeight: 400,
              },
              offsetX: -2,
              formatter: (title: string) => {
                if (!title) return '';
                const parts = title.split(' ');
                return parts.length > 1 ? `${parts[0].slice(0, 3)} ${parts[1]?.slice(0, 3) || ''}` : title.slice(0, 3);
              },
            },
          },
          yaxis: {
            labels: {
              align: 'left' as const,
              minWidth: 0,
              maxWidth: 60,
              style: {
                colors: mode === 'dark' ? '#a3a3a3' : '#9ca3af',
                fontSize: '10px',
                fontFamily: 'Inter, ui-sans-serif',
                fontWeight: 400,
              },
              formatter: formatValue,
            },
          },
        },
      },
    ],
  };

  const lightOptions = {
    colors: ['#2563eb', '#9333ea'],
    fill: {
      gradient: {
        shadeIntensity: 0.1,
        opacityFrom: 0.5,
        opacityTo: 0,
        stops: [50, 100, 100, 100],
      },
    },
    xaxis: {
      labels: {
        style: {
          colors: '#9ca3af',
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: '#9ca3af',
        },
      },
    },
    grid: {
      strokeDashArray: 2,
      borderColor: '#e5e7eb',
    },
  };

  const darkOptions = {
    colors: ['#3b82f6', '#a855f7'],
    fill: {
      gradient: {
        shadeIntensity: 0.1,
        opacityFrom: 0.5,
        opacityTo: 0,
        stops: [50, 100, 100, 100],
      },
    },
    xaxis: {
      labels: {
        style: {
          colors: '#a3a3a3',
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: '#a3a3a3',
        },
      },
    },
    grid: {
      strokeDashArray: 2,
      borderColor: '#404040',
    },
  };

  const finalOptions = {
    ...baseOptions,
    ...(mode === 'dark' ? darkOptions : lightOptions),
  };

  // Patrón moderno: renderizar placeholder durante SSR, gráfico después del mount
  if (!isClient) {
    return (
      <div className={className} aria-label="Loading chart..." />
    );
  }

  return (
    <div className={className}>
      <ReactApexChart
        options={finalOptions}
        series={series}
        type="area"
        height={dynamicHeight}
      />
    </div>
  );
}
