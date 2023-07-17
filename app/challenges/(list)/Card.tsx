"use client";

import { capitalize } from "@/utils/string";
import { IconUsers } from "@tabler/icons-react";
import { Fragment } from "react";
import useRipple from "use-ripple-hook";

interface CardProps<
  Table extends { key: string; value: string | number | Date }[],
> {
  table: Table;
  participantCount: number;
  imageUrl: string;
  title: string;
  ended?: boolean;
  pricing: string;
}

export default function Card<
  Table extends { key: string; value: string | number | Date }[],
>({
  ended,
  table,
  participantCount,
  imageUrl,
  title,
  pricing,
}: CardProps<Table>) {
  const [ripple, event] = useRipple();

  return (
    <button
      ref={ripple}
      onPointerDown={event}
      className={`relative w-full p-2 pb-0 text-left text-white shadow-lg outline-none select-none rounded-2xl ${
        ended ? "bg-gray-500" : "bg-primary"
      } overflow-clip shadow-primary-900/25 focus:outline-none`}
    >
      <section className="h-48 bg-white rounded-lg overflow-clip">
        <img
          alt="alt"
          className="object-contain object-center w-full h-48 pointer-events-none select-none"
          src={imageUrl}
        />
      </section>
      <article className="p-4">
        <div className="flex items-center h-8 mb-2">
          <h3 className="flex-1 min-w-0 text-2xl font-medium truncate font-display">
            {title}
          </h3>
          {participantCount !== null && (
            <section
              className={`flex items-center gap-1 font-medium ${
                ended ? "text-gray-200" : "text-primary-200"
              }`}
            >
              <IconUsers aria-label="number of participants" size={20} />
              <span>{participantCount}</span>
            </section>
          )}
        </div>
        <section
          className={`grid grid-cols-[4rem_1fr] ${
            ended ? "text-gray-200" : "text-primary-200"
          }`}
          style={{
            gridTemplateRows: `repeat(${table.length}, 1.75rem)`,
          }}
        >
          {table.map(({ key, value }) => (
            <Fragment key={key}>
              <span>{capitalize(key)}</span>
              <span className="font-medium text-right">
                {typeof value === "object" ? (
                  <span className={ended ? "text-red-300" : ""}>
                    {value.toLocaleString()}
                  </span>
                ) : (
                  capitalize(value.toString())
                )}
              </span>
            </Fragment>
          ))}
        </section>
      </article>
      <div className="absolute h-6 px-2 leading-6 rounded-full top-4 left-4 bg-primary">
        {pricing && capitalize(pricing)}
      </div>
    </button>
  );
}
