'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { buildTooltipCompareTwo } from '../../lib/apexcharts-helpers';

// Importar ReactApexChart dinámicamente para evitar problemas de SSR
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface SalesLineChartProps {
  className?: string;
}

/**
 * Gráfico de área grande para mostrar ventas comparativas
 * Reemplaza el gráfico #hs-sales-line-chart
 */
export default function SalesLineChart({ className = 'min-h-[415px]' }: SalesLineChartProps) {
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
      name: '2022',
      data: [18000, 51000, 60000, 38000, 88000, 50000, 40000, 52000, 88000, 80000, 60000, 70000],
    },
    {
      name: '2023',
      data: [27000, 38000, 60000, 77000, 40000, 50000, 49000, 29000, 42000, 27000, 42000, 50000],
    },
  ];

  const baseOptions = {
    chart: {
      height: 400,
      type: 'area' as const,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
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
      categories: [
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
        formatter: (value: number) => (value >= 1000 ? `${value / 1000}k` : String(value)),
      },
    },
    tooltip: {
      x: {
        format: 'MMMM yyyy',
      },
      y: {
        formatter: (value: number) => `$${value >= 1000 ? `${value / 1000}k` : value}`,
      },
      custom: function (props: any) {
        return buildTooltipCompareTwo(props, {
          title: 'Revenue',
          mode,
          hasTextLabel: true,
          wrapperExtClasses: 'min-w-48',
        });
      },
    },
    responsive: [
      {
        breakpoint: 568,
        options: {
          chart: {
            height: 300,
          },
          xaxis: {
            labels: {
              style: {
                colors: mode === 'dark' ? '#a3a3a3' : '#9ca3af',
                fontSize: '11px',
                fontFamily: 'Inter, ui-sans-serif',
                fontWeight: 400,
              },
              offsetX: -2,
              formatter: (title: string) => title.slice(0, 3),
            },
          },
          yaxis: {
            labels: {
              align: 'left' as const,
              minWidth: 0,
              maxWidth: 140,
              style: {
                colors: mode === 'dark' ? '#a3a3a3' : '#9ca3af',
                fontSize: '11px',
                fontFamily: 'Inter, ui-sans-serif',
                fontWeight: 400,
              },
              formatter: (value: number) => (value >= 1000 ? `${value / 1000}k` : String(value)),
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

  return (
    <div className={className}>
      <ReactApexChart options={finalOptions} series={series} type="area" height={400} />
    </div>
  );
}
