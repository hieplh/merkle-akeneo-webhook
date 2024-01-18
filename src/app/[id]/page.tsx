"use client";

import { syntaxHighlight } from "@/lib/highlight-json";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function GetById() {
  const param = useParams();
  const [pretty, setPretty] = useState(true);
  const [events, setEvents] = useState({});
  useEffect(() => {
    fetch(`/api/${param.id}`)
      .then((res: any) => res.json())
      .then((data: any) => {
        setEvents(data);
      });
  }, [param.id]);

  return (
    <main className="flex flex-col justify-between p-1">
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          value=""
          className="sr-only peer"
          checked={pretty}
          onChange={() => setPretty(!pretty)}
        />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
        <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
          Pretty
        </span>
      </label>
      <br />

      {Object.keys(events).length !== 0 &&
        (pretty ? (
          <pre
            className="highlight-json text-wrap border-2"
            dangerouslySetInnerHTML={{
              __html: syntaxHighlight(JSON.stringify(events, undefined, 4)),
            }}
          />
        ) : (
          <pre
            className="highlight-json text-wrap border-2"
            dangerouslySetInnerHTML={{
              __html: syntaxHighlight(JSON.stringify(events)),
            }}
          />
        ))}
    </main>
  );
}
