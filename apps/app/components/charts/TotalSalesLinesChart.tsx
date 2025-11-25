'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { buildTooltip } from '../../lib/apexcharts-helpers';

// Importar ReactApexChart dinámicamente para evitar problemas de SSR
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface TotalSalesLinesChartProps {
  className?: string;
}

/**
 * Gráfico sparkline pequeño para mostrar ventas totales
 * Reemplaza el gráfico #hs-total-sales-lines-chart
 */
export default function TotalSalesLinesChart({ className = 'min-h-[115px]' }: TotalSalesLinesChartProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
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

  if (!isMounted) {
    return <div className={className} />;
  }

  const mode = isDark ? 'dark' : 'light';

  const series = [
    {
      name: 'Store sales',
      data: [0, 27000, 5000, 27000, 40000, 30000, 48000],
    },
    {
      name: 'Online sales',
      data: [19500, 10000, 1000, 17500, 6000, 20500, 24000],
    },
    {
      name: 'Others',
      data: [12500, 7000, 4000, 8000, 10000, 12800, 8500],
    },
  ];

  const baseOptions = {
    chart: {
      height: 100,
      type: 'line' as const,
      sparkline: {
        enabled: true,
      },
    },
    series,
    stroke: {
      curve: 'straight' as const,
      width: 2,
    },
    xaxis: {
      type: 'category' as const,
      categories: [
        '25 January 2023',
        '1 February 2023',
        '5 February 2023',
        '10 February 2023',
        '15 February 2023',
        '20 February 2023',
        '25 February 2023',
      ],
      crosshairs: {
        show: false,
      },
    },
    markers: {
      hover: {
        size: 0,
      },
    },
    tooltip: {
      custom: function (props: any) {
        const { categories } = props.ctx.opts.xaxis;
        const { dataPointIndex } = props;
        const title = categories[dataPointIndex];

        return buildTooltip(props, {
          title: title,
          mode,
          hasTextLabel: true,
          wrapperExtClasses: 'min-w-48',
          labelDivider: ':',
          labelExtClasses: 'ms-2',
        });
      },
    },
  };

  const lightOptions = {
    colors: ['#2563EB', '#9333ea', '#d1d5db'],
    grid: {
      borderColor: '#e5e7eb',
    },
    fill: {
      type: 'gradient' as const,
      gradient: {
        gradientToColors: ['#fff', '#fff', '#fff'],
      },
    },
  };

  const darkOptions = {
    colors: ['#3b82f6', '#a855f7', '#737373'],
    grid: {
      borderColor: '#404040',
    },
    fill: {
      type: 'gradient' as const,
      gradient: {
        gradientToColors: ['#262626', '#262626', '#262626'],
      },
    },
  };

  const finalOptions = {
    ...baseOptions,
    ...(mode === 'dark' ? darkOptions : lightOptions),
  };

  return (
    <div className={className}>
      <ReactApexChart options={finalOptions} series={series} type="line" height={100} />
    </div>
  );
}

