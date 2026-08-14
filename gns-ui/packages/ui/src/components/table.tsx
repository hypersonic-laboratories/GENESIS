import type { ReactNode } from "react";
import { cn } from "../lib/cn";
import { Skeleton } from "./data";

export interface Column<T> {
  /** Stable identifier, also used as the React key for the cell. */
  key: string;
  header: ReactNode;
  /** Defaults to `String(row[key])` when the row is a plain record. */
  render?: (row: T, index: number) => ReactNode;
  align?: "start" | "center" | "end";
  /** Any width utility or CSS length applied to the column. */
  width?: string;
  /** Right-aligns and switches on tabular figures. */
  numeric?: boolean;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  /** Stable key per row. Index is a last resort — it breaks selection on sort. */
  rowKey: (row: T, index: number) => string | number;
  onRowClick?: (row: T, index: number) => void;
  selectedKey?: string | number;
  /** Rendered in place of the body when there are no rows. */
  empty?: ReactNode;
  /** Shows placeholder rows instead of `empty` while data is in flight. */
  loading?: boolean;
  loadingRows?: number;
  density?: "compact" | "default";
  /** Keeps the header visible while the body scrolls. */
  stickyHeader?: boolean;
  className?: string;
  caption?: string;
}

const alignClasses = {
  start: "text-left",
  center: "text-center",
  end: "text-right",
} as const;

/**
 * A dense record list. Sorting, filtering and pagination stay with the caller —
 * this renders the rows it is handed, in the order it is handed them.
 */
export function DataTable<T>({
  columns,
  rows,
  rowKey,
  onRowClick,
  selectedKey,
  empty,
  loading = false,
  loadingRows = 5,
  density = "default",
  stickyHeader = false,
  className,
  caption,
}: DataTableProps<T>) {
  const cellPadding = density === "compact" ? "px-3 py-1.5" : "px-3 py-2.5";

  return (
    <div
      className={cn(
        "w-full overflow-auto rounded-lg border border-line",
        "surface-raised inset-shadow-edge",
        className,
      )}
    >
      <table className="w-full border-collapse">
        {caption ? <caption className="sr-only">{caption}</caption> : null}

        <thead
          className={cn(
            "bg-ink-900/80 backdrop-blur-sm",
            stickyHeader && "sticky top-0 z-10",
          )}
        >
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                style={column.width ? { width: column.width } : undefined}
                className={cn(
                  cellPadding,
                  "border-b border-line text-overline text-text-subtle whitespace-nowrap",
                  alignClasses[
                    column.align ?? (column.numeric ? "end" : "start")
                  ],
                )}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {loading
            ? Array.from({ length: loadingRows }).map((_, rowIndex) => (
                <tr key={`skeleton-${rowIndex}`}>
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={cn(cellPadding, "border-b border-line-faint")}
                    >
                      <Skeleton className="h-3 w-full" />
                    </td>
                  ))}
                </tr>
              ))
            : rows.map((row, rowIndex) => {
                const key = rowKey(row, rowIndex);
                const selected = selectedKey !== undefined && selectedKey === key;

                return (
                  <tr
                    key={key}
                    onClick={
                      onRowClick ? () => onRowClick(row, rowIndex) : undefined
                    }
                    // A clickable row is unreachable without this: `<tr>` takes
                    // no focus of its own, so keyboard users would be stuck.
                    tabIndex={onRowClick ? 0 : undefined}
                    onKeyDown={
                      onRowClick
                        ? (event) => {
                            if (event.key !== "Enter" && event.key !== " ") return;
                            event.preventDefault();
                            onRowClick(row, rowIndex);
                          }
                        : undefined
                    }
                    aria-selected={selected || undefined}
                    className={cn(
                      "transition-colors duration-75",
                      onRowClick &&
                        "cursor-pointer hover:bg-surface-hover focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent",
                      selected && "bg-surface-active",
                    )}
                  >
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        data-numeric={column.numeric || undefined}
                        className={cn(
                          cellPadding,
                          "border-b border-line-faint text-control text-text-muted",
                          alignClasses[
                            column.align ?? (column.numeric ? "end" : "start")
                          ],
                        )}
                      >
                        {column.render
                          ? column.render(row, rowIndex)
                          : String((row as Record<string, unknown>)[column.key] ?? "")}
                      </td>
                    ))}
                  </tr>
                );
              })}
        </tbody>
      </table>

      {!loading && rows.length === 0 && empty ? (
        <div className="p-4">{empty}</div>
      ) : null}
    </div>
  );
}
