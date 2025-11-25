'use client';

import { useEffect } from 'react';

const EMPTY_STATES_HTML = `<!-- ========== HEADER ========== -->
  <header class="w-full lg:ms-65 lg:w-[calc(100vw-var(--spacing-65))] fixed top-0 right-0 flex flex-wrap md:justify-start md:flex-nowrap z-50 bg-white border-b border-gray-200 dark:bg-neutral-800 dark:border-neutral-700">
    <div class="flex justify-between xl:grid xl:grid-cols-3 basis-full items-center w-full py-2.5 px-2 sm:px-5 lg:px-5">
      <div class="xl:col-span-1 flex items-center md:gap-x-3">
        <div class="lg:hidden">
          <!-- Sidebar Toggle -->
          <button type="button" class="w-7 h-9.5 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700" aria-haspopup="dialog" aria-expanded="false" aria-controls="hs-pro-sidebar" aria-label="Toggle navigation" data-hs-overlay="#hs-pro-sidebar">
            <svg class="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 8L21 12L17 16M3 12H13M3 6H13M3 18H13" />
            </svg>
          </button>
          <!-- End Sidebar Toggle -->
        </div>

        <div class="hidden lg:block min-w-80 xl:w-full">
          <!-- Search Input -->
          <div class="relative">
            <div class="absolute inset-y-0 start-0 flex items-center pointer-events-none z-20 ps-3.5">
              <svg class="shrink-0 size-4 text-gray-400 dark:text-white/60" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </div>
            <input type="text" class="py-2 ps-10 pe-16 block w-full bg-white border-gray-200 rounded-lg text-sm focus:outline-hidden focus:ring-0 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder:text-neutral-400 dark:focus:ring-neutral-600" placeholder="Search Preline" data-hs-overlay="#hs-pro-dnsm">
            <div class="hidden absolute inset-y-0 end-0 flex items-center z-20 pe-1">
              <button type="button" class="inline-flex shrink-0 justify-center items-center size-6 rounded-full text-gray-500 hover:text-blue-600 focus:outline-hidden focus:text-blue-600 dark:text-neutral-500 dark:hover:text-blue-500 dark:focus:text-blue-500" aria-label="Close">
                <span class="sr-only">Close</span>
                <svg class="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="m15 9-6 6" />
                  <path d="m9 9 6 6" />
                </svg>
              </button>
            </div>
            <div class="absolute inset-y-0 end-0 flex items-center pointer-events-none z-20 pe-3 text-gray-400">
              <svg class="shrink-0 size-3 text-gray-400 dark:text-white/60" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
              </svg>
              <span class="mx-1">
                <svg class="shrink-0 size-3 text-gray-400 dark:text-white/60" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M5 12h14" />
                  <path d="M12 5v14" />
                </svg>
              </span>
              <span class="text-xs">/</span>
            </div>
          </div>
          <!-- End Search Input -->
        </div>
      </div>

      <div class="xl:col-span-2 flex justify-end items-center gap-x-2">
        <div class="flex items-center">
          <div class="lg:hidden">
            <!-- Search Button Icon -->
            <button type="button" class="inline-flex shrink-0 justify-center items-center gap-x-2 size-9.5 rounded-full text-gray-500 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700" data-hs-overlay="#hs-pro-dnsm">
              <svg class="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </button>
            <!-- End Search Button Icon -->
          </div>

          <!-- Help Dropdown -->
          <div class="hs-dropdown [--placement:bottom-right] relative inline-flex">
            <!-- Help Button Icon -->
            <div class="hs-tooltip [--placement:bottom] inline-block">
              <button id="hs-pro-dnhd" type="button" class="hs-tooltip-toggle size-9.5 inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 " aria-haspopup="menu" aria-expanded="false" aria-label="Dropdown">
                <svg class="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                  <path d="M12 17h.01" />
                </svg>
              </button>
              <span class="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 inline-block absolute invisible z-20 py-1.5 px-2.5 bg-gray-900 text-xs text-white rounded-lg dark:bg-neutral-700" role="tooltip">
                Help and Support
              </span>
            </div>
            <!-- End Help Button Icon -->

            <!-- Help Dropdown -->
            <div class="hs-dropdown-menu hs-dropdown-open:opacity-100 w-60 transition-[opacity,margin] duration opacity-0 hidden z-10 bg-white rounded-xl shadow-xl dark:bg-neutral-900" role="menu" aria-orientation="vertical" aria-labelledby="hs-pro-dnhd">
              <div class="p-1">
                <a class="flex gap-x-3 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800" href="#">
                  <svg class="shrink-0 mt-0.5 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                    <path d="M12 17h.01" />
                  </svg>
                  Help Centre
                </a>
                <a class="flex gap-x-3 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800" href="#">
                  <svg class="shrink-0 mt-0.5 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  Community
                </a>
                <a class="flex gap-x-3 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800" href="#">
                  <svg class="shrink-0 mt-0.5 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                  </svg>
                  What’s New
                </a>

                <div class="my-1 border-t border-gray-200 dark:border-neutral-800"></div>

                <a class="flex gap-x-3 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800" href="#">
                  <svg class="shrink-0 mt-0.5 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4" />
                    <path d="M12 8h.01" />
                  </svg>
                  Privacy and Legal
                </a>
                <a class="flex gap-x-3 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800" href="#">
                  <svg class="shrink-0 mt-0.5 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                  </svg>
                  Documentation
                </a>
                <a class="flex gap-x-3 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800" href="#">
                  <svg class="shrink-0 mt-0.5 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                  </svg>
                  Hire an Expert
                  <div class="ms-auto">
                    <span class="inline-flex items-center gap-1.5 py-px px-1.5 rounded-sm text-[10px] leading-4 font-medium bg-gray-100 text-gray-800 dark:bg-neutral-700 dark:text-neutral-300">
                      New
                    </span>
                  </div>
                </a>

                <div class="my-1 border-t border-gray-200 dark:border-neutral-800"></div>

                <a class="flex gap-x-3 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800" href="#">
                  <svg class="shrink-0 mt-0.5 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    <line x1="9" x2="15" y1="10" y2="10" />
                    <line x1="12" x2="12" y1="7" y2="13" />
                  </svg>
                  Submit Feedback
                </a>
                <div class="hs-dropdown [--strategy:static] md:[--strategy:absolute] [--adaptive:none] md:[--trigger:hover] relative">
                  <button id="hs-pro-dropdown-help-and-support" type="button" class="hs-dropdown-toggle w-full flex items-center gap-x-3 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800" aria-haspopup="menu" aria-expanded="false" aria-label="Dropdown">
                    <svg class="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                    Contact Us
                    <svg class="rotate-90 md:rotate-0 ms-auto size-3" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </button>

                  <div class="hs-dropdown-menu transition-[opacity,margin] duration-[0.1ms] md:duration-[150ms] hs-dropdown-open:opacity-100 opacity-0 md:w-48 hidden z-10 top-0 end-full md:me-3! md:mt-1 md:p-1 bg-white md:shadow-xl md:rounded-lg before:absolute before:-end-5 before:top-0 before:h-full before:w-5 dark:bg-neutral-900" role="menu" aria-orientation="vertical" aria-labelledby="hs-pro-dropdown-help-and-support">
                    <a class="flex gap-x-3 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800" href="#">
                      <svg class="shrink-0 mt-0.5 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z" />
                        <path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1" />
                      </svg>
                      Contact Support
                    </a>
                    <a class="flex gap-x-3 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800" href="#">
                      <svg class="shrink-0 mt-0.5 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3" />
                      </svg>
                      Contact Sales
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <!-- End Help Dropdown -->
          </div>
          <!-- End Help Dropdown -->

          <!-- Notifications Button Icon -->
          <div class="hs-dropdown [--auto-close:inside] [--placement:bottom-right] relative inline-flex">
            <div class="hs-tooltip [--placement:bottom] inline-block">
              <button id="hs-pro-dnnd" type="button" class="hs-tooltip-toggle relative size-9.5 inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700" aria-haspopup="menu" aria-expanded="false" aria-label="Dropdown">
                <svg class="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                  <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                </svg>
                <span class="flex absolute top-0 end-0 z-10 -mt-1.5 -me-1.5">
                  <span class="animate-ping absolute inline-flex size-full rounded-full bg-red-400 opacity-75 dark:bg-red-600"></span>
                  <span class="relative min-w-4.5 min-h-4.5 inline-flex justify-center items-center text-[10px] bg-red-500 text-white rounded-full px-1">
                    2
                  </span>
                </span>
              </button>
              <span class="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 inline-block absolute invisible z-20 py-1.5 px-2.5 bg-gray-900 text-xs text-white rounded-lg dark:bg-neutral-700" role="tooltip">
                Notifications
              </span>
            </div>
            <!-- End Notifications Button Icon -->

            <!-- Notifications Dropdown -->
            <div class="hs-dropdown-menu hs-dropdown-open:opacity-100 w-full sm:w-96 transition-[opacity,margin] duration opacity-0 hidden z-10 bg-white border-t border-gray-200 sm:border-t-0 sm:rounded-lg shadow-md sm:shadow-xl dark:bg-neutral-900 dark:border-neutral-700" role="menu" aria-orientation="vertical" aria-labelledby="hs-pro-dnnd">
              <!-- Header -->
              <div class="px-5 pt-3 flex justify-between items-center border-b border-gray-200 dark:border-neutral-800">
                <!-- Nav Tab -->
                <nav class="flex gap-1" aria-label="Tabs" role="tablist" aria-orientation="horizontal">
                  <button type="button" class="hs-tab-active:after:bg-gray-800 hs-tab-active:text-gray-800 px-2 py-1.5 mb-2 relative inline-flex justify-center items-center gap-x-2 hover:bg-gray-100 text-gray-500 hover:text-gray-800 text-sm rounded-lg disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100 after:absolute after:-bottom-2 after:inset-x-2 after:z-10 after:h-0.5 after:pointer-events-none dark:hs-tab-active:text-neutral-200 dark:hs-tab-active:after:bg-neutral-400 dark:text-neutral-500 dark:hover:text-neutral-300 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden active" id="hs-pro-tabs-dnn-item-all" aria-selected="true" data-hs-tab="#hs-pro-tabs-dnn-all" aria-controls="hs-pro-tabs-dnn-all" role="tab">
                    All
                  </button>
                  <button type="button" class="hs-tab-active:after:bg-gray-800 hs-tab-active:text-gray-800 px-2 py-1.5 mb-2 relative inline-flex justify-center items-center gap-x-2 hover:bg-gray-100 text-gray-500 hover:text-gray-800 text-sm rounded-lg disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100 after:absolute after:-bottom-2 after:inset-x-2 after:z-10 after:h-0.5 after:pointer-events-none dark:hs-tab-active:text-neutral-200 dark:hs-tab-active:after:bg-neutral-400 dark:text-neutral-500 dark:hover:text-neutral-300 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden " id="hs-pro-tabs-dnn-item-archived" aria-selected="false" data-hs-tab="#hs-pro-tabs-dnn-archived" aria-controls="hs-pro-tabs-dnn-archived" role="tab">
                    Archived
                  </button>
                </nav>
                <!-- End Nav Tab -->

                <!-- Notifications Button Icon -->
                <div class="hs-tooltip relative inline-block mb-3">
                  <a class="hs-tooltip-toggle size-7 inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800" href="../../pro/dashboard/account-profile.html">
                    <svg class="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </a>
                  <span class="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 inline-block absolute invisible z-20 py-1.5 px-2.5 bg-gray-900 text-xs text-white rounded-lg dark:bg-neutral-700" role="tooltip">
                    Preferences
                  </span>
                </div>
                <!-- End Notifications Button Icon -->
              </div>
              <!-- End Header -->

              <!-- Tab Content -->
              <div id="hs-pro-tabs-dnn-all" role="tabpanel" aria-labelledby="hs-pro-tabs-dnn-item-all">
                <div class="h-120 overflow-y-auto overflow-hidden [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
                  <ul class="divide-y divide-gray-200 dark:divide-neutral-800">
                    <!-- List Item -->
                    <li class="relative group w-full flex gap-x-5 text-start bg-gray-100 dark:bg-neutral-800 p-5">
                      <div class="relative shrink-0">
                        <img class="shrink-0 size-9.5 rounded-full" src="https://images.unsplash.com/photo-1659482634023-2c4fda99ac0c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=3&w=320&h=320&q=80" alt="Avatar">
                        <span class="absolute top-4 -start-3 size-2 bg-blue-600 rounded-full dark:bg-blue-500"></span>
                      </div>
                      <div class="grow">
                        <p class="text-xs text-gray-500 dark:text-neutral-500">
                          2 hours ago
                        </p>

                        <span class="block text-sm font-medium text-gray-800 dark:text-neutral-300">
                          Eilis Warner
                        </span>
                        <p class="text-sm text-gray-500 dark:text-neutral-500">
                          changed an issue from 'in Progress' to 'Review'
                        </p>
                      </div>

                      <div>
                        <div class="sm:group-hover:opacity-100 sm:opacity-0 sm:absolute sm:top-5 sm:end-5">
                          <!-- Segment Button Group -->
                          <div class="inline-block p-0.5 bg-white border border-gray-200 rounded-lg shadow-2xs transition ease-out dark:bg-neutral-800 dark:border-neutral-700">
                            <div class="flex items-center">
                              <div class="hs-tooltip relative inline-block">
                                <button type="button" class="hs-tooltip-toggle size-7 flex shrink-0 justify-center items-center text-gray-500 hover:bg-gray-100 hover:text-gray-800 rounded-sm disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100 dark:hover:bg-neutral-700 dark:text-neutral-400 dark:focus:bg-neutral-700">
                                  <svg class="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <polyline points="9 11 12 14 22 4" />
                                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                                  </svg>
                                  <svg class="shrink-0 size-4 hidden" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <rect width="18" height="18" x="3" y="3" rx="2" />
                                    <path d="M8 12h8" />
                                  </svg>
                                </button>
                                <span class="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 inline-block absolute invisible z-20 py-1.5 px-2.5 bg-gray-900 text-xs text-white rounded-lg dark:bg-neutral-700" role="tooltip">
                                  Mark this notification as read
                                </span>
                              </div>
                              <div class="hs-tooltip relative inline-block">
                                <button type="button" class="hs-tooltip-toggle size-7 flex shrink-0 justify-center items-center text-gray-500 hover:bg-gray-100 hover:text-gray-800 rounded-sm disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100 dark:hover:bg-neutral-700 dark:text-neutral-400 dark:focus:bg-neutral-700">
                                  <svg class="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <rect width="20" height="5" x="2" y="4" rx="2" />
                                    <path d="M4 9v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9" />
                                    <path d="M10 13h4" />
                                  </svg>
                                </button>
                                <span class="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 inline-block absolute invisible z-20 py-1.5 px-2.5 bg-gray-900 text-xs text-white rounded-lg dark:bg-neutral-700" role="tooltip">
                                  Archive this notification
                                </span>
                              </div>
                            </div>
                          </div>
                          <!-- End Segment Button Group -->
                        </div>
                      </div>
                    </li>
                    <!-- End List Item -->

                    <!-- List Item -->
                    <li class="relative group w-full flex gap-x-5 text-start  p-5">
                      <div class="relative shrink-0">
                        <span class="flex shrink-0 justify-center items-center size-9.5 bg-white border border-gray-200 text-gray-500 text-sm font-semibold rounded-full shadow-2xs dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400">
                          C
                        </span>
                      </div>
                      <div class="grow">
                        <p class="text-xs text-gray-500 dark:text-neutral-500">
                          3 days ago
                        </p>

                        <span class="block text-sm font-medium text-gray-800 dark:text-neutral-300">
                          Clara Becker
                        </span>
                        <p class="text-sm text-gray-500 dark:text-neutral-500">
                          mentioned you in a comment
                        </p>
                        <div class="mt-2">
                          <blockquote class="ps-3 border-s-4 border-gray-200 text-sm text-gray-500 dark:border-neutral-700 dark:text-neutral-400">
                            Nice work, love! You really nailed it. Keep it up!
                          </blockquote>
                        </div>
                      </div>

                      <div>
                        <div class="sm:group-hover:opacity-100 sm:opacity-0 sm:absolute sm:top-5 sm:end-5">
                          <!-- Segment Button Group -->
                          <div class="inline-block p-0.5 bg-white border border-gray-200 rounded-lg shadow-2xs transition ease-out dark:bg-neutral-800 dark:border-neutral-700">
                            <div class="flex items-center">
                              <div class="hs-tooltip relative inline-block">
                                <button type="button" class="hs-tooltip-toggle size-7 flex shrink-0 justify-center items-center text-gray-500 hover:bg-gray-100 hover:text-gray-800 rounded-sm disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100 dark:hover:bg-neutral-700 dark:text-neutral-400 dark:focus:bg-neutral-700">
                                  <svg class="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <polyline points="9 11 12 14 22 4" />
                                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                                  </svg>
                                  <svg class="shrink-0 size-4 hidden" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <rect width="18" height="18" x="3" y="3" rx="2" />
                                    <path d="M8 12h8" />
                                  </svg>
                                </button>
                                <span class="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 inline-block absolute invisible z-20 py-1.5 px-2.5 bg-gray-900 text-xs text-white rounded-lg dark:bg-neutral-700" role="tooltip">
                                  Mark this notification as read
                                </span>
                              </div>
                              <div class="hs-tooltip relative inline-block">
                                <button type="button" class="hs-tooltip-toggle size-7 flex shrink-0 justify-center items-center text-gray-500 hover:bg-gray-100 hover:text-gray-800 rounded-sm disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100 dark:hover:bg-neutral-700 dark:text-neutral-400 dark:focus:bg-neutral-700">
                                  <svg class="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <rect width="20" height="5" x="2" y="4" rx="2" />
                                    <path d="M4 9v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9" />
                                    <path d="M10 13h4" />
                                  </svg>
                                </button>
                                <span class="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 inline-block absolute invisible z-20 py-1.5 px-2.5 bg-gray-900 text-xs text-white rounded-lg dark:bg-neutral-700" role="tooltip">
                                  Archive this notification
                                </span>
                              </div>
                            </div>
                          </div>
                          <!-- End Segment Button Group -->
                        </div>
                      </div>
                    </li>
                    <!-- End List Item -->

                    <!-- List Item -->
                    <li class="relative group w-full flex gap-x-5 text-start  p-5">
                      <div class="relative shrink-0">
                        <span class="flex shrink-0 justify-center items-center size-9.5 bg-white border border-gray-200 text-gray-500 text-sm font-semibold rounded-full shadow-2xs dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400">
                          P
                        </span>
                      </div>
                      <div class="grow">
                        <p class="text-xs text-gray-500 dark:text-neutral-500">
                          5 Jan 2023
                        </p>

                        <span class="block text-sm font-medium text-gray-800 dark:text-neutral-300">
                          New Update&nbsp;on Preline
                        </span>
                        <p class="text-sm text-gray-500 dark:text-neutral-500">
                          Add yourself to our new “Hire Page”. Let visitors know you’re open to freelance or full-time work.
                        </p>
                        <a class="mt-2 p-1.5 inline-flex items-center border border-gray-200 rounded-xl hover:bg-gray-50 hover:shadow-2xs focus:outline-hidden focus:bg-gray-100 dark:border-neutral-700 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800" href="#">
                          <img class="w-17.5 h-15.5 object-cover rounded-lg" src="https://images.unsplash.com/photo-1670272505340-d906d8d77d03?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80" alt="Avatar">
                          <div class="grow py-2.5 px-4">
                            <p class="text-sm font-medium text-gray-800 dark:text-neutral-300">
                              Get hired!
                            </p>
                            <p class="inline-flex items-center gap-x-1 text-sm text-gray-500 dark:text-neutral-500">
                              Get started
                              <svg class="shrink-0 size-4 transition ease-in-out group-hover:translate-x-1 group-focus:translate-x-1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="m9 18 6-6-6-6" />
                              </svg>
                            </p>
                          </div>
                        </a>
                      </div>

                      <div>
                        <div class="sm:group-hover:opacity-100 sm:opacity-0 sm:absolute sm:top-5 sm:end-5">
                          <!-- Segment Button Group -->
                          <div class="inline-block p-0.5 bg-white border border-gray-200 rounded-lg shadow-2xs transition ease-out dark:bg-neutral-800 dark:border-neutral-700">
                            <div class="flex items-center">
                              <div class="hs-tooltip relative inline-block">
                                <button type="button" class="hs-tooltip-toggle size-7 flex shrink-0 justify-center items-center text-gray-500 hover:bg-gray-100 hover:text-gray-800 rounded-sm disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100 dark:hover:bg-neutral-700 dark:text-neutral-400 dark:focus:bg-neutral-700">
                                  <svg class="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <polyline points="9 11 12 14 22 4" />
                                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                                  </svg>
                                  <svg class="shrink-0 size-4 hidden" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <rect width="18" height="18" x="3" y="3" rx="2" />
                                    <path d="M8 12h8" />
                                  </svg>
                                </button>
                                <span class="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 inline-block absolute invisible z-20 py-1.5 px-2.5 bg-gray-900 text-xs text-white rounded-lg dark:bg-neutral-700" role="tooltip">
                                  Mark this notification as read
                                </span>
                              </div>
                              <div class="hs-tooltip relative inline-block">
                                <button type="button" class="hs-tooltip-toggle size-7 flex shrink-0 justify-center items-center text-gray-500 hover:bg-gray-100 hover:text-gray-800 rounded-sm disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100 dark:hover:bg-neutral-700 dark:text-neutral-400 dark:focus:bg-neutral-700">
                                  <svg class="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <rect width="20" height="5" x="2" y="4" rx="2" />
                                    <path d="M4 9v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9" />
                                    <path d="M10 13h4" />
                                  </svg>
                                </button>
                                <span class="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 inline-block absolute invisible z-20 py-1.5 px-2.5 bg-gray-900 text-xs text-white rounded-lg dark:bg-neutral-700" role="tooltip">
                                  Archive this notification
                                </span>
                              </div>
                            </div>
                          </div>
                          <!-- End Segment Button Group -->
                        </div>
                      </div>
                    </li>
                    <!-- End List Item -->

                    <!-- List Item -->
                    <li class="relative group w-full flex gap-x-5 text-start  p-5">
                      <div class="relative shrink-0">
                        <span class="flex shrink-0 justify-center items-center size-9.5 bg-white border border-gray-200 text-gray-500 text-sm font-semibold rounded-full shadow-2xs dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400">
                          P
                        </span>
                      </div>
                      <div class="grow">
                        <p class="text-xs text-gray-500 dark:text-neutral-500">
                          5 Jan 2023
                        </p>

                        <span class="block text-sm font-medium text-gray-800 dark:text-neutral-300">
                          We’re updating our Privacy Policy as of 10th January 2023.content
                        </span>
                        <p>
                          <a class="inline-flex items-center gap-x-1 text-sm text-blue-600 decoration-2 hover:underline font-medium focus:outline-hidden focus:underline dark:text-blue-400 dark:hover:text-blue-500" href="#">
                            Learn more
                            <svg class="shrink-0 size-4 transition ease-in-out group-hover:translate-x-1 group-focus:translate-x-1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                              <path d="m9 18 6-6-6-6" />
                            </svg>
                          </a>
                        </p>
                      </div>

                      <div>
                        <div class="sm:group-hover:opacity-100 sm:opacity-0 sm:absolute sm:top-5 sm:end-5">
                          <!-- Segment Button Group -->
                          <div class="inline-block p-0.5 bg-white border border-gray-200 rounded-lg shadow-2xs transition ease-out dark:bg-neutral-800 dark:border-neutral-700">
                            <div class="flex items-center">
                              <div class="hs-tooltip relative inline-block">
                                <button type="button" class="hs-tooltip-toggle size-7 flex shrink-0 justify-center items-center text-gray-500 hover:bg-gray-100 hover:text-gray-800 rounded-sm disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100 dark:hover:bg-neutral-700 dark:text-neutral-400 dark:focus:bg-neutral-700">
                                  <svg class="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <polyline points="9 11 12 14 22 4" />
                                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                                  </svg>
                                  <svg class="shrink-0 size-4 hidden" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <rect width="18" height="18" x="3" y="3" rx="2" />
                                    <path d="M8 12h8" />
                                  </svg>
                                </button>
                                <span class="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 inline-block absolute invisible z-20 py-1.5 px-2.5 bg-gray-900 text-xs text-white rounded-lg dark:bg-neutral-700" role="tooltip">
                                  Mark this notification as read
                                </span>
                              </div>
                              <div class="hs-tooltip relative inline-block">
                                <button type="button" class="hs-tooltip-toggle size-7 flex shrink-0 justify-center items-center text-gray-500 hover:bg-gray-100 hover:text-gray-800 rounded-sm disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100 dark:hover:bg-neutral-700 dark:text-neutral-400 dark:focus:bg-neutral-700">
                                  <svg class="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <rect width="20" height="5" x="2" y="4" rx="2" />
                                    <path d="M4 9v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9" />
                                    <path d="M10 13h4" />
                                  </svg>
                                </button>
                                <span class="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 inline-block absolute invisible z-20 py-1.5 px-2.5 bg-gray-900 text-xs text-white rounded-lg dark:bg-neutral-700" role="tooltip">
                                  Archive this notification
                                </span>
                              </div>
                            </div>
                          </div>
                          <!-- End Segment Button Group -->
                        </div>
                      </div>
                    </li>
                    <!-- End List Item -->

                    <!-- List Item -->
                    <li class="relative group w-full flex gap-x-5 text-start bg-gray-100 dark:bg-neutral-800 p-5">
                      <div class="relative shrink-0">
                        <img class="shrink-0 size-9.5 rounded-full" src="https://images.unsplash.com/photo-1614880353165-e56fac2ea9a8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=3&w=320&h=320&q=80" alt="Avatar">
                        <span class="absolute top-4 -start-3 size-2 bg-blue-600 rounded-full dark:bg-blue-500"></span>
                      </div>
                      <div class="grow">
                        <p class="text-xs text-gray-500 dark:text-neutral-500">
                          31 Dec 2022
                        </p>

                        <span class="block text-sm font-medium text-gray-800 dark:text-neutral-300">
                          Rubia Walter
                        </span>
                        <p class="text-sm text-gray-500 dark:text-neutral-500">
                          Joined the Slack group HS Team
                        </p>
                      </div>

                      <div>
                        <div class="sm:group-hover:opacity-100 sm:opacity-0 sm:absolute sm:top-5 sm:end-5">
                          <!-- Segment Button Group -->
                          <div class="inline-block p-0.5 bg-white border border-gray-200 rounded-lg shadow-2xs transition ease-out dark:bg-neutral-800 dark:border-neutral-700">
                            <div class="flex items-center">
                              <div class="hs-tooltip relative inline-block">
                                <button type="button" class="hs-tooltip-toggle size-7 flex shrink-0 justify-center items-center text-gray-500 hover:bg-gray-100 hover:text-gray-800 rounded-sm disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100 dark:hover:bg-neutral-700 dark:text-neutral-400 dark:focus:bg-neutral-700">
                                  <svg class="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <polyline points="9 11 12 14 22 4" />
                                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                                  </svg>
                                  <svg class="shrink-0 size-4 hidden" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <rect width="18" height="18" x="3" y="3" rx="2" />
                                    <path d="M8 12h8" />
                                  </svg>
                                </button>
                                <span class="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 inline-block absolute invisible z-20 py-1.5 px-2.5 bg-gray-900 text-xs text-white rounded-lg dark:bg-neutral-700" role="tooltip">
                                  Mark this notification as read
                                </span>
                              </div>
                              <div class="hs-tooltip relative inline-block">
                                <button type="button" class="hs-tooltip-toggle size-7 flex shrink-0 justify-center items-center text-gray-500 hover:bg-gray-100 hover:text-gray-800 rounded-sm disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100 dark:hover:bg-neutral-700 dark:text-neutral-400 dark:focus:bg-neutral-700">
                                  <svg class="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <rect width="20" height="5" x="2" y="4" rx="2" />
                                    <path d="M4 9v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9" />
                                    <path d="M10 13h4" />
                                  </svg>
                                </button>
                                <span class="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 inline-block absolute invisible z-20 py-1.5 px-2.5 bg-gray-900 text-xs text-white rounded-lg dark:bg-neutral-700" role="tooltip">
                                  Archive this notification
                                </span>
                              </div>
                            </div>
                          </div>
                          <!-- End Segment Button Group -->
                        </div>
                      </div>
                    </li>
                    <!-- End List Item -->
                  </ul>
                  <!-- End List Group -->
                </div>

                <!-- Footer -->
                <div class="text-center border-t border-gray-200 dark:border-neutral-800">
                  <a class="p-4 flex justify-center items-center gap-x-2 text-sm text-gray-500 font-medium sm:rounded-b-lg hover:text-blue-600 focus:outline-hidden focus:text-blue-600 dark:text-neutral-400 dark:hover:text-neutral-300 dark:focus:text-neutral-300" href="../../docs/index.html">
                    <svg class="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M18 6 7 17l-5-5" />
                      <path d="m22 10-7.5 7.5L13 16" />
                    </svg>
                    Mark all as read
                  </a>
                </div>
                <!-- End Footer -->
              </div>
              <!-- End Tab Content -->

              <!-- Tab Content -->
              <div id="hs-pro-tabs-dnn-archived" class="hidden" role="tabpanel" aria-labelledby="hs-pro-tabs-dnn-item-archived">
                <!-- Empty State -->
                <div class="p-5 min-h-[533px] flex flex-col justify-center items-center text-center">
                  <svg class="w-48 mx-auto mb-4" width="178" height="90" viewBox="0 0 178 90" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="27" y="50.5" width="124" height="39" rx="7.5" fill="currentColor" class="fill-white dark:fill-neutral-800" />
                    <rect x="27" y="50.5" width="124" height="39" rx="7.5" stroke="currentColor" class="stroke-gray-50 dark:stroke-neutral-700/10" />
                    <rect x="34.5" y="58" width="24" height="24" rx="4" fill="currentColor" class="fill-gray-50 dark:fill-neutral-700/30" />
                    <rect x="66.5" y="61" width="60" height="6" rx="3" fill="currentColor" class="fill-gray-50 dark:fill-neutral-700/30" />
                    <rect x="66.5" y="73" width="77" height="6" rx="3" fill="currentColor" class="fill-gray-50 dark:fill-neutral-700/30" />
                    <rect x="19.5" y="28.5" width="139" height="39" rx="7.5" fill="currentColor" class="fill-white dark:fill-neutral-800" />
                    <rect x="19.5" y="28.5" width="139" height="39" rx="7.5" stroke="currentColor" class="stroke-gray-100 dark:stroke-neutral-700/30" />
                    <rect x="27" y="36" width="24" height="24" rx="4" fill="currentColor" class="fill-gray-100 dark:fill-neutral-700/70" />
                    <rect x="59" y="39" width="60" height="6" rx="3" fill="currentColor" class="fill-gray-100 dark:fill-neutral-700/70" />
                    <rect x="59" y="51" width="92" height="6" rx="3" fill="currentColor" class="fill-gray-100 dark:fill-neutral-700/70" />
                    <g filter="url(#filter15)">
                      <rect x="12" y="6" width="154" height="40" rx="8" fill="currentColor" class="fill-white dark:fill-neutral-800" shape-rendering="crispEdges" />
                      <rect x="12.5" y="6.5" width="153" height="39" rx="7.5" stroke="currentColor" class="stroke-gray-100 dark:stroke-neutral-700/60" shape-rendering="crispEdges" />
                      <rect x="20" y="14" width="24" height="24" rx="4" fill="currentColor" class="fill-gray-200 dark:fill-neutral-700 " />
                      <rect x="52" y="17" width="60" height="6" rx="3" fill="currentColor" class="fill-gray-200 dark:fill-neutral-700" />
                      <rect x="52" y="29" width="106" height="6" rx="3" fill="currentColor" class="fill-gray-200 dark:fill-neutral-700" />
                    </g>
                    <defs>
                      <filter id="filter15" x="0" y="0" width="178" height="64" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                        <feFlood flood-opacity="0" result="BackgroundImageFix" />
                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                        <feOffset dy="6" />
                        <feGaussianBlur stdDeviation="6" />
                        <feComposite in2="hardAlpha" operator="out" />
                        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.03 0" />
                        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1187_14810" />
                        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1187_14810" result="shape" />
                      </filter>
                    </defs>
                  </svg>

                  <div class="max-w-sm mx-auto">
                    <p class="mt-2 font-medium text-gray-800 dark:text-neutral-200">
                      No archived notifications
                    </p>
                    <p class="mb-5 text-sm text-gray-500 dark:text-neutral-500">
                      No data here yet. We will notify you when there's an update.
                    </p>
                  </div>

                  <a class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-50 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700" href="#">
                    Notifications settings
                  </a>
                </div>
                <!-- End Empty State -->
              </div>
              <!-- End Tab Content -->
            </div>
          </div>
          <!-- End Notifications Dropdown -->

          <!-- Activity Button Icon -->
          <div class="hs-tooltip [--placement:bottom] inline-block">
            <button type="button" class="hs-tooltip-toggle size-9.5 inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700" data-hs-overlay="#hs-pro-dnam">
              <svg class="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </button>
            <span class="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 inline-block absolute invisible z-20 py-1.5 px-2.5 bg-gray-900 text-xs text-white rounded-lg dark:bg-neutral-700" role="tooltip">
              Activity
            </span>
          </div>
          <!-- End Activity Button Icon -->
        </div>

        <!-- Invite Users -->
        <div class="hs-dropdown [--auto-close:inside] [--placement:bottom-right] relative inline-flex">
          <button id="hs-pro-dnshd" type="button" class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 focus:outline-hidden focus:bg-gray-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700" aria-haspopup="menu" aria-expanded="false" aria-label="Dropdown">
            Share
          </button>

          <!-- Invite Users Dropdown -->
          <div class="hs-dropdown-menu hs-dropdown-open:opacity-100 w-full sm:w-120 transition-[opacity,margin] duration opacity-0 hidden z-10 bg-white border-t border-gray-200 sm:border-t-0 sm:rounded-lg shadow-md sm:shadow-xl dark:bg-neutral-900 dark:border-neutral-700" role="menu" aria-orientation="vertical" aria-labelledby="hs-pro-dnshd">
            <!-- Header -->
            <div class="p-4 border-b border-gray-200 dark:border-neutral-700">
              <span class="block text-[13px] font-medium text-gray-800 mb-2 dark:text-neutral-300">
                Invite
              </span>

              <!-- Input Form -->
              <div class="flex items-center gap-x-2">
                <div class="relative w-full">
                  <input type="text" class="py-1.5 sm:py-2 px-3 pe-24 block w-full border-gray-200 rounded-lg sm:text-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder:text-neutral-500 dark:focus:ring-neutral-600" placeholder="Add name or emails">
                  <div class="absolute inset-y-0 end-0 flex items-center z-20 pe-[5px] text-gray-400">
                    <!-- Select -->
                    <div class="relative inline-block">
                      <select id="hs-pro-select-mini-dropdown" data-hs-select='{
                          "placeholder": "Select option...",
                          "toggleTag": "<button type=\\"button\\" aria-expanded=\\"false\\"></button>",
                          "toggleClasses": "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative py-1.5 ps-2.5 pe-6 inline-flex shrink-0 justify-center items-center gap-x-1.5 text-xs text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 before:absolute before:inset-0 before:z-1 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700",

                          "dropdownClasses": "end-0 mt-2 z-50 w-28 p-1 space-y-0.5 bg-white rounded-xl shadow-xl dark:bg-neutral-950",
                          "optionClasses": "hs-selected:bg-gray-100 dark:hs-selected:bg-neutral-800 py-1.5 px-2 w-full text-xs text-gray-800 rounded-lg cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-hidden focus:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800",
                          "optionTemplate": "<div class=\\"flex justify-between items-center w-full\\"><span data-title></span><span class=\\"hidden hs-selected:block\\"><svg class=\\"shrink-0 size-3.5 text-gray-800 dark:text-neutral-200\\" xmlns=\\"http:.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"><polyline points=\\"20 6 9 17 4 12\\"/></svg></span></div>"
                        }' class="hidden">
                        <option value="">Choose</option>
                        <option selected>Can view</option>
                        <option>Can edit</option>
                        <option>Admin</option>
                      </select>

                      <div class="absolute top-1/2 end-1.5 -translate-y-1/2">
                        <svg class="shrink-0 size-3.5 text-gray-600 dark:text-neutral-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="m6 9 6 6 6-6" />
                        </svg>
                      </div>
                    </div>
                    <!-- End Select -->
                  </div>
                </div>

                <button type="button" class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:ring-2 focus:ring-blue-500">
                  Send
                </button>
              </div>
              <!-- End Input Form -->

              <div class="flex mt-2">
                <input type="checkbox" class="shrink-0 size-3.5 border-gray-300 rounded-sm text-blue-600 focus:ring-blue-500 checked:border-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-600 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800" id="hs-pro-dnshdch" checked>
                <label for="hs-pro-dnshdch" class="text-xs text-gray-600 ms-1.5 dark:text-neutral-400">
                  Notify recipients via email
                </label>
              </div>
            </div>
            <!-- End Header -->

            <!-- Body -->
            <div id="hs-dropdown-share-body" class="p-4 space-y-4 h-82 overflow-y-auto overflow-hidden [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
              <span class="block text-[13px] font-medium text-gray-800 dark:text-neutral-300">
                From Htmlstream
              </span>

              <!-- User -->
              <div class="w-full flex items-center gap-x-3">
                <img class="shrink-0 size-9.5 rounded-full" src="https://images.unsplash.com/photo-1659482633369-9fe69af50bfb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=3&w=320&h=320&q=80" alt="Avatar">
                <div class="grow">
                  <span class="block text-sm font-medium text-gray-800 dark:text-neutral-300">
                    James Collison <span class="text-xs font-normal text-gray-500 dark:text-neutral-500">(you)</span>
                  </span>
                  <span class="block text-[13px] text-gray-500 dark:text-neutral-500">
                    james@site.com
                  </span>
                </div>

                <!-- Select -->
                <div class="relative">
                  <select data-hs-select='{
                      "placeholder": "Select option...",
                      "toggleTag": "<button type=\\"button\\" aria-expanded=\\"false\\"></button>",
                      "toggleClasses": "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative py-1.5 ps-2.5 pe-6 inline-flex shrink-0 justify-center items-center gap-x-1.5 text-xs text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 before:absolute before:inset-0 before:z-1 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700",
                      "dropdownClasses": "end-0 mt-2 z-50 w-28 p-1 space-y-0.5 bg-white rounded-xl shadow-xl dark:bg-neutral-950",
                      "optionClasses": "hs-selected:bg-gray-100 dark:hs-selected:bg-neutral-800 py-1.5 px-2 w-full text-xs text-gray-800 rounded-lg cursor-pointer hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800",
                      "optionTemplate": "<div class=\\"flex justify-between items-center w-full\\"><span data-title></span><span class=\\"hidden hs-selected:block\\"><svg class=\\"shrink-0 size-3.5 text-gray-800 dark:text-neutral-200\\" xmlns=\\"http:.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"><polyline points=\\"20 6 9 17 4 12\\"/></svg></span></div>",
                      "viewport": "#hs-dropdown-share-body"
                    }' class="hidden">
                    <option value="">Choose</option>
                    <option>Can view</option>
                    <option>Can edit</option>
                    <option selected>Admin</option>
                    <option>Remove</option>
                  </select>

                  <div class="absolute top-1/2 end-1.5 -translate-y-1/2">
                    <svg class="shrink-0 size-3.5 text-gray-600 dark:text-neutral-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </div>
                </div>
                <!-- End Select -->
              </div>
              <!-- End User -->

              <!-- User -->
              <div class="w-full flex items-center gap-x-3">
                <span class="flex shrink-0 justify-center items-center size-9.5 bg-white border border-gray-200 text-gray-500 text-sm font-semibold rounded-full shadow-2xs dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-500">
                  L
                </span>
                <div class="grow">
                  <span class="block text-sm font-medium text-gray-800 dark:text-neutral-300">
                    Liza Harrison
                  </span>
                  <span class="block text-[13px] text-gray-500 dark:text-neutral-500">
                    liza@site.com
                  </span>
                </div>

                <!-- Select -->
                <div class="relative">
                  <select data-hs-select='{
                      "placeholder": "Select option...",
                      "toggleTag": "<button type=\\"button\\" aria-expanded=\\"false\\"></button>",
                      "toggleClasses": "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative py-1.5 ps-2.5 pe-6 inline-flex shrink-0 justify-center items-center gap-x-1.5 text-xs text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 before:absolute before:inset-0 before:z-1 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700",
                      "dropdownClasses": "end-0 mt-2 z-50 w-28 p-1 space-y-0.5 bg-white rounded-xl shadow-xl dark:bg-neutral-950",
                      "optionClasses": "hs-selected:bg-gray-100 dark:hs-selected:bg-neutral-800 py-1.5 px-2 w-full text-xs text-gray-800 rounded-lg cursor-pointer hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800",
                      "optionTemplate": "<div class=\\"flex justify-between items-center w-full\\"><span data-title></span><span class=\\"hidden hs-selected:block\\"><svg class=\\"shrink-0 size-3.5 text-gray-800 dark:text-neutral-200\\" xmlns=\\"http:.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"><polyline points=\\"20 6 9 17 4 12\\"/></svg></span></div>",
                      "viewport": "#hs-dropdown-share-body"
                    }' class="hidden">
                    <option value="">Choose</option>
                    <option selected>Can view</option>
                    <option>Can edit</option>
                    <option>Admin</option>
                    <option>Remove</option>
                  </select>

                  <div class="absolute top-1/2 end-1.5 -translate-y-1/2">
                    <svg class="shrink-0 size-3.5 text-gray-600 dark:text-neutral-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </div>
                </div>
                <!-- End Select -->
              </div>
              <!-- End User -->

              <!-- User -->
              <div class="w-full flex items-center gap-x-3">
                <img class="shrink-0 size-9.5 rounded-full" src="https://images.unsplash.com/photo-1601935111741-ae98b2b230b0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=3&w=320&h=320&q=80" alt="Avatar">
                <div class="grow">
                  <span class="block text-sm font-medium text-gray-800 dark:text-neutral-300">
                    Daniel Hobbs
                  </span>
                  <span class="block text-[13px] text-gray-500 dark:text-neutral-500">
                    dhobbs@site.com
                  </span>
                </div>

                <!-- Select -->
                <div class="relative">
                  <select data-hs-select='{
                      "placeholder": "Select option...",
                      "toggleTag": "<button type=\\"button\\" aria-expanded=\\"false\\"></button>",
                      "toggleClasses": "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative py-1.5 ps-2.5 pe-6 inline-flex shrink-0 justify-center items-center gap-x-1.5 text-xs text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 before:absolute before:inset-0 before:z-1 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700",
                      "dropdownClasses": "end-0 mt-2 z-50 w-28 p-1 space-y-0.5 bg-white rounded-xl shadow-xl dark:bg-neutral-950",
                      "optionClasses": "hs-selected:bg-gray-100 dark:hs-selected:bg-neutral-800 py-1.5 px-2 w-full text-xs text-gray-800 rounded-lg cursor-pointer hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800",
                      "optionTemplate": "<div class=\\"flex justify-between items-center w-full\\"><span data-title></span><span class=\\"hidden hs-selected:block\\"><svg class=\\"shrink-0 size-3.5 text-gray-800 dark:text-neutral-200\\" xmlns=\\"http:.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"><polyline points=\\"20 6 9 17 4 12\\"/></svg></span></div>",
                      "viewport": "#hs-dropdown-share-body"
                    }' class="hidden">
                    <option value="">Choose</option>
                    <option>Can view</option>
                    <option selected>Can edit</option>
                    <option>Admin</option>
                    <option>Remove</option>
                  </select>

                  <div class="absolute top-1/2 end-1.5 -translate-y-1/2">
                    <svg class="shrink-0 size-3.5 text-gray-600 dark:text-neutral-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </div>
                </div>
                <!-- End Select -->
              </div>
              <!-- End User -->

              <!-- Show More Button -->
              <button type="button" class="hs-collapse-toggle hs-collapse-open:hidden w-full text-start flex items-center gap-x-3 rounded-lg hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700" id="hs-pro-dshdc-item-button" aria-expanded="false" aria-controls="hs-pro-dshdc-button" data-hs-collapse="#hs-pro-dshdc-button">
                <span class="flex shrink-0 justify-center items-center size-9.5 text-sm font-semibold text-gray-500 rounded-lg dark:text-neutral-500">
                  <svg class="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                  </svg>
                </span>

                <span class="grow">
                  <span class="text-xs text-gray-500 dark:text-neutral-500">
                    2 more people
                  </span>
                </span>
              </button>
              <!-- End Show More Button -->

              <!-- Show More Collapse -->
              <div id="hs-pro-dshdc-button" class="hs-collapse hidden w-full transition-none space-y-4" aria-labelledby="hs-pro-dshdc-item-button">
                <!-- User -->
                <div class="w-full flex items-center gap-x-3">
                  <span class="flex shrink-0 justify-center items-center size-9.5 bg-white border border-gray-200 text-gray-500 text-sm font-semibold rounded-full shadow-2xs dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-500">
                    O
                  </span>
                  <div class="grow">
                    <span class="block text-sm font-medium text-gray-800 dark:text-neutral-300">
                      Ols Shols
                    </span>
                    <span class="block text-[13px] text-gray-500 dark:text-neutral-500">
                      ols@site.com
                    </span>
                  </div>

                  <!-- Select -->
                  <div class="relative">
                    <select data-hs-select='{
                        "placeholder": "Select option...",
                        "toggleTag": "<button type=\\"button\\" aria-expanded=\\"false\\"></button>",
                        "toggleClasses": "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative py-1.5 ps-2.5 pe-6 inline-flex shrink-0 justify-center items-center gap-x-1.5 text-xs text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 before:absolute before:inset-0 before:z-1 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700",
                        "dropdownClasses": "end-0 mt-2 z-50 w-28 p-1 space-y-0.5 bg-white rounded-xl shadow-xl dark:bg-neutral-950",
                        "optionClasses": "hs-selected:bg-gray-100 dark:hs-selected:bg-neutral-800 py-1.5 px-2 w-full text-xs text-gray-800 rounded-lg cursor-pointer hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800",
                        "optionTemplate": "<div class=\\"flex justify-between items-center w-full\\"><span data-title></span><span class=\\"hidden hs-selected:block\\"><svg class=\\"shrink-0 size-3.5 text-gray-800 dark:text-neutral-200\\" xmlns=\\"http:.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"><polyline points=\\"20 6 9 17 4 12\\"/></svg></span></div>",
                      "viewport": "#hs-dropdown-share-body"
                      }' class="hidden">
                      <option value="">Choose</option>
                      <option>Can view</option>
                      <option selected>Can edit</option>
                      <option>Admin</option>
                      <option>Remove</option>
                    </select>

                    <div class="absolute top-1/2 end-1.5 -translate-y-1/2">
                      <svg class="shrink-0 size-2.5 text-gray-600 dark:text-neutral-400" width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z" />
                      </svg>
                    </div>
                  </div>
                  <!-- End Select -->
                </div>
                <!-- End User -->

                <!-- User -->
                <div class="w-full flex items-center gap-x-3">
                  <img class="shrink-0 size-9.5 rounded-full" src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=3&w=320&h=320&q=80" alt="Avatar">
                  <div class="grow">
                    <span class="block text-sm font-medium text-gray-800 dark:text-neutral-300">
                      Crane
                    </span>
                    <span class="block text-[13px] text-gray-500 dark:text-neutral-500">
                      crane@site.com
                    </span>
                  </div>

                  <!-- Select -->
                  <div class="relative">
                    <select data-hs-select='{
                        "placeholder": "Select option...",
                        "toggleTag": "<button type=\\"button\\" aria-expanded=\\"false\\"></button>",
                        "toggleClasses": "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative py-1.5 ps-2.5 pe-6 inline-flex shrink-0 justify-center items-center gap-x-1.5 text-xs text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 before:absolute before:inset-0 before:z-1 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700",
                        "dropdownClasses": "end-0 mt-2 z-50 w-28 p-1 space-y-0.5 bg-white rounded-xl shadow-xl dark:bg-neutral-950",
                        "optionClasses": "hs-selected:bg-gray-100 dark:hs-selected:bg-neutral-800 py-1.5 px-2 w-full text-xs text-gray-800 rounded-lg cursor-pointer hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800",
                        "optionTemplate": "<div class=\\"flex justify-between items-center w-full\\"><span data-title></span><span class=\\"hidden hs-selected:block\\"><svg class=\\"shrink-0 size-3.5 text-gray-800 dark:text-neutral-200\\" xmlns=\\"http:.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"><polyline points=\\"20 6 9 17 4 12\\"/></svg></span></div>",
                      "viewport": "#hs-dropdown-share-body"
                      }' class="hidden">
                      <option value="">Choose</option>
                      <option selected>Can view</option>
                      <option>Can edit</option>
                      <option>Admin</option>
                      <option>Remove</option>
                    </select>

                    <div class="absolute top-1/2 end-1.5 -translate-y-1/2">
                      <svg class="shrink-0 size-2.5 text-gray-600 dark:text-neutral-400" width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z" />
                      </svg>
                    </div>
                  </div>
                  <!-- End Select -->
                </div>
                <!-- End User -->
              </div>
              <!-- End Show More Collapse -->

              <!-- User -->
              <div class="w-full flex items-center gap-x-3">
                <img class="shrink-0 size-9.5 rounded-full" src="https://images.unsplash.com/photo-1670272505340-d906d8d77d03?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=3&w=320&h=320&q=80" alt="Avatar">
                <div class="grow">
                  <span class="block text-sm font-medium text-gray-800 dark:text-neutral-300">
                    Anna Richard
                  </span>
                  <span class="block text-[13px] text-gray-500 dark:text-neutral-500">
                    anna@site.com
                  </span>
                </div>

                <!-- Select -->
                <div class="relative">
                  <select data-hs-select='{
                      "placeholder": "Select option...",
                      "toggleTag": "<button type=\\"button\\" aria-expanded=\\"false\\"></button>",
                      "toggleClasses": "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative py-1.5 ps-2.5 pe-6 inline-flex shrink-0 justify-center items-center gap-x-1.5 text-xs text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 before:absolute before:inset-0 before:z-1 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700",
                      "dropdownClasses": "end-0 mt-2 z-50 w-28 p-1 space-y-0.5 bg-white rounded-xl shadow-xl dark:bg-neutral-950",
                      "optionClasses": "hs-selected:bg-gray-100 dark:hs-selected:bg-neutral-800 py-1.5 px-2 w-full text-xs text-gray-800 rounded-lg cursor-pointer hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800",
                      "optionTemplate": "<div class=\\"flex justify-between items-center w-full\\"><span data-title></span><span class=\\"hidden hs-selected:block\\"><svg class=\\"shrink-0 size-3.5 text-gray-800 dark:text-neutral-200\\" xmlns=\\"http:.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"currentColor\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"><polyline points=\\"20 6 9 17 4 12\\"/></svg></span></div>",
                      "viewport": "#hs-dropdown-share-body"
                    }' class="hidden">
                    <option value="">Choose</option>
                    <option>Can view</option>
                    <option selected>Can edit</option>
                    <option>Admin</option>
                    <option>Remove</option>
                  </select>

                  <div class="absolute top-1/2 end-1.5 -translate-y-1/2">
                    <svg class="shrink-0 size-3.5 text-gray-600 dark:text-neutral-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </div>
                </div>
                <!-- End Select -->
              </div>
              <!-- End User -->
            </div>
            <!-- End Body -->

            <!-- Subfooter -->
            <div class="p-4 border-t border-gray-200 dark:border-neutral-800">
              <span class="block text-[13px] font-medium text-gray-800 mb-2 dark:text-neutral-300">
                Share read-only link
              </span>

              <!-- Input Form -->
              <div class="flex items-center gap-x-2">
                <input id="hs-pro-share-input-dropdown" type="text" class="py-1.5 sm:py-2 px-3 block w-full border-gray-200 rounded-lg sm:text-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder:text-neutral-500 dark:focus:ring-neutral-600" readonly value="https://www.figma.com/community/file/1179068859697769656">

                <button type="button" class="js-clipboard [--is-toggle-tooltip:false] hs-tooltip size-9.5 shrink-0 inline-flex justify-center items-center gap-x-2 rounded-lg border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-200 dark:bg-neutral-700 dark:hover:bg-neutral-600 dark:text-neutral-200 dark:focus:bg-neutral-600" data-clipboard-target="#hs-pro-share-input-dropdown" data-clipboard-action="copy" data-clipboard-success-text="Copied">
                  <svg class="js-clipboard-default shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                  </svg>
                  <svg class="js-clipboard-success hidden size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span class="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 transition-opacity hidden invisible z-10 py-1 px-2 bg-gray-900 text-xs font-medium text-white rounded-lg shadow-2xs dark:bg-neutral-700" role="tooltip">
                    <span class="js-clipboard-success-text">Copy</span>
                  </span>
                </button>
              </div>
              <!-- End Input Form -->
            </div>
            <!-- End Subfooter -->

            <!-- Footer -->
            <div class="p-4 border-t border-gray-200 dark:border-neutral-700">
              <a class="inline-flex items-center gap-x-1.5 text-xs text-gray-500 hover:underline font-medium focus:outline-hidden focus:underline dark:text-blue-500 dark:hover:text-blue-400" href="#">
                <svg class="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4" />
                  <path d="M12 8h.01" />
                </svg>
                Read more about share
              </a>
            </div>
            <!-- End Footer -->
          </div>
          <!-- End Invite Users Dropdown -->
        </div>
        <!-- End Invite Users -->

        <div class="border-e border-gray-200 w-px h-6 mx-1.5 dark:border-neutral-700"></div>

        <div class="h-9.5">
          <!-- Account Dropdown -->
          <div class="hs-dropdown inline-flex   [--strategy:absolute] [--auto-close:inside] [--placement:bottom-right] relative text-start">
            <button id="hs-dnad" type="button" class="inline-flex shrink-0 items-center gap-x-3 text-start rounded-full focus:outline-hidden" aria-haspopup="menu" aria-expanded="false" aria-label="Dropdown">
              <img class="shrink-0 size-9.5 rounded-full" src="https://images.unsplash.com/photo-1659482633369-9fe69af50bfb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=3&w=320&h=320&q=80" alt="Avatar">
            </button>

            <!-- Account Dropdown -->
            <div class="hs-dropdown-menu hs-dropdown-open:opacity-100 w-60 transition-[opacity,margin] duration opacity-0 hidden z-20 bg-white rounded-xl shadow-xl dark:bg-neutral-900" role="menu" aria-orientation="vertical" aria-labelledby="hs-dnad">
              <div class="p-1 border-b border-gray-200 dark:border-neutral-800">
                <a class="py-2 px-3 flex items-center gap-x-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800" href="../../pro/dashboard/user-profile-my-profile.html">
                  <img class="shrink-0 size-8 rounded-full" src="https://images.unsplash.com/photo-1659482633369-9fe69af50bfb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=3&w=320&h=320&q=80" alt="Avatar">

                  <div class="grow">
                    <span class="text-sm font-semibold text-gray-800 dark:text-neutral-300">
                      James Collison
                    </span>
                    <p class="text-xs text-gray-500 dark:text-neutral-500">
                      Preline@HS
                    </p>
                  </div>
                </a>
              </div>
              <div class="p-1">
                <a class="flex items-center gap-x-3 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800" href="#">
                  <svg class="shrink-0 mt-0.5 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect width="20" height="14" x="2" y="5" rx="2" />
                    <line x1="2" x2="22" y1="10" y2="10" />
                  </svg>
                  Billing
                </a>
                <a class="flex items-center gap-x-3 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800" href="#">
                  <svg class="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  Settings
                </a>
                <a class="flex items-center gap-x-3 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800" href="#">
                  <svg class="shrink-0 mt-0.5 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  My account
                </a>
              </div>
              <div class="px-4 py-3.5 border-y border-gray-200 dark:border-neutral-800">
                <!-- Switch/Toggle -->
                <div class="flex flex-wrap justify-between items-center gap-2">
                  <label for="hs-pro-dnaddm" class="flex-1 cursor-pointer text-sm text-gray-800 dark:text-neutral-300">Dark mode</label>
                  <label for="hs-pro-dnaddm" class="relative inline-block w-11 h-6 cursor-pointer">
                    <input data-hs-theme-switch type="checkbox" id="hs-pro-dnaddm" class="peer sr-only">
                    <span class="absolute inset-0 bg-gray-200 rounded-full transition-colors duration-200 ease-in-out peer-checked:bg-blue-600 dark:bg-neutral-700 dark:peer-checked:bg-blue-500 peer-disabled:opacity-50 peer-disabled:pointer-events-none"></span>
                    <span class="absolute top-1/2 start-0.5 -translate-y-1/2 size-5 bg-white rounded-full shadow-sm !transition-transform duration-200 ease-in-out peer-checked:translate-x-full dark:bg-neutral-400 dark:peer-checked:bg-white"></span>
                  </label>
                </div>
                <!-- End Switch/Toggle -->
              </div>
              <div class="p-1">
                <a class="flex items-center gap-x-3 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800" href="#">
                  Customization
                  <div class="ms-auto">
                    <span class="ms-auto inline-flex items-center gap-1.5 py-px px-1.5 rounded-sm text-[10px] leading-4 font-medium bg-gray-100 text-gray-800 dark:bg-neutral-700 dark:text-neutral-300">
                      New
                    </span>
                  </div>
                </a>
                <a class="flex items-center gap-x-3 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800" href="#">
                  Manage team
                </a>
                <a class="flex items-center gap-x-3 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800" href="#">
                  Sign out
                </a>
              </div>
              <div class="p-1 border-t border-gray-200 dark:border-neutral-800">
                <button type="button" class="flex mt-0.5 gap-x-3 py-2 px-3 w-full rounded-lg text-sm text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800" data-hs-overlay="#hs-pro-dasadam">
                  <svg class="shrink-0 size-4 mt-0.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M8 12h8" />
                    <path d="M12 8v8" />
                  </svg>
                  Add team account
                </button>
              </div>
            </div>
            <!-- End Account Dropdown -->
          </div>
          <!-- End Account Dropdown -->
        </div>
      </div>
    </div>
  </header>
  <!-- ========== END HEADER ========== -->

<!-- ========== MAIN SIDEBAR ========== -->
  <aside id="hs-pro-sidebar" class="hs-overlay [--auto-close:lg]
    hs-overlay-open:translate-x-0
    -translate-x-full transition-all duration-300 transform
    w-65 h-full
    hidden
    fixed inset-y-0 start-0 z-60
    bg-white border-e border-gray-200
    lg:block lg:translate-x-0 lg:end-auto lg:bottom-0
    dark:bg-neutral-800 dark:border-neutral-700" tabindex="-1" aria-label="Sidebar">
    <div class="relative flex flex-col h-full max-h-full pt-3">
      <header class="h-11.5 ps-5 pe-2 lg:ps-8 flex items-center gap-x-1">
        <!-- Logo -->
        <a class="flex-none rounded-md text-xl inline-block font-semibold focus:outline-hidden focus:opacity-80" href="/" aria-label="Fascinante Digital">
          <img class="w-28 h-auto dark:invert" src="/assets/logo-fascinante.svg" alt="Fascinante Digital Logo" />
        </a>
        <!-- End Logo -->

        <div class="lg:hidden ms-auto">
          <!-- Sidebar Close -->
          <button type="button" class="w-6 h-7 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-md border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 focus:outline-hidden focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700" data-hs-overlay="#hs-pro-sidebar">
            <svg class="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="7 8 3 12 7 16" />
              <line x1="21" x2="11" y1="12" y2="12" />
              <line x1="21" x2="11" y1="6" y2="6" />
              <line x1="21" x2="11" y1="18" y2="18" />
            </svg>
          </button>
          <!-- End Sidebar Close -->
        </div>
      </header>

      <!-- Content -->
      <div class="mt-1.5 h-full overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
        <!-- Nav -->
        <nav class="hs-accordion-group pb-3  w-full flex flex-col flex-wrap" data-hs-accordion-always-open>
          <ul class="flex flex-col gap-y-1">
            <!-- Link -->
            <li class="px-2 lg:px-5">
              <a class="flex gap-x-3 py-2 px-3 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:hover:bg-neutral-700 dark:text-neutral-300 dark:focus:bg-neutral-700 bg-gray-100 dark:bg-neutral-700 " href="../../pro/dashboard/index.html">
                <svg class="shrink-0 mt-0.5 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                Dashboard
              </a>
            </li>
            <!-- End Link -->

            <!-- Link -->
            <li class="hs-accordion px-2 lg:px-5  " id="users-accordion">
              <button type="button" class="hs-accordion-toggle hs-accordion-active:bg-gray-100 w-full text-start flex gap-x-3 py-2 px-3 text-sm text-gray-800 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:hs-accordion-active:bg-neutral-700 focus:outline-hidden focus:bg-gray-100 dark:hover:bg-neutral-700 dark:text-neutral-300 dark:focus:bg-neutral-700" aria-expanded="false" aria-controls="users-accordion-sub">
                <svg class="shrink-0 mt-0.5 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                Users

                <svg class="hs-accordion-active:-rotate-180 shrink-0 mt-1 size-3.5 ms-auto transition" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>

              <div id="users-accordion-sub" class="hs-accordion-content w-full overflow-hidden transition-[height] duration-300" role="region" aria-labelledby="users-accordion" style="display: none;">
                <ul class="hs-accordion-group ps-7 mt-1 flex flex-col gap-y-1 relative before:absolute before:top-0 before:start-4.5 before:w-0.5 before:h-full before:bg-gray-100 dark:before:bg-neutral-700" data-hs-accordion-always-open>
                  <li>
                    <a class="flex gap-x-4 py-2 px-3 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:hover:bg-neutral-700 dark:text-neutral-300 dark:focus:bg-neutral-700  " href="../../pro/dashboard/users.html">
                      Overview
                    </a>
                  </li>
                  <li>
                    <a class="flex gap-x-4 py-2 px-3 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:hover:bg-neutral-700 dark:text-neutral-300 dark:focus:bg-neutral-700  " href="../../pro/dashboard/users-add-user.html">
                      Add User
                    </a>
                  </li>
                </ul>
              </div>
            </li>
            <!-- End Link -->

            <!-- Link -->
            <li class="hs-accordion px-2 lg:px-5  " id="user-profile-accordion">
              <button type="button" class="hs-accordion-toggle hs-accordion-active:bg-gray-100 w-full text-start flex gap-x-3 py-2 px-3 text-sm text-gray-800 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:hs-accordion-active:bg-neutral-700 focus:outline-hidden focus:bg-gray-100 dark:hover:bg-neutral-700 dark:text-neutral-300 dark:focus:bg-neutral-700" aria-expanded="false" aria-controls="user-profile-accordion-sub">
                <svg class="shrink-0 mt-0.5 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="10" r="3" />
                  <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
                </svg>
                User Profile

                <svg class="hs-accordion-active:-rotate-180 shrink-0 mt-1 size-3.5 ms-auto transition" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>

              <div id="user-profile-accordion-sub" class="hs-accordion-content w-full overflow-hidden transition-[height] duration-300" role="region" aria-labelledby="user-profile-accordion" style="display: none;">
                <ul class="hs-accordion-group ps-7 mt-1 flex flex-col gap-y-1 relative before:absolute before:top-0 before:start-4.5 before:w-0.5 before:h-full before:bg-gray-100 dark:before:bg-neutral-700" data-hs-accordion-always-open>
                  <li>
                    <a class="flex gap-x-4 py-2 px-3 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:hover:bg-neutral-700 dark:text-neutral-300 dark:focus:bg-neutral-700  " href="../../pro/dashboard/user-profile-my-profile.html">
                      My Profile
                    </a>
                  </li>
                  <li>
                    <a class="flex gap-x-4 py-2 px-3 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:hover:bg-neutral-700 dark:text-neutral-300 dark:focus:bg-neutral-700  " href="../../pro/dashboard/user-profile-teams.html">
                      Teams: Grid
                    </a>
                  </li>
                  <li>
                    <a class="flex gap-x-4 py-2 px-3 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:hover:bg-neutral-700 dark:text-neutral-300 dark:focus:bg-neutral-700  " href="../../pro/dashboard/user-profile-teams-list.html">
                      Teams: Listing
                    </a>
                  </li>
                  <li>
                    <a class="flex gap-x-4 py-2 px-3 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:hover:bg-neutral-700 dark:text-neutral-300 dark:focus:bg-neutral-700  " href="../../pro/dashboard/user-profile-files.html">
                      Files: Grid
                    </a>
                  </li>
                  <li>
                    <a class="flex gap-x-4 py-2 px-3 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:hover:bg-neutral-700 dark:text-neutral-300 dark:focus:bg-neutral-700  " href="../../pro/dashboard/user-profile-files-list.html">
                      Files: Listing
                    </a>
                  </li>
                  <li>
                    <a class="flex gap-x-4 py-2 px-3 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:hover:bg-neutral-700 dark:text-neutral-300 dark:focus:bg-neutral-700  " href="../../pro/dashboard/user-profile-connections.html">
                      Connections: Grid
                    </a>
                  </li>
                  <li>
                    <a class="flex gap-x-4 py-2 px-3 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:hover:bg-neutral-700 dark:text-neutral-300 dark:focus:bg-neutral-700  " href="../../pro/dashboard/user-profile-connections-list.html">
                      Connections: Listing
                    </a>
                  </li>
                  <li>
                    <a class="flex gap-x-4 py-2 px-3 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:hover:bg-neutral-700 dark:text-neutral-300 dark:focus:bg-neutral-700  " href="../../pro/dashboard/user-profile.html">
                      Profile
                    </a>
                  </li>
                </ul>
              </div>
            </li>
            <!-- End Link -->

            <!-- Link -->
            <li class="hs-accordion px-2 lg:px-5  " id="account-accordion">
              <button type="button" class="hs-accordion-toggle hs-accordion-active:bg-gray-100 w-full text-start flex gap-x-3 py-2 px-3 text-sm text-gray-800 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:hs-accordion-active:bg-neutral-700 focus:outline-hidden focus:bg-gray-100 dark:hover:bg-neutral-700 dark:text-neutral-300 dark:focus:bg-neutral-700" aria-expanded="false" aria-controls="account-accordion-sub">
                <svg class="shrink-0 mt-0.5 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="18" cy="15" r="3" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M10 15H6a4 4 0 0 0-4 4v2" />
                  <path d="m21.7 16.4-.9-.3" />
                  <path d="m15.2 13.9-.9-.3" />
                  <path d="m16.6 18.7.3-.9" />
                  <path d="m19.1 12.2.3-.9" />
                  <path d="m19.6 18.7-.4-1" />
                  <path d="m16.8 12.3-.4-1" />
                  <path d="m14.3 16.6 1-.4" />
                  <path d="m20.7 13.8 1-.4" />
                </svg>
                Account

                <svg class="hs-accordion-active:-rotate-180 shrink-0 mt-1 size-3.5 ms-auto transition" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>

              <div id="account-accordion-sub" class="hs-accordion-content w-full overflow-hidden transition-[height] duration-300" role="region" aria-labelledby="account-accordion" style="display: none;">
                <ul class="hs-accordion-group ps-7 mt-1 flex flex-col gap-y-1 relative before:absolute before:top-0 before:start-4.5 before:w-0.5 before:h-full before:bg-gray-100 dark:before:bg-neutral-700" data-hs-accordion-always-open>
                  <li>
                    <a class="flex gap-x-4 py-2 px-3 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:hover:bg-neutral-700 dark:text-neutral-300 dark:focus:bg-neutral-700  " href="../../pro/dashboard/account-profile.html">
                      Profile
                    </a>
                  </li>
                  <li>
                    <a class="flex gap-x-4 py-2 px-3 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:hover:bg-neutral-700 dark:text-neutral-300 dark:focus:bg-neutral-700  " href="../../pro/dashboard/account-notifications.html">
                      Notifications
                    </a>
                  </li>
                  <li>
                    <a class="flex gap-x-4 py-2 px-3 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:hover:bg-neutral-700 dark:text-neutral-300 dark:focus:bg-neutral-700  " href="../../pro/dashboard/account-integrations.html">
                      Integrations
                    </a>
                  </li>
                  <li>
                    <a class="flex gap-x-4 py-2 px-3 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:hover:bg-neutral-700 dark:text-neutral-300 dark:focus:bg-neutral-700  " href="../../pro/dashboard/account-preferences.html">
                      Preferences
                    </a>
                  </li>
                  <li>
                    <a class="flex gap-x-4 py-2 px-3 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:hover:bg-neutral-700 dark:text-neutral-300 dark:focus:bg-neutral-700  " href="../../pro/dashboard/account-workspace.html">
                      Workspace
                    </a>
                  </li>
                  <li>
                    <a class="flex gap-x-4 py-2 px-3 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:hover:bg-neutral-700 dark:text-neutral-300 dark:focus:bg-neutral-700  " href="../../pro/dashboard/account-plan-and-billing.html">
                      Plan &amp; Billing
                    </a>
                  </li>
                  <li>
                    <a class="flex gap-x-4 py-2 px-3 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:hover:bg-neutral-700 dark:text-neutral-300 dark:focus:bg-neutral-700  " href="../../pro/dashboard/account-members.html">
                      Members
                    </a>
                  </li>
                </ul>
              </div>
            </li>
            <!-- End Link -->

            <!-- Link -->
            <li class="px-2 lg:px-5">
              <a class="flex gap-x-3 py-2 px-3 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:hover:bg-neutral-700 dark:text-neutral-300 dark:focus:bg-neutral-700  " href="../../pro/dashboard/welcome-page.html">
                <svg class="shrink-0 mt-0.5 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                Welcome Page
              </a>
            </li>
            <!-- End Link -->

            <!-- Link -->
            <li class="px-2 lg:px-5">
              <a class="flex gap-x-3 py-2 px-3 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:hover:bg-neutral-700 dark:text-neutral-300 dark:focus:bg-neutral-700 bg-gray-100 dark:bg-neutral-700 " href="/empty-states">
                <svg class="shrink-0 mt-0.5 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
                  <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                </svg>
                Empty Contents
              </a>
            </li>
            <!-- End Link -->

            <!-- Link -->
            <li class="px-2 lg:px-5">
              <a class="flex gap-x-3 py-2 px-3 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:hover:bg-neutral-700 dark:text-neutral-300 dark:focus:bg-neutral-700  " href="../../pro/dashboard/plans.html">
                <svg class="shrink-0 mt-0.5 size-4 text-blue-600 dark:text-blue-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="m16 12-4-4-4 4" />
                  <path d="M12 16V8" />
                </svg>
                <span class="bg-clip-text bg-linear-to-tr from-blue-600 to-purple-600 to-80% text-transparent dark:from-blue-500 dark:to-purple-500">
                  Plans
                </span>
              </a>
            </li>
            <!-- End Link -->

            <!-- Divider -->
            <li class="pt-5 px-5 lg:px-8 mt-5 border-t border-gray-200 first:border-transparent first:pt-0 dark:border-neutral-700 dark:first:border-transparent">
              <span class="block text-xs uppercase text-gray-500 dark:text-neutral-500">
                Apps
              </span>
            </li>
            <!-- End Divider -->

            <!-- Link -->
            <li class="px-2 lg:px-5">
              <a class="flex items-center gap-x-2 py-1.5 px-3 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100  dark:hover:bg-neutral-700 dark:text-neutral-300 dark:focus:bg-neutral-700" href="../../pro/dashboard/chat.html">
                <span class="flex justify-center items-center size-6 bg-blue-600 text-white rounded-md dark:bg-blue-500">
                  <svg class="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </span>
                Chat
              </a>
            </li>
            <!-- End Link -->

            <!-- Link -->
            <li class="px-2 lg:px-5">
              <a class="flex items-center gap-x-2 py-1.5 px-3 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100  dark:hover:bg-neutral-700 dark:text-neutral-300 dark:focus:bg-neutral-700" href="../../pro/dashboard/inbox.html">
                <span class="flex justify-center items-center size-6 bg-blue-600 text-white rounded-md dark:bg-blue-500">
                  <svg class="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
                    <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
                  </svg>
                </span>
                Inbox
              </a>
            </li>
            <!-- End Link -->

            <!-- Link -->
            <li class="px-2 lg:px-5">
              <a class="flex items-center gap-x-2 py-1.5 px-3 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100  dark:hover:bg-neutral-700 dark:text-neutral-300 dark:focus:bg-neutral-700" href="../../pro/dashboard/calendar-month.html">
                <span class="flex justify-center items-center size-6 bg-blue-600 text-white rounded-md dark:bg-blue-500">
                  <svg class="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M8 2v4" />
                    <path d="M16 2v4" />
                    <rect width="18" height="18" x="3" y="4" rx="2" />
                    <path d="M3 10h18" />
                  </svg>
                </span>
                Calendars
              </a>
            </li>
            <!-- End Link -->

            <!-- Link -->
            <li class="px-2 lg:px-5">
              <a class="flex items-center gap-x-2 py-1.5 px-3 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100  dark:hover:bg-neutral-700 dark:text-neutral-300 dark:focus:bg-neutral-700" href="../../pro/dashboard/kanban-board.html">
                <span class="flex justify-center items-center size-6 bg-blue-600 text-white rounded-md dark:bg-blue-500">
                  <svg class="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect width="18" height="18" x="3" y="3" rx="2" />
                    <path d="M8 7v7" />
                    <path d="M12 7v4" />
                    <path d="M16 7v9" />
                  </svg>
                </span>
                Kanban Board
              </a>
            </li>
            <!-- End Link -->

            <!-- Link -->
            <li class="px-2 lg:px-5">
              <a class="flex items-center gap-x-2 py-1.5 px-3 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100  dark:hover:bg-neutral-700 dark:text-neutral-300 dark:focus:bg-neutral-700" href="../../pro/dashboard/files.html">
                <span class="flex justify-center items-center size-6 bg-blue-600 text-white rounded-md dark:bg-blue-500">
                  <svg class="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2" />
                  </svg>
                </span>
                Files
              </a>
            </li>
            <!-- End Link -->

            <!-- Link -->
            <li class="px-2 lg:px-5">
              <a class="flex items-center gap-x-2 py-1.5 px-3 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100  dark:hover:bg-neutral-700 dark:text-neutral-300 dark:focus:bg-neutral-700" href="../../pro/dashboard/to-do.html">
                <span class="flex justify-center items-center size-6 bg-blue-600 text-white rounded-md dark:bg-blue-500">
                  <svg class="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M8 2v4" />
                    <path d="M16 2v4" />
                    <rect width="18" height="18" x="3" y="4" rx="2" />
                    <path d="M3 10h18" />
                    <path d="m9 16 2 2 4-4" />
                  </svg>
                </span>
                To Do
              </a>
            </li>
            <!-- End Link -->
          </ul>
        </nav>
        <!-- End Nav -->
      </div>
      <!-- End Content -->

      <footer class="hidden lg:block border-t border-gray-200 dark:border-neutral-700">
        <!-- Project Dropdown -->
        <div class="px-7 ">
          <div class="hs-dropdown [--auto-close:inside] relative flex">
            <!-- Project Button -->
            <button id="hs-pro-dnwpd" type="button" class="group w-full inline-flex items-center py-3 text-start text-gray-800 align-middle disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden dark:text-white" aria-haspopup="menu" aria-expanded="false" aria-label="Dropdown">
              <svg class=" size-8 shrink-0" width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.7438 0.940745C6.84695 1.30308 2.6841 1.63631 2.48837 1.67533C1.9396 1.77319 1.44038 2.14544 1.20563 2.63537L1 3.06646L1.01982 13.3407L1.04893 23.615L1.36234 24.2517C1.53886 24.6042 2.73365 26.2499 4.0362 27.9439C6.61221 31.2836 6.79802 31.47 7.77726 31.5679C8.06156 31.597 10.1966 31.4991 12.5081 31.3622C14.8295 31.2154 18.5508 30.99 20.7842 30.863C30.3233 30.2839 29.8334 30.3328 30.3815 29.8627C31.0672 29.2947 31.0183 30.2251 31.0474 17.7377C31.0672 7.15003 31.0573 6.45509 30.9006 6.13177C30.7148 5.76943 30.3815 5.51487 26.0329 2.45885C23.1243 0.421704 22.9186 0.313932 21.6155 0.294111C21.0772 0.274911 16.6307 0.568497 11.7438 0.940745ZM22.752 2.28232C23.1633 2.46814 26.1704 4.56412 26.6108 4.9661C26.7284 5.08378 26.7675 5.18164 26.7086 5.24048C26.5717 5.35817 7.96245 6.465 7.42421 6.38634C7.17956 6.34732 6.81722 6.20052 6.61159 6.06302C5.75932 5.48514 3.64413 3.75149 3.64413 3.62452C3.64413 3.29129 3.57538 3.29129 11.8714 2.69421C13.4582 2.58644 16.0633 2.39071 17.6502 2.26312C21.0871 1.98874 22.1159 1.99865 22.752 2.28232ZM28.6677 7.63996C28.8046 7.77685 28.9223 8.04132 28.9613 8.29589C28.9904 8.53125 29.0102 12.9189 28.9904 18.0313C28.9613 26.8067 28.9514 27.3555 28.7848 27.61C28.6869 27.7667 28.4912 27.9333 28.3438 27.9823C27.9331 28.1489 8.43318 29.2557 8.03183 29.138C7.84601 29.0891 7.59083 28.9324 7.45394 28.7955L7.21858 28.541L7.18947 19.0799C7.16965 12.4395 7.18947 9.5012 7.26813 9.23672C7.32697 9.041 7.47376 8.80564 7.60136 8.72759C7.77788 8.60991 8.93364 8.51205 12.9101 8.2773C15.7016 8.1206 20.0206 7.85613 22.4987 7.70933C28.3933 7.34638 28.3741 7.34638 28.6677 7.63996Z" class="fill-black dark:fill-neutral-200" fill="currentColor" />
                <path d="M23.4277 10.8818C22.3698 10.9506 21.4296 11.0484 21.3218 11.1073C20.9985 11.2739 20.8028 11.5483 20.7638 11.8617C20.7347 12.185 20.8325 12.224 21.8898 12.3516L22.35 12.4104V16.5925C22.35 19.0799 22.311 20.7256 22.2621 20.6767C22.2131 20.6178 20.8226 18.5027 19.167 15.9756C17.512 13.4392 16.1407 11.3525 16.1209 11.3333C16.1011 11.3135 15.024 11.3724 13.7313 11.4609C12.1445 11.5687 11.273 11.6666 11.0965 11.7644C10.8122 11.9112 10.4988 12.4303 10.4988 12.7734C10.4988 12.979 10.871 13.0868 11.6545 13.0868H12.0658V25.1139L11.4 25.3196C10.8809 25.4763 10.7044 25.5741 10.6165 25.7698C10.4598 26.1031 10.4697 26.4066 10.6264 26.4066C10.6852 26.4066 11.792 26.3378 13.0649 26.2598C15.582 26.113 15.8657 26.0442 16.1302 25.5252C16.2088 25.3685 16.277 25.2019 16.277 25.1529C16.277 25.1139 15.9345 24.9962 15.5226 24.8984C15.1014 24.8005 14.6802 24.7027 14.5923 24.6828C14.4257 24.6339 14.4157 24.3304 14.4157 20.1186V15.6033L17.3931 20.2753C20.5173 25.1721 20.9093 25.7308 21.3893 25.9755C21.987 26.2889 23.5051 26.0733 24.2688 25.5741L24.5042 25.4273L24.524 18.7479L24.5531 12.0586L25.0722 11.9608C25.6891 11.8431 25.9734 11.5594 25.9734 11.0695C25.9734 10.7561 25.9536 10.7362 25.66 10.7462C25.4847 10.7542 24.4757 10.813 23.4277 10.8818Z" class="fill-black dark:fill-neutral-200" fill="currentColor" />
              </svg>
              <span class="block ms-3">
                <span class="block text-sm font-medium text-gray-800 group-hover:text-blue-600 group-focus-hover:text-blue-600 dark:text-neutral-200 dark:group-hover:text-blue-600 dark:group-focus-hover:text-blue-600">
                  Notion
                </span>
                <span class="block text-xs text-gray-500 dark:text-neutral-500">
                  notion.so
                </span>
              </span>
              <svg class="shrink-0 size-3.5 ms-auto" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="m7 15 5 5 5-5" />
                <path d="m7 9 5-5 5 5" />
              </svg>
            </button>
            <!-- End Project Button -->

            <!-- Dropdown -->
            <div class="hs-dropdown-menu hs-dropdown-open:opacity-100 w-56 transition-[opacity,margin] duration opacity-0 hidden z-20 bg-white rounded-xl shadow-xl dark:bg-neutral-900" role="menu" aria-orientation="vertical" aria-labelledby="hs-pro-dnwpd">
              <div class="p-1 space-y-0.5">

                <!-- Item -->
                <a class="py-2 px-3 block w-full text-start bg-gray-100 rounded-lg disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100 dark:bg-neutral-800 dark:focus:bg-neutral-800" href="#">
                  <div class="flex gap-x-2">
                    <div class="self-center">
                      <svg class="shrink-0 size-5 text-gray-500 dark:text-neutral-500" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M7 2a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                      </svg>
                    </div>
                    <svg class="shrink-0 size-8" width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11.7438 0.940745C6.84695 1.30308 2.6841 1.63631 2.48837 1.67533C1.9396 1.77319 1.44038 2.14544 1.20563 2.63537L1 3.06646L1.01982 13.3407L1.04893 23.615L1.36234 24.2517C1.53886 24.6042 2.73365 26.2499 4.0362 27.9439C6.61221 31.2836 6.79802 31.47 7.77726 31.5679C8.06156 31.597 10.1966 31.4991 12.5081 31.3622C14.8295 31.2154 18.5508 30.99 20.7842 30.863C30.3233 30.2839 29.8334 30.3328 30.3815 29.8627C31.0672 29.2947 31.0183 30.2251 31.0474 17.7377C31.0672 7.15003 31.0573 6.45509 30.9006 6.13177C30.7148 5.76943 30.3815 5.51487 26.0329 2.45885C23.1243 0.421704 22.9186 0.313932 21.6155 0.294111C21.0772 0.274911 16.6307 0.568497 11.7438 0.940745ZM22.752 2.28232C23.1633 2.46814 26.1704 4.56412 26.6108 4.9661C26.7284 5.08378 26.7675 5.18164 26.7086 5.24048C26.5717 5.35817 7.96245 6.465 7.42421 6.38634C7.17956 6.34732 6.81722 6.20052 6.61159 6.06302C5.75932 5.48514 3.64413 3.75149 3.64413 3.62452C3.64413 3.29129 3.57538 3.29129 11.8714 2.69421C13.4582 2.58644 16.0633 2.39071 17.6502 2.26312C21.0871 1.98874 22.1159 1.99865 22.752 2.28232ZM28.6677 7.63996C28.8046 7.77685 28.9223 8.04132 28.9613 8.29589C28.9904 8.53125 29.0102 12.9189 28.9904 18.0313C28.9613 26.8067 28.9514 27.3555 28.7848 27.61C28.6869 27.7667 28.4912 27.9333 28.3438 27.9823C27.9331 28.1489 8.43318 29.2557 8.03183 29.138C7.84601 29.0891 7.59083 28.9324 7.45394 28.7955L7.21858 28.541L7.18947 19.0799C7.16965 12.4395 7.18947 9.5012 7.26813 9.23672C7.32697 9.041 7.47376 8.80564 7.60136 8.72759C7.77788 8.60991 8.93364 8.51205 12.9101 8.2773C15.7016 8.1206 20.0206 7.85613 22.4987 7.70933C28.3933 7.34638 28.3741 7.34638 28.6677 7.63996Z" class="fill-black dark:fill-neutral-200" fill="currentColor" />
                      <path d="M23.4277 10.8818C22.3698 10.9506 21.4296 11.0484 21.3218 11.1073C20.9985 11.2739 20.8028 11.5483 20.7638 11.8617C20.7347 12.185 20.8325 12.224 21.8898 12.3516L22.35 12.4104V16.5925C22.35 19.0799 22.311 20.7256 22.2621 20.6767C22.2131 20.6178 20.8226 18.5027 19.167 15.9756C17.512 13.4392 16.1407 11.3525 16.1209 11.3333C16.1011 11.3135 15.024 11.3724 13.7313 11.4609C12.1445 11.5687 11.273 11.6666 11.0965 11.7644C10.8122 11.9112 10.4988 12.4303 10.4988 12.7734C10.4988 12.979 10.871 13.0868 11.6545 13.0868H12.0658V25.1139L11.4 25.3196C10.8809 25.4763 10.7044 25.5741 10.6165 25.7698C10.4598 26.1031 10.4697 26.4066 10.6264 26.4066C10.6852 26.4066 11.792 26.3378 13.0649 26.2598C15.582 26.113 15.8657 26.0442 16.1302 25.5252C16.2088 25.3685 16.277 25.2019 16.277 25.1529C16.277 25.1139 15.9345 24.9962 15.5226 24.8984C15.1014 24.8005 14.6802 24.7027 14.5923 24.6828C14.4257 24.6339 14.4157 24.3304 14.4157 20.1186V15.6033L17.3931 20.2753C20.5173 25.1721 20.9093 25.7308 21.3893 25.9755C21.987 26.2889 23.5051 26.0733 24.2688 25.5741L24.5042 25.4273L24.524 18.7479L24.5531 12.0586L25.0722 11.9608C25.6891 11.8431 25.9734 11.5594 25.9734 11.0695C25.9734 10.7561 25.9536 10.7362 25.66 10.7462C25.4847 10.7542 24.4757 10.813 23.4277 10.8818Z" class="fill-black dark:fill-neutral-200" fill="currentColor" />
                    </svg>
                    <div class="grow">
                      <p class="text-sm font-medium text-gray-800 dark:text-neutral-200">
                        Notion
                      </p>
                      <p class="text-xs text-gray-500 dark:text-neutral-500">
                        notion.so
                      </p>
                    </div>
                    <div class="ms-auto self-center">
                      <svg class="shrink-0 size-4 text-gray-800 dark:text-neutral-200" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                  </div>
                </a>
                <!-- End Item -->

                <!-- Item -->
                <a class="py-2 px-3 block w-full text-start rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800" href="#">
                  <div class="flex gap-x-2">
                    <div class="self-center">
                      <svg class="shrink-0 size-5 text-gray-500 dark:text-neutral-500" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M7 2a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                      </svg>
                    </div>
                    <svg class="shrink-0 size-8" width="33" height="32" viewBox="0 0 33 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16.0001 0C7.16461 0 0 7.34466 0 16.405C0 23.6533 4.5845 29.8026 10.9419 31.9718C11.7415 32.1236 12.0351 31.6159 12.0351 31.1826C12.0351 30.7915 12.0202 29.4991 12.0134 28.1283C7.56202 29.1207 6.62276 26.1927 6.62276 26.1927C5.89494 24.2965 4.84626 23.7924 4.84626 23.7924C3.39464 22.7742 4.95568 22.795 4.95568 22.795C6.5624 22.9108 7.40843 24.4856 7.40843 24.4856C8.83545 26.9936 11.1514 26.2685 12.0645 25.8495C12.208 24.789 12.6227 24.0654 13.0803 23.6558C9.5265 23.2408 5.79054 21.8342 5.79054 15.5483C5.79054 13.7573 6.41559 12.2938 7.43917 11.1449C7.27303 10.7317 6.72541 9.0632 7.59415 6.80351C7.59415 6.80351 8.93772 6.36259 11.9953 8.48512C13.2715 8.12152 14.6403 7.93934 16.0001 7.93316C17.3598 7.93934 18.7296 8.12152 20.0083 8.48512C23.0623 6.36259 24.404 6.80351 24.404 6.80351C25.2748 9.0632 24.727 10.7317 24.5608 11.1449C25.5867 12.2938 26.2075 13.7572 26.2075 15.5483C26.2075 21.8491 22.4645 23.2366 18.9017 23.6426C19.4755 24.1518 19.9869 25.1502 19.9869 26.6806C19.9869 28.8756 19.9683 30.6422 19.9683 31.1826C19.9683 31.6192 20.2563 32.1307 21.0674 31.9696C27.4213 29.798 32 23.6509 32 16.405C32 7.34466 24.8364 0 16.0001 0Z" class="fill-black dark:fill-neutral-200" fill="currentColor" />
                      <path d="M5.99251 23.3693C5.95737 23.4508 5.83213 23.4752 5.71832 23.4194C5.60224 23.3658 5.53699 23.2547 5.57464 23.1728C5.60915 23.089 5.73438 23.0655 5.8502 23.1219C5.96653 23.1753 6.03279 23.2875 5.99251 23.3693ZM6.77955 24.0893C6.70326 24.1619 6.55405 24.1282 6.45279 24.0135C6.34813 23.8991 6.32856 23.7463 6.40598 23.6726C6.48466 23.6001 6.62935 23.634 6.73425 23.7485C6.83891 23.8641 6.85924 24.0161 6.77943 24.0894M7.31952 25.0105C7.22139 25.0804 7.06102 25.0149 6.96201 24.869C6.864 24.7232 6.864 24.5482 6.96414 24.4781C7.06353 24.408 7.22139 24.471 7.32178 24.6158C7.41965 24.7641 7.41965 24.9391 7.31939 25.0107M8.23255 26.0775C8.14484 26.1766 7.95811 26.1501 7.82133 26.0147C7.68154 25.8825 7.64252 25.6947 7.73048 25.5955C7.8192 25.4962 8.00705 25.5241 8.14484 25.6583C8.28375 25.7903 8.32604 25.9795 8.23255 26.0775ZM9.41262 26.4378C9.3741 26.5662 9.19415 26.6246 9.01295 26.57C8.832 26.5138 8.71354 26.3633 8.75006 26.2335C8.7877 26.1041 8.9684 26.0433 9.15098 26.1017C9.33168 26.1577 9.45027 26.307 9.41262 26.4378ZM10.7558 26.5905C10.7603 26.7258 10.6066 26.838 10.4164 26.8405C10.225 26.8447 10.0703 26.7352 10.0683 26.6022C10.0683 26.4656 10.2185 26.3544 10.4097 26.3512C10.6 26.3473 10.7558 26.456 10.7558 26.5905ZM12.0752 26.5386C12.098 26.6706 11.9658 26.8063 11.7769 26.8423C11.5912 26.877 11.4193 26.7956 11.3955 26.6647C11.3725 26.5294 11.5072 26.3939 11.6926 26.3588C11.8818 26.3251 12.0511 26.4044 12.0752 26.5386Z" class="fill-black dark:fill-neutral-200" fill="currentColor" />
                    </svg>
                    <div class="grow">
                      <p class="text-sm font-medium text-gray-800 dark:text-neutral-200">
                        Github
                      </p>
                      <p class="text-xs text-gray-500 dark:text-neutral-500">
                        github.com
                      </p>
                    </div>
                    <div class="ms-auto self-center">
                      <svg class="hidden shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                  </div>
                </a>
                <!-- End Item -->
              </div>

              <div class="p-1 border-t border-gray-200 dark:border-neutral-800">
                <button type="button" class="w-full flex items-center gap-x-3 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800">
                  <svg class="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M8 12h8" />
                    <path d="M12 8v8" />
                  </svg>
                  Add another project
                </button>
              </div>

              <div class="p-1 border-t border-gray-200 dark:border-neutral-800">
                <button type="button" class="w-full flex items-center gap-x-3 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 disabled:opacity-50 focus:outline-hidden focus:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800">
                  Sign out
                  <span class="ms-auto text-xs text-gray-500 dark:text-neutral-500">
                    preline@site.com
                  </span>
                </button>
              </div>
            </div>
            <!-- End Dropdown -->
          </div>
        </div>
        <!-- End Project Dropdown -->
      </footer>
    </div>
  </aside>
  <!-- ========== END MAIN SIDEBAR ========== -->

  <!-- ========== MAIN CONTENT ========== -->
  <main id="content" class="lg:ps-5 lg:pe-5 pt-15 pb-10 sm:pb-16">
    <!-- Breadcrumb -->
    <ol class="lg:hidden pt-3 md:pt-5 sm:pb-2 md:pb-0 px-2 sm:px-5 flex items-center whitespace-nowrap">
      <li class="flex items-center text-sm text-gray-600 dark:text-neutral-500">
        Dashboard
        <svg class="shrink-0 overflow-visible size-4 ms-1.5 text-gray-400 dark:text-neutral-600" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M6 13L10 3" stroke="currentColor" stroke-linecap="round"></path>
        </svg>
      </li>
      <li class="ps-1.5 flex items-center truncate font-semibold text-gray-800 dark:text-neutral-200 text-sm truncate">
        <span class="truncate">Empty States</span>
      </li>
    </ol>
    <!-- End Breadcrumb -->

    <div class="p-2 sm:p-5 sm:py-0 md:pt-5 space-y-5">
      <!-- Browsers Card - Empty State -->
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        <div class="h-full flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl dark:bg-neutral-800 dark:border-neutral-700">
          <div class="p-5 pb-3 flex justify-between items-center">
            <h2 class="ms-1 inline-block text-lg font-semibold text-gray-800 dark:text-neutral-200">
              Browsers
            </h2>
          </div>
          <div class="flex flex-col justify-center items-center h-full pb-5 px-5">
            <h4 class="text-5xl md:text-6xl font-medium text-gray-300 dark:text-neutral-600">
              0
            </h4>
            <p class="mt-5 text-sm text-gray-500 dark:text-neutral-500 text-center">
              Visitors are viewing website from the desktop device.
            </p>
            <div class="mt-8 space-y-3 w-full">
              <div class="flex items-center gap-x-3">
                <img class="shrink-0 size-6" src="/assets/svg/brands/chrome.svg" alt="Chrome Logo">
                <span class="text-sm text-gray-800 dark:text-neutral-200">Chrome</span>
                <span class="ms-auto text-sm font-medium text-gray-800 dark:text-neutral-200">0</span>
              </div>
              <div class="flex items-center gap-x-3">
                <img class="shrink-0 size-6" src="/assets/svg/brands/firefox.svg" alt="Firefox Logo">
                <span class="text-sm text-gray-800 dark:text-neutral-200">Firefox</span>
                <span class="ms-auto text-sm font-medium text-gray-800 dark:text-neutral-200">0</span>
              </div>
              <div class="flex items-center gap-x-3">
                <img class="shrink-0 size-6" src="/assets/svg/brands/safari.svg" alt="Safari Logo">
                <span class="text-sm text-gray-800 dark:text-neutral-200">Safari</span>
                <span class="ms-auto text-sm font-medium text-gray-800 dark:text-neutral-200">0</span>
              </div>
            </div>
            <div class="mt-6 w-full">
              <div class="flex items-center gap-x-2">
                <input type="checkbox" class="shrink-0 size-3.5 border-gray-300 rounded-sm text-blue-600 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-600 dark:checked:bg-blue-500 dark:checked:border-blue-500" id="hs-push-notifications">
                <label for="hs-push-notifications" class="text-sm text-gray-800 dark:text-neutral-200">
                  Push notifications
                </label>
              </div>
              <p class="mt-1 text-xs text-gray-500 dark:text-neutral-500">
                Automatically send me notifications
              </p>
            </div>
          </div>
        </div>

        <!-- Referral Traffic Card - Empty State -->
        <div class="h-full flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl dark:bg-neutral-800 dark:border-neutral-700">
          <div class="p-5 pb-3">
            <h2 class="ms-1 inline-block text-lg font-semibold text-gray-800 dark:text-neutral-200">
              Referral Traffic
            </h2>
          </div>
          <div class="flex flex-col justify-center items-center h-full pb-5 px-5">
            <svg class="shrink-0 size-12 text-gray-400 dark:text-neutral-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 3v18h18" />
              <path d="m19 9-5 5-4-4-3 3" />
            </svg>
            <h3 class="mt-3 text-sm font-semibold text-gray-800 dark:text-neutral-200">
              No data
            </h3>
            <p class="mt-1 text-sm text-gray-500 dark:text-neutral-500 text-center">
              No data here yet. We will notify you when there's an update.
            </p>
          </div>
        </div>

        <!-- Total sales Card - Empty State -->
        <div class="h-full flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl dark:bg-neutral-800 dark:border-neutral-700">
          <div class="p-5 pb-3 flex justify-between items-center">
            <h2 class="ms-1 inline-block text-lg font-semibold text-gray-800 dark:text-neutral-200">
              Total sales
            </h2>
            <span class="text-sm text-gray-500 dark:text-neutral-500">Today</span>
          </div>
          <div class="flex flex-col justify-center items-center h-full pb-5 px-5">
            <h4 class="text-5xl md:text-6xl font-medium text-gray-300 dark:text-neutral-600">
              $ 0
            </h4>
            <div class="mt-8 space-y-3 w-full">
              <div class="flex items-center justify-between">
                <h3 class="text-sm font-semibold text-gray-800 dark:text-neutral-200">Store sales</h3>
                <span class="text-sm font-medium text-gray-800 dark:text-neutral-200">0</span>
              </div>
              <div class="flex items-center justify-between">
                <h3 class="text-sm font-semibold text-gray-800 dark:text-neutral-200">Online sales</h3>
                <span class="text-sm font-medium text-gray-800 dark:text-neutral-200">0</span>
              </div>
              <div class="flex items-center justify-between">
                <h3 class="text-sm font-semibold text-gray-800 dark:text-neutral-200">Others</h3>
                <span class="text-sm font-medium text-gray-800 dark:text-neutral-200">0</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Project Table - Empty State -->
      <div class="flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl dark:bg-neutral-800 dark:border-neutral-700">
        <div class="p-5 flex justify-between items-center border-b border-gray-200 dark:border-neutral-700">
          <h2 class="ms-1 inline-block text-lg font-semibold text-gray-800 dark:text-neutral-200">
            Project
          </h2>
          <div class="flex items-center gap-x-2">
            <button type="button" class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700">
              <svg class="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 12h14" />
                <path d="M12 5v14" />
              </svg>
              Add project
            </button>
          </div>
        </div>
        <div class="flex flex-col justify-center items-center py-12 px-5">
          <svg class="shrink-0 size-12 text-gray-400 dark:text-neutral-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" x2="8" y1="13" y2="13" />
            <line x1="16" x2="8" y1="17" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
          <h3 class="mt-3 text-sm font-semibold text-gray-800 dark:text-neutral-200">
            No projects
          </h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-neutral-500 text-center">
            No data here yet. We will notify you when there's an update.
          </p>
        </div>
      </div>
    </div>
  </main>
  <!-- ========== END MAIN CONTENT ========== -->

<!-- ========== FOOTER ========== -->
  <footer class="lg:ms-65 lg:w-[calc(100vw-var(--spacing-65))] h-10 sm:h-16 absolute bottom-0 right-0">
    <div class="p-2 sm:p-5 flex justify-between items-center">
      <p class="text-xs sm:text-sm text-gray-500 dark:text-neutral-500">
        © 2025 Preline Labs.
      </p>

      <!-- List -->
      <ul>
        <li class="inline-block relative pe-5 text-xs sm:text-sm text-gray-500 align-middle last:pe-0 last-of-type:before:hidden before:absolute before:top-1/2 before:end-2 before:-translate-y-1/2 before:w-px before:h-3.5 before:bg-gray-400 before:rotate-[18deg] dark:text-neutral-500 dark:before:bg-neutral-600">
          <a class="hover:text-blue-600 focus:outline-hidden focus:underline dark:hover:text-neutral-200" href="#">
            FAQ
          </a>
        </li>
        <li class="inline-block relative pe-5 text-xs sm:text-sm text-gray-500 align-middle last:pe-0 last-of-type:before:hidden before:absolute before:top-1/2 before:end-2 before:-translate-y-1/2 before:w-px before:h-3.5 before:bg-gray-400 before:rotate-[18deg] dark:text-neutral-500 dark:before:bg-neutral-600">
          <a class="hover:text-blue-600 focus:outline-hidden focus:underline dark:hover:text-neutral-200" href="#">
            License
          </a>
        </li>
        <li class="inline-block relative pe-5 text-xs sm:text-sm text-gray-500 align-middle sm:leading-3 last:pe-0 last-of-type:before:hidden before:absolute before:top-1/2 before:end-2 before:-translate-y-1/2 before:w-px before:h-3.5 before:bg-gray-400 before:rotate-[18deg] dark:text-neutral-500 dark:before:bg-neutral-600">
          <button type="button" class="hover:text-blue-600 focus:outline-hidden focus:text-gray-800 dark:hover:text-neutral-200 dark:focus:text-neutral-400" data-hs-overlay="#hs-pro-dfkm">
            <svg class="shrink-0 size-3.5 sm:size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
            </svg>
          </button>
        </li>
      </ul>
      <!-- End List -->
    </div>
  </footer>
  <!-- ========== END FOOTER ========== -->
`;

export default function EmptyStates() {
  useEffect(() => {
    // Inicializar Preline UI después de que el HTML se renderice
    if (window.HSStaticMethods) {
      setTimeout(() => {
        if (window.HSStaticMethods && typeof window.HSStaticMethods.autoInit === 'function') {
          window.HSStaticMethods.autoInit();
        }
      }, 100);
    }
  }, []);

  return (
    <div
      className="bg-gray-50 dark:bg-neutral-900 min-h-screen lg:ml-65 lg:w-[calc(100vw-var(--spacing-65))]"
      dangerouslySetInnerHTML={{ __html: EMPTY_STATES_HTML }}
    />
  );
}
