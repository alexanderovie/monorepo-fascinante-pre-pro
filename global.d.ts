import type { IStaticMethods } from "preline/dist";

declare global {
  interface Window {
    // Optional third-party libraries
    _;
    $: typeof import("jquery");
    jQuery: typeof import("jquery");
    DataTable;
    Dropzone;
    noUiSlider;
    VanillaCalendarPro;

    // Preline UI
    HSStaticMethods: IStaticMethods;
    HSTabs?: {
      getInstance?: (selector: string | HTMLElement, create: boolean) => {
        element: {
          on: (event: string, callback: (data: { el: HTMLElement }) => void) => void;
          current: HTMLElement;
        };
      } | null;
    };
    HSScrollNav?: {
      getInstance?: (selector: string | HTMLElement, create: boolean) => {
        element: {
          centerElement: (el: HTMLElement) => void;
        };
      } | null;
    };
  }

  interface CustomEventMap {
    'change.hs.tab': CustomEvent<{ payload: { tabsId: string } }>;
    'beforeOpen.hs.accordion': CustomEvent<{ payload: HTMLElement }>;
  }

  interface WindowEventMap extends CustomEventMap {}
}

export {};
