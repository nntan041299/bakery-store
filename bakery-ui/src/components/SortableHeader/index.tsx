type SortDir = "asc" | "desc";

interface SortableHeaderProps<T extends string> {
  label: string;
  field: T;
  sortField: T;
  sortDir: SortDir;
  onSort: (field: T) => void;
}

const SortableHeader = <T extends string>({
  label,
  field,
  sortField,
  sortDir,
  onSort,
}: SortableHeaderProps<T>) => {
  const isActive = sortField === field;
  return (
    <th
      className="px-4 py-3 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider cursor-pointer select-none"
      style={{ fontFamily: "var(--font-sans)" }}
      onClick={() => onSort(field)}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        <i
          className={`pi ${
            isActive
              ? sortDir === "asc"
                ? "pi-sort-up-fill"
                : "pi-sort-down-fill"
              : "pi-sort-alt"
          } text-[10px] ${isActive ? "text-ink-900" : "text-surface-300"}`}
        />
      </span>
    </th>
  );
};

export default SortableHeader;
