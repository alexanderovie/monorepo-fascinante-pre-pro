import type { IStaticMethods } from "preline/dist";

declare global {
  interface Window {
    // Preline UI
    HSStaticMethods: IStaticMethods;
    HSTabs: {
      getInstance: (selector: string, createIfNotExists?: boolean) => {
        element: {
          on: (event: string, callback: (data: { el: HTMLElement }) => void) => void;
          current: HTMLElement;
        };
      } | null;
    };
    HSScrollNav: {
      getInstance: (selector: string, createIfNotExists?: boolean) => {
        element: {
          centerElement: (el: HTMLElement) => void;
        };
      } | null;
    };
    _: {
      debounce: <T extends (...args: any[]) => any>(
        func: T,
        wait: number
      ) => T;
    };
    HSCarousel: {
      getInstance: (selector: string, createIfNotExists?: boolean) => {
        element: {
          on: (event: string, callback: (data: any) => void) => void;
          current: HTMLElement;
        };
      } | null;
    };
    HSAccordion: {
      getInstance: (selector: string, createIfNotExists?: boolean) => {
        element: {
          on: (event: string, callback: (data: any) => void) => void;
        };
      } | null;
    };
    HSDatepicker: {
      getInstance: (selector: string | HTMLElement, createIfNotExists?: boolean) => {
        element: {
          vanillaCalendar: any;
          addEventListener: (event: string, callback: (e: CustomEvent) => void) => void;
          getCurrentState: () => any;
          formatDate: (date: Date) => string;
        };
      } | null;
    };
  }
}

export {};
