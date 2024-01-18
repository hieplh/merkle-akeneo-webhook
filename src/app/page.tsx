"use client";

import paginationConfig from "@/config/pagination";
import { syntaxHighlight } from "@/lib/highlight-json";
import { useEffect, useState } from "react";

function calculateTotalPages(totalCount: number, itemsPerPage: number) {
  return Math.ceil(totalCount / itemsPerPage);
}

export default function GetAll() {
  const [pretty, setPretty] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pastPage, setPastPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [data, setData] = useState({} as { totalCount: number; events: any });
  const [pastData, setPastData] = useState(
    {} as { totalCount: number; events: any }
  );

  useEffect(() => {
    if (currentPage <= 1) {
      fetch("/api")
        .then((res: any) => res.json())
        .then((data: any) => {
          setData(data);
          setTotalPages(
            calculateTotalPages(data.totalCount, paginationConfig.count)
          );
        });
    } else if (pastPage !== currentPage) {
      const id =
        pastPage > currentPage ? pastData.events[0].id : data.events[data.events.length - 1].id;
      const skip = pastPage > currentPage ? 0 : 1;

      fetch(`/api?cursor=${id}&skip=${skip}`)
        .then((res: any) => res.json())
        .then((res: any) => {
          setPastData(data);
          setData(res);
          setTotalPages(
            calculateTotalPages(res.totalCount, paginationConfig.count)
          );
        });
    }

    setPastPage(currentPage);
  }, [currentPage]);

  return (
    <main className="flex flex-col justify-between p-1 flex-wrap">
      <div className="flex justify-between">
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            value=""
            className="sr-only peer"
            checked={pretty}
            onChange={() => setPretty(!pretty)}
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[10px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
            Pretty
          </span>
        </label>

        <nav aria-label="Page navigation">
          <ul className="inline-flex -space-x-px text-base h-10">
            <li>
              {currentPage === 1 ? (
                <button
                  className="pointer-events-none flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                  aria-disabled="true"
                  tabIndex={-1}
                >
                  Previous
                </button>
              ) : (
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  Previous
                </button>
              )}
            </li>

            {/* {totalPages > 0 &&
              Array.from(Array(totalPages).keys()).map((count: number) => {
                if (count === currentPage - 1) {
                  return (
                    <li key={count}>
                      <button
                        onClick={() => setCurrentPage(count + 1)}
                        aria-current="page"
                        className="flex items-center justify-center px-4 h-10 text-blue-600 border border-gray-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                      >
                        {count + 1}
                      </button>
                    </li>
                  );
                } else {
                  return (
                    <li key={count}>
                      <button
                        onClick={() => setCurrentPage(count + 1)}
                        className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                      >
                        {count + 1}
                      </button>
                    </li>
                  );
                }
              })} */}

            <li>
              {currentPage === totalPages ? (
                <button
                  className="pointer-events-none flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                  aria-disabled="true"
                  tabIndex={-1}
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  Next
                </button>
              )}
            </li>
          </ul>
        </nav>
      </div>

      <br />

      {Object.keys(data).length !== 0 &&
        data.totalCount > 0 &&
        (pretty ? (
          <pre
            className="highlight-json whitespace-break-spaces border-2"
            dangerouslySetInnerHTML={{
              __html: syntaxHighlight(
                JSON.stringify(data.events, undefined, 4)
              ),
            }}
          />
        ) : (
          <pre
            className="highlight-json whitespace-break-spaces whites border-2"
            dangerouslySetInnerHTML={{
              __html: syntaxHighlight(JSON.stringify(data.events)),
            }}
          />
        ))}
    </main>
  );
}
