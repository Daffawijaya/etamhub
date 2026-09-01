"use client";

import CustomSelect from "@/components/ui/CustomSelect";
import FilterSheet from "@/components/ui/FilterSheet";

interface Actor {
  actor_id: string;
  actor_name: string;
  actor_role: string;
}

interface Props {
  actors: Actor[];
  filterActor: string;
  filterAction: string;
  actionOptions: { value: string; label: string }[];
  onActorChange: (value: string) => void;
  onActionChange: (value: string) => void;
}

export default function LogFilters({
  actors,
  filterActor,
  filterAction,
  actionOptions,
  onActorChange,
  onActionChange,
}: Props) {
  const activeCount =
    (filterActor ? 1 : 0) +
    (filterAction ? 1 : 0);

  const handleReset = () => {
    onActorChange("");
    onActionChange("");
  };

  const handleApply = () => {
    // Filters are already applied live — no-op
  };

  return (
    <div className="relative">
      <FilterSheet
        activeCount={activeCount}
        onReset={handleReset}
        onApply={handleApply}
      >
        <FilterField label="Admin">
          <CustomSelect
            value={filterActor}
            onChange={onActorChange}
            placeholder="Semua Admin"
            options={actors.map((a) => ({
              value: a.actor_id,
              label: a.actor_name,
            }))}
          />
        </FilterField>

        <FilterField label="Aksi">
          <CustomSelect
            value={filterAction}
            onChange={onActionChange}
            placeholder="Semua Aksi"
            options={actionOptions}
          />
        </FilterField>
      </FilterSheet>
    </div>
  );
}

function FilterField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-600 dark:text-slate-300">
        {label}
      </label>
      {children}
    </div>
  );
}
