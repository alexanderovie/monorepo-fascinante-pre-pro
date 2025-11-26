/**
 * Double Area Chart Card Component
 *
 * Muestra un gráfico de área doble con selector de métrica, rango de fechas y estadísticas de Revenue.
 * Server Component - Los dropdowns de Preline se inicializan automáticamente.
 * El gráfico se renderiza como Client Component.
 */
import SalesLineChart from '../../../components/charts/SalesLineChart';

export default function DoubleAreaChartCard() {
  return (
    <div className="p-5 flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl dark:bg-neutral-800 dark:border-neutral-700">
      {/* Header */}
      <div className="grid md:grid-cols-2 items-start gap-2 md:gap-4">
        <div className="space-y-1">
          {/* Select */}
          <div className="relative inline-block">
            <select
              id="hs-pro-select-revenue"
              data-hs-select='{"placeholder": "Select option...", "toggleTag": "<button type=\"button\" aria-expanded=\"false\"></button>", "toggleClasses": "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative -ms-2 py-1.5 ps-2.5 pe-6 inline-flex shrink-0 justify-center items-center gap-x-1.5 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 before:absolute before:inset-0 before:z-1 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:focus:bg-neutral-700", "dropdownClasses": "mt-2 z-50 w-48 p-1 space-y-0.5 bg-white rounded-xl shadow-xl dark:bg-neutral-950", "optionClasses": "hs-selected:bg-gray-100 dark:hs-selected:bg-neutral-800 py-1.5 px-2 w-full text-[13px] text-gray-800 rounded-lg cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-hidden focus:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700", "optionTemplate": "<div class=\"flex justify-between items-center w-full\"><span data-title></span><span class=\"hidden hs-selected:block\"><svg class=\"shrink-0 size-3.5 text-gray-800 dark:text-neutral-200\" xmlns=\"http:.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"20 6 9 17 4 12\"/></svg></span></div>"}'
              className="hidden"
              defaultValue="Revenue"
            >
              <option value="">Choose</option>
              <option value="Revenue">Revenue</option>
              <option value="Total sales">Total sales</option>
              <option value="New sales">New sales</option>
              <option value="Refunds">Refunds</option>
              <option value="New subscriptions">New subscriptions</option>
              <option value="Trial conversion rate">Trial conversion rate</option>
              <option value="Affiliate revenue">Affiliate revenue</option>
              <option value="Affiliate clicks">Affiliate clicks</option>
            </select>

            <div className="absolute top-1/2 end-2 -translate-y-1/2">
              <svg className="shrink-0 size-3.5 text-gray-600 dark:text-neutral-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </div>
          </div>
          {/* End Select */}

          <h4 className="text-2xl font-semibold text-gray-800 dark:text-neutral-200">
            $62,820.59
            <svg className="inline-block align-top mt-1 shrink-0 size-5 text-red-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 17 13.5 8.5 8.5 13.5 2 7" />
              <polyline points="16 17 22 17 22 11" />
            </svg>
          </h4>
          <p className="text-sm text-red-500">
            0.2% less than the previous 30 days.
          </p>
        </div>
        {/* End Col */}

        <div className="flex md:justify-end items-center gap-x-1">
          {/* Calendar Dropdown */}
          <div className="hs-dropdown [--placement:bottom-right] [--strategy:absolute] [--flip:false] [--auto-close:inside] relative inline-flex">
            <button
              id="hs-pro-dachcd"
              type="button"
              className="py-1.5 sm:py-2 px-2.5 inline-flex items-center gap-x-1.5 text-sm sm:text-xs font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-50 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
              aria-haspopup="menu"
              aria-expanded="false"
              aria-label="Dropdown"
            >
              <svg className="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                <line x1="16" x2="16" y1="2" y2="6" />
                <line x1="8" x2="8" y1="2" y2="6" />
                <line x1="3" x2="21" y1="10" y2="10" />
                <path d="M8 14h.01" />
                <path d="M12 14h.01" />
                <path d="M16 14h.01" />
                <path d="M8 18h.01" />
                <path d="M12 18h.01" />
                <path d="M16 18h.01" />
              </svg>
              25 Jul, 2023 - 25 Aug, 2023
              <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>

            <div className="hs-dropdown-menu hs-dropdown-open:opacity-100 w-79.5 sm:w-159 transition-[opacity,margin] duration opacity-0 hidden start-5 z-50 bg-white rounded-xl shadow-xl dark:bg-neutral-900" role="menu" aria-orientation="vertical" aria-labelledby="hs-pro-dachcd">
              <div className="flex flex-col bg-white border border-gray-200 shadow-lg rounded-xl overflow-hidden dark:bg-neutral-900 dark:border-neutral-700">
                {/* Calendar */}
                <div className="sm:flex">
                  {/* Calendar - July */}
                  <div className="p-3 space-y-0.5">
                    {/* Months */}
                    <div className="grid grid-cols-5 items-center gap-x-3 mx-1.5 pb-3">
                      {/* Prev Button */}
                      <div className="col-span-1">
                        <button type="button" className="size-8 flex justify-center items-center text-gray-800 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800" aria-label="Previous">
                          <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m15 18-6-6 6-6" />
                          </svg>
                        </button>
                      </div>
                      {/* End Prev Button */}

                      {/* Month / Year */}
                      <div className="col-span-3 flex justify-center items-center gap-x-1">
                        <div className="relative">
                          <select
                            data-hs-select='{"placeholder": "Select month", "toggleTag": "<button type=\"button\" aria-expanded=\"false\"></button>", "toggleClasses": "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative flex text-nowrap w-full cursor-pointer text-start font-medium text-gray-800 hover:text-blue-600 focus:outline-hidden focus:text-blue-600 before:absolute before:inset-0 before:z-1 dark:text-neutral-200 dark:hover:text-blue-500 dark:focus:text-blue-500", "dropdownClasses": "mt-2 z-50 w-32 max-h-72 p-1 space-y-0.5 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 dark:bg-neutral-900 dark:border-neutral-700", "optionClasses": "p-2 w-full text-sm text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-hidden focus:bg-gray-100 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:text-neutral-200 dark:focus:bg-neutral-800", "optionTemplate": "<div class=\"flex justify-between items-center w-full\"><span data-title></span><span class=\"hidden hs-selected:block\"><svg class=\"shrink-0 size-3.5 text-gray-800 dark:text-neutral-200\" xmlns=\"http:.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"20 6 9 17 4 12\"/></svg></span></div>"}'
                            className="hidden"
                            defaultValue="6"
                          >
                            <option value="0">January</option>
                            <option value="1">February</option>
                            <option value="2">March</option>
                            <option value="3">April</option>
                            <option value="4">May</option>
                            <option value="5">June</option>
                            <option value="6">July</option>
                            <option value="7">August</option>
                            <option value="8">September</option>
                            <option value="9">October</option>
                            <option value="10">November</option>
                            <option value="11">December</option>
                          </select>
                        </div>

                        <span className="text-gray-800 dark:text-neutral-200">/</span>

                        <div className="relative">
                          <select
                            data-hs-select='{"placeholder": "Select year", "toggleTag": "<button type=\"button\" aria-expanded=\"false\"></button>", "toggleClasses": "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative flex text-nowrap w-full cursor-pointer text-start font-medium text-gray-800 hover:text-blue-600 focus:outline-hidden focus:text-blue-600 before:absolute before:inset-0 before:z-1 dark:text-neutral-200 dark:hover:text-blue-500 dark:focus:text-blue-500", "dropdownClasses": "mt-2 z-50 w-20 max-h-72 p-1 space-y-0.5 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 dark:bg-neutral-900 dark:border-neutral-700", "optionClasses": "p-2 w-full text-sm text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-hidden focus:bg-gray-100 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:text-neutral-200 dark:focus:bg-neutral-800", "optionTemplate": "<div class=\"flex justify-between items-center w-full\"><span data-title></span><span class=\"hidden hs-selected:block\"><svg class=\"shrink-0 size-3.5 text-gray-800 dark:text-neutral-200\" xmlns=\"http:.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"20 6 9 17 4 12\"/></svg></span></div>"}'
                            className="hidden"
                            defaultValue="2023"
                          >
                            <option>2023</option>
                            <option>2024</option>
                            <option>2025</option>
                            <option>2026</option>
                            <option>2027</option>
                          </select>
                        </div>
                      </div>
                      {/* End Month / Year */}

                      {/* Next Button */}
                      <div className="col-span-1 flex justify-end">
                        <button type="button" className="opacity-0 pointer-events-none size-8 flex justify-center items-center text-gray-800 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800" aria-label="Next">
                          <svg className="shrink-0 size-4" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m9 18 6-6-6-6" />
                          </svg>
                        </button>
                      </div>
                      {/* End Next Button */}
                    </div>
                    {/* Months */}

                    {/* Weeks */}
                    <div className="flex pb-1.5">
                      {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((day) => (
                        <span key={day} className="m-px w-10 block text-center text-sm text-gray-500 dark:text-neutral-500">
                          {day}
                        </span>
                      ))}
                    </div>
                    {/* Weeks */}

                    {/* Days - Week 1 */}
                    <div className="flex">
                      {[26, 27, 28, 29, 30, 1, 2].map((day, idx) => (
                        <div key={`july-week1-${day}`}>
                          <button
                            type="button"
                            className="m-px size-10 flex justify-center items-center border-[1.5px] border-transparent text-sm text-gray-800 rounded-full hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:border-blue-600 focus:text-blue-600 dark:text-neutral-200 dark:hover:border-blue-500 dark:hover:text-blue-500 dark:focus:border-blue-500 dark:focus:text-blue-500"
                            disabled={idx < 5}
                          >
                            {day}
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Days - Week 2 */}
                    <div className="flex">
                      {[3, 4, 5, 6, 7, 8, 9].map((day) => (
                        <div key={`july-week2-${day}`}>
                          <button
                            type="button"
                            className="m-px size-10 flex justify-center items-center border-[1.5px] border-transparent text-sm text-gray-800 rounded-full hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:border-blue-600 focus:text-blue-600 dark:text-neutral-200 dark:hover:border-blue-500 dark:hover:text-blue-500 dark:focus:border-blue-500 dark:focus:text-blue-500"
                          >
                            {day}
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Days - Week 3 */}
                    <div className="flex">
                      {[10, 11, 12, 13, 14, 15, 16].map((day) => (
                        <div key={`july-week3-${day}`}>
                          <button
                            type="button"
                            className="m-px size-10 flex justify-center items-center border-[1.5px] border-transparent text-sm text-gray-800 rounded-full hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:border-blue-600 focus:text-blue-600 dark:text-neutral-200 dark:hover:border-blue-500 dark:hover:text-blue-500 dark:focus:border-blue-500 dark:focus:text-blue-500"
                          >
                            {day}
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Days - Week 4 */}
                    <div className="flex">
                      {[17, 18, 19, 20, 21, 22, 23].map((day) => (
                        <div key={`july-week4-${day}`}>
                          <button
                            type="button"
                            className="m-px size-10 flex justify-center items-center border-[1.5px] border-transparent text-sm text-gray-800 rounded-full hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:border-blue-600 focus:text-blue-600 dark:text-neutral-200 dark:hover:border-blue-500 dark:hover:text-blue-500 dark:focus:border-blue-500 dark:focus:text-blue-500"
                          >
                            {day}
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Days - Week 5 (25 selected) */}
                    <div className="flex">
                      {[24, 25, 26, 27, 28, 29, 30].map((day) => (
                        <div key={`july-week5-${day}`} className={day >= 25 && day <= 30 ? 'bg-gray-100 first:rounded-s-full last:rounded-e-full dark:bg-neutral-800' : ''}>
                          <button
                            type="button"
                            className={`m-px size-10 flex justify-center items-center border-[1.5px] text-sm rounded-full ${
                              day === 25
                                ? 'bg-blue-600 border-transparent text-white hover:border-blue-600 dark:bg-blue-500'
                                : 'border-transparent text-gray-800 hover:border-blue-600 hover:text-blue-600 dark:text-neutral-200 dark:hover:border-blue-500 dark:hover:text-blue-500 dark:focus:border-blue-500 dark:focus:text-blue-500'
                            } disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:border-blue-600 focus:text-blue-600`}
                          >
                            {day}
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Days - Week 6 */}
                    <div className="flex">
                      {[31, 1, 2, 3, 4, 5, 6].map((day, idx) => (
                        <div key={`july-week6-${day}`} className={idx === 0 ? 'bg-linear-to-l from-gray-100 dark:from-neutral-800' : ''}>
                          <button
                            type="button"
                            className="m-px size-10 flex justify-center items-center border-[1.5px] border-transparent text-sm text-gray-800 hover:border-blue-600 hover:text-blue-600 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100 dark:text-neutral-200 dark:hover:border-neutral-500 dark:focus:bg-neutral-700"
                            disabled={idx > 0}
                          >
                            {day}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Calendar - August */}
                  <div className="p-3 space-y-0.5">
                    {/* Months */}
                    <div className="grid grid-cols-5 items-center gap-x-3 mx-1.5 pb-3">
                      {/* Prev Button */}
                      <div className="col-span-1">
                        <button type="button" className="opacity-0 pointer-events-none size-8 flex justify-center items-center text-gray-800 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800" aria-label="Previous">
                          <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m15 18-6-6 6-6" />
                          </svg>
                        </button>
                      </div>
                      {/* End Prev Button */}

                      {/* Month / Year */}
                      <div className="col-span-3 flex justify-center items-center gap-x-1">
                        <div className="relative">
                          <select
                            data-hs-select='{"placeholder": "Select month", "toggleTag": "<button type=\"button\" aria-expanded=\"false\"></button>", "toggleClasses": "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative flex text-nowrap w-full cursor-pointer text-start font-medium text-gray-800 hover:text-blue-600 focus:outline-hidden focus:text-blue-600 before:absolute before:inset-0 before:z-1 dark:text-neutral-200 dark:hover:text-blue-500 dark:focus:text-blue-500", "dropdownClasses": "mt-2 z-50 w-32 max-h-72 p-1 space-y-0.5 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 dark:bg-neutral-900 dark:border-neutral-700", "optionClasses": "p-2 w-full text-sm text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-hidden focus:bg-gray-100 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:text-neutral-200 dark:focus:bg-neutral-800", "optionTemplate": "<div class=\"flex justify-between items-center w-full\"><span data-title></span><span class=\"hidden hs-selected:block\"><svg class=\"shrink-0 size-3.5 text-gray-800 dark:text-neutral-200\" xmlns=\"http:.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"20 6 9 17 4 12\"/></svg></span></div>"}'
                            className="hidden"
                            defaultValue="7"
                          >
                            <option value="0">January</option>
                            <option value="1">February</option>
                            <option value="2">March</option>
                            <option value="3">April</option>
                            <option value="4">May</option>
                            <option value="5">June</option>
                            <option value="6">July</option>
                            <option value="7">August</option>
                            <option value="8">September</option>
                            <option value="9">October</option>
                            <option value="10">November</option>
                            <option value="11">December</option>
                          </select>
                        </div>

                        <span className="text-gray-800 dark:text-neutral-200">/</span>

                        <div className="relative">
                          <select
                            data-hs-select='{"placeholder": "Select year", "toggleTag": "<button type=\"button\" aria-expanded=\"false\"></button>", "toggleClasses": "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative flex text-nowrap w-full cursor-pointer text-start font-medium text-gray-800 hover:text-blue-600 focus:outline-hidden focus:text-blue-600 before:absolute before:inset-0 before:z-1 dark:text-neutral-200 dark:hover:text-blue-500 dark:focus:text-blue-500", "dropdownClasses": "mt-2 z-50 w-20 max-h-72 p-1 space-y-0.5 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 dark:bg-neutral-900 dark:border-neutral-700", "optionClasses": "p-2 w-full text-sm text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-hidden focus:bg-gray-100 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:text-neutral-200 dark:focus:bg-neutral-800", "optionTemplate": "<div class=\"flex justify-between items-center w-full\"><span data-title></span><span class=\"hidden hs-selected:block\"><svg class=\"shrink-0 size-3.5 text-gray-800 dark:text-neutral-200\" xmlns=\"http:.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"20 6 9 17 4 12\"/></svg></span></div>"}'
                            className="hidden"
                            defaultValue="2023"
                          >
                            <option>2023</option>
                            <option>2024</option>
                            <option>2025</option>
                            <option>2026</option>
                            <option>2027</option>
                          </select>
                        </div>
                      </div>
                      {/* End Month / Year */}

                      {/* Next Button */}
                      <div className="col-span-1 flex justify-end">
                        <button type="button" className="size-8 flex justify-center items-center text-gray-800 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800" aria-label="Next">
                          <svg className="shrink-0 size-4" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m9 18 6-6-6-6" />
                          </svg>
                        </button>
                      </div>
                      {/* End Next Button */}
                    </div>
                    {/* Months */}

                    {/* Weeks */}
                    <div className="flex pb-1.5">
                      {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((day) => (
                        <span key={day} className="m-px w-10 block text-center text-sm text-gray-500 dark:text-neutral-500">
                          {day}
                        </span>
                      ))}
                    </div>
                    {/* Weeks */}

                    {/* Days - Week 1 */}
                    <div className="flex">
                      {[31, 1, 2, 3, 4, 5, 6].map((day, idx) => (
                        <div key={`aug-week1-${day}`} className={idx === 0 ? 'bg-linear-to-l from-gray-100 dark:from-neutral-800' : (idx > 0 ? 'bg-gray-100 first:rounded-s-full last:rounded-e-full dark:bg-neutral-800' : '')}>
                          <button
                            type="button"
                            className={`m-px size-10 flex justify-center items-center border-[1.5px] text-sm rounded-full ${
                              idx === 0
                                ? 'border-transparent text-gray-800 hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100 dark:text-neutral-200 dark:hover:border-neutral-500 dark:focus:bg-neutral-700'
                                : 'border-transparent text-gray-800 hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:border-blue-600 focus:text-blue-600 dark:text-neutral-200 dark:hover:border-blue-500 dark:hover:text-blue-500 dark:focus:border-blue-500 dark:focus:text-blue-500'
                            }`}
                            disabled={idx === 0}
                          >
                            {day}
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Days - Week 2 */}
                    <div className="flex">
                      {[7, 8, 9, 10, 11, 12, 13].map((day) => (
                        <div key={`aug-week2-${day}`} className="bg-gray-100 first:rounded-s-full last:rounded-e-full dark:bg-neutral-800">
                          <button
                            type="button"
                            className="m-px size-10 flex justify-center items-center border-[1.5px] border-transparent text-sm text-gray-800 rounded-full hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:border-blue-600 focus:text-blue-600 dark:text-neutral-200 dark:hover:border-blue-500 dark:hover:text-blue-500 dark:focus:border-blue-500 dark:focus:text-blue-500"
                          >
                            {day}
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Days - Week 3 */}
                    <div className="flex">
                      {[14, 15, 16, 17, 18, 19, 20].map((day) => (
                        <div key={`aug-week3-${day}`} className="bg-gray-100 first:rounded-s-full last:rounded-e-full dark:bg-neutral-800">
                          <button
                            type="button"
                            className="m-px size-10 flex justify-center items-center border-[1.5px] border-transparent text-sm text-gray-800 rounded-full hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:border-blue-600 focus:text-blue-600 dark:text-neutral-200 dark:hover:border-blue-500 dark:hover:text-blue-500 dark:focus:border-blue-500 dark:focus:text-blue-500"
                          >
                            {day}
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Days - Week 4 */}
                    <div className="flex">
                      {[21, 22, 23, 24, 25, 26, 27].map((day) => (
                        <div key={`aug-week4-${day}`} className={day <= 25 ? 'bg-gray-100 first:rounded-s-full last:rounded-e-full dark:bg-neutral-800' : ''}>
                          <button
                            type="button"
                            className={`m-px size-10 flex justify-center items-center border-[1.5px] text-sm rounded-full ${
                              day === 25
                                ? 'bg-blue-600 border-transparent text-white hover:border-blue-600 dark:bg-blue-500'
                                : 'border-transparent text-gray-800 hover:border-blue-600 hover:text-blue-600 dark:text-neutral-200 dark:hover:border-blue-500 dark:hover:text-blue-500 dark:focus:border-blue-500 dark:focus:text-blue-500'
                            } disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:border-blue-600 focus:text-blue-600`}
                          >
                            {day}
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Days - Week 5 */}
                    <div className="flex">
                      {[28, 29, 30, 31, 1, 2, 3].map((day, idx) => (
                        <div key={`aug-week5-${day}`}>
                          <button
                            type="button"
                            className="m-px size-10 flex justify-center items-center border-[1.5px] border-transparent text-sm text-gray-800 rounded-full hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:border-blue-600 focus:text-blue-600 dark:text-neutral-200 dark:hover:border-blue-500 dark:hover:text-blue-500 dark:focus:border-blue-500 dark:focus:text-blue-500"
                            disabled={idx > 2}
                          >
                            {day}
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Days - Week 6 */}
                    <div className="flex">
                      {[4, 5, 6, 7, 8, 9, 10].map((day) => (
                        <div key={`aug-week6-${day}`}>
                          <button
                            type="button"
                            className="m-px size-10 flex justify-center items-center border-[1.5px] border-transparent text-sm text-gray-800 hover:border-blue-600 hover:text-blue-600 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100 dark:text-neutral-200 dark:hover:border-neutral-500 dark:focus:bg-neutral-700"
                            disabled
                          >
                            {day}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {/* End Calendar */}

                {/* Button Group */}
                <div className="flex items-center py-3 px-4 justify-end border-t border-gray-200 dark:border-neutral-700 gap-x-2">
                  <button
                    type="button"
                    className="py-2 px-3 inline-flex items-center gap-x-2 text-xs font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-50 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="py-2 px-3 inline-flex justify-center items-center gap-x-2 text-xs font-medium rounded-lg border-[1.5px] border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  >
                    Apply
                  </button>
                </div>
                {/* End Button Group */}
              </div>
            </div>
          </div>
          {/* End Calendar Dropdown */}

          {/* Download Dropdown */}
          <div className="hs-dropdown [--auto-close:inside] [--placement:bottom-right] relative inline-flex">
            <button
              id="hs-pro-dachd"
              type="button"
              className="size-8.5 inline-flex justify-center items-center gap-x-2 rounded-lg border border-transparent text-gray-500 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-neutral-400 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
              aria-haspopup="menu"
              aria-expanded="false"
              aria-label="Dropdown"
            >
              <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" x2="12" y1="15" y2="3" />
              </svg>
            </button>

            {/* Download Dropdown Menu */}
            <div className="hs-dropdown-menu hs-dropdown-open:opacity-100 w-60 transition-[opacity,margin] duration opacity-0 hidden z-20 bg-white rounded-xl shadow-xl dark:bg-neutral-900" role="menu" aria-orientation="vertical" aria-labelledby="hs-pro-dachd">
              <div className="p-1">
                <div className="py-2 px-3">
                  <span className="block font-semibold text-gray-800 dark:text-neutral-200">
                    Download Report
                  </span>
                  <span className="block text-xs text-gray-500 dark:text-neutral-500">
                    Select Options
                  </span>
                </div>

                <div className="m-2 border-t border-gray-200 dark:border-neutral-700"></div>

                <div className="py-1 px-2">
                  <div className="flex items-center bg-gray-100 rounded-xl p-1 dark:bg-neutral-800">
                    <label htmlFor="hs-pro-dachdts1" className="relative py-1.5 px-3 w-full cursor-pointer text-center text-sm text-gray-800 rounded-lg has-checked:bg-white has-checked:shadow-2xs dark:text-neutral-200 dark:has-checked:bg-neutral-600">
                      <span className="relative z-10 align-middle">Excel</span>
                      <input type="radio" name="hs-pro-dachdts" className="hidden" id="hs-pro-dachdts1" defaultChecked />
                    </label>

                    <label htmlFor="hs-pro-dachdts2" className="relative py-1.5 px-3 w-full cursor-pointer text-center text-sm text-gray-800 rounded-lg has-checked:bg-white has-checked:shadow-2xs dark:text-neutral-200 dark:has-checked:bg-neutral-600">
                      <span className="relative z-10 align-middle">Word</span>
                      <input type="radio" name="hs-pro-dachdts" className="hidden" id="hs-pro-dachdts2" />
                    </label>
                  </div>
                </div>

                <div className="m-2 border-t border-gray-200 dark:border-neutral-700"></div>

                <div className="flex justify-between items-center py-2 px-3 cursor-pointer rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 dark:focus:bg-neutral-700">
                  <label htmlFor="hs-pro-dachds1" className="flex flex-1 items-center gap-x-3 cursor-pointer text-sm text-gray-800 dark:text-neutral-300">
                    <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                      <path d="m15 5 4 4" />
                    </svg>
                    Section name
                  </label>
                  <input type="checkbox" className="shrink-0 size-3.5 border-gray-300 rounded-sm text-blue-500 focus:ring-blue-500 checked:border-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-600 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800" id="hs-pro-dachds1" defaultChecked />
                </div>
                <div className="flex justify-between items-center py-2 px-3 cursor-pointer rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 dark:focus:bg-neutral-700">
                  <label htmlFor="hs-pro-dachds2" className="flex flex-1 items-center gap-x-3 cursor-pointer text-sm text-gray-800 dark:text-neutral-300">
                    <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 22h2a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v3" />
                      <polyline points="14 2 14 8 20 8" />
                      <path d="M4.04 11.71a5.84 5.84 0 1 0 8.2 8.29" />
                      <path d="M13.83 16A5.83 5.83 0 0 0 8 10.17V16h5.83Z" />
                    </svg>
                    Comparison stats
                  </label>
                  <input type="checkbox" className="shrink-0 size-3.5 border-gray-300 rounded-sm text-blue-500 focus:ring-blue-500 checked:border-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-600 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800" id="hs-pro-dachds2" defaultChecked />
                </div>
                <div className="flex justify-between items-center py-2 px-3 cursor-pointer rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 dark:focus:bg-neutral-700">
                  <label htmlFor="hs-pro-dachds3" className="flex flex-1 items-center gap-x-3 cursor-pointer text-sm text-gray-800 dark:text-neutral-300">
                    <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                    </svg>
                    Legend indicator
                  </label>
                  <input type="checkbox" className="shrink-0 size-3.5 border-gray-300 rounded-sm text-blue-500 focus:ring-blue-500 checked:border-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-600 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800" id="hs-pro-dachds3" defaultChecked />
                </div>

                <div className="my-1 border-t border-gray-200 dark:border-neutral-700"></div>

                <button
                  type="button"
                  className="w-full py-2 px-3 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                >
                  Download
                </button>
              </div>
            </div>
            {/* End Download Dropdown Menu */}
          </div>
          {/* End Download Dropdown */}

          {/* More Options Dropdown */}
          <div className="hs-dropdown [--auto-close:inside] [--placement:bottom-right] relative inline-flex">
            <button
              id="hs-pro-dachmd"
              type="button"
              className="size-8.5 inline-flex justify-center items-center gap-x-2 rounded-lg border border-transparent text-gray-500 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-neutral-400 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
              aria-haspopup="menu"
              aria-expanded="false"
              aria-label="Dropdown"
            >
              <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="1" />
                <circle cx="12" cy="5" r="1" />
                <circle cx="12" cy="19" r="1" />
              </svg>
            </button>

            <div className="hs-dropdown-menu hs-dropdown-open:opacity-100 w-48 transition-[opacity,margin] duration opacity-0 hidden z-10 bg-white rounded-xl shadow-xl dark:bg-neutral-900" role="menu" aria-orientation="vertical" aria-labelledby="hs-pro-dachmd">
              <div className="p-1">
                <button
                  type="button"
                  className="w-full flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-[13px] text-gray-800 hover:bg-gray-100 disabled:opacity-50 focus:outline-hidden focus:bg-gray-100 disabled:pointer-events-none dark:text-neutral-300 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                >
                  <svg className="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="18" cy="5" r="3" />
                    <circle cx="6" cy="12" r="3" />
                    <circle cx="18" cy="19" r="3" />
                    <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
                    <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
                  </svg>
                  Share reports
                </button>
                <button
                  type="button"
                  className="w-full flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-[13px] text-gray-800 hover:bg-gray-100 disabled:opacity-50 focus:outline-hidden focus:bg-gray-100 disabled:pointer-events-none dark:text-neutral-300 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                >
                  <svg className="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M8 3H5a2 2 0 0 0-2 2v3" />
                    <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
                    <path d="M3 16v3a2 2 0 0 0 2 2h3" />
                    <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
                  </svg>
                  View in fullscreen
                </button>
                <button
                  type="button"
                  className="w-full flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-[13px] text-gray-800 hover:bg-gray-100 disabled:opacity-50 focus:outline-hidden focus:bg-gray-100 disabled:pointer-events-none dark:text-neutral-300 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                >
                  <svg className="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 3h6l6 18h6" />
                    <path d="M14 3h7" />
                  </svg>
                  Connect other apps
                </button>

                <div className="my-1 border-t border-gray-200 dark:border-neutral-700"></div>

                <button
                  type="button"
                  className="w-full flex items-center gap-x-3 py-1.5 px-2 rounded-lg text-[13px] text-gray-800 hover:bg-gray-100 disabled:opacity-50 focus:outline-hidden focus:bg-gray-100 disabled:pointer-events-none dark:text-neutral-300 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                >
                  <svg className="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    <line x1="9" x2="15" y1="10" y2="10" />
                    <line x1="12" x2="12" y1="7" y2="13" />
                  </svg>
                  Submit Feedback
                </button>
              </div>
            </div>
          </div>
          {/* End More Options Dropdown */}
        </div>
        {/* End Col */}
      </div>
      {/* End Header */}

      {/* Legend Indicator */}
      <div className="flex justify-center sm:justify-end items-center gap-x-4 mt-5 sm:mt-0 sm:mb-6">
        <div className="inline-flex items-center">
          <span className="size-2.5 inline-block bg-blue-600 rounded-xs me-2"></span>
          <span className="text-[13px] text-gray-600 dark:text-neutral-400">
            This month
          </span>
        </div>
        <div className="inline-flex items-center">
          <span className="size-2.5 inline-block bg-purple-600 rounded-xs me-2"></span>
          <span className="text-[13px] text-gray-600 dark:text-neutral-400">
            Last month
          </span>
        </div>
      </div>
      {/* End Legend Indicator */}

      {/* Apex Line Chart */}
      <SalesLineChart className="min-h-[415px]" />
    </div>
  );
}
