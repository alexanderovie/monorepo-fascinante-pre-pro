import type { IStaticMethods } from "preline/dist";
import type { TooltipOptions, TooltipCompareOptions } from "./lib/apexcharts-helpers";
import ApexCharts from "apexcharts";

declare global {
  interface Window {
    // Optional third-party libraries
    _: typeof import("lodash");
    $: typeof import("jquery");
    jQuery: typeof import("jquery");
    DataTable: any;
    Dropzone: any;
    noUiSlider: any;
    VanillaCalendarPro: typeof import("vanilla-calendar-pro");

    // ApexCharts
    ApexCharts: typeof ApexCharts;
    buildChart: (
      selector: string,
      configFn: (mode: "light" | "dark") => any,
      lightOptions?: any,
      darkOptions?: any
    ) => any;
    buildTooltip: (props: any, options: TooltipOptions) => string;
    buildTooltipCompareTwo: (props: any, options: TooltipCompareOptions) => string;

    // Preline UI
    HSStaticMethods: IStaticMethods;
  }
}

export {};
