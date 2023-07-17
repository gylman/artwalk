"use client";

import FullscreenDialog from "@/components/FullscreenDialog";
import PrimaryButton from "@/components/PrimaryButton";
import SecondaryButton from "@/components/SecondaryButton";
import Select from "@/components/Select";
import { IconAdjustments, IconFilter } from "@tabler/icons-react";
import { useMemo, useRef, useState, type PropsWithChildren } from "react";
import {
  defaultFilterValue,
  FilterContext,
  type ChallengeDifficulty,
  type ChallengePricing,
  type ChallengeStatus,
} from "./FilterContext";

export default function FilterProvider({ children }: PropsWithChildren) {
  const [value, setValue] = useState(defaultFilterValue);
  const [open, setOpen] = useState(false);
  const context = useMemo(() => ({ value }), [value]);
  const form = useRef<HTMLFormElement>(null);

  return (
    <FilterContext.Provider value={context}>
      <section className="mb-6">
        <FullscreenDialog
          open={open}
          setOpen={setOpen}
          title="Filter Challenge"
          trigger={
            <SecondaryButton className="mx-auto" onClick={() => setOpen(true)}>
              <IconAdjustments />
              <span>Filter challenge</span>
            </SecondaryButton>
          }
        >
          <form ref={form} className="flex flex-col items-stretch gap-6 p-6">
            <Select label="Difficulty" defaultValue={value.difficulty}>
              {[
                { label: "All", value: "all" },
                { label: "Easy", value: "easy" },
                { label: "Medium", value: "medium" },
                { label: "Hard", value: "hard" },
                { label: "Expert", value: "expert" },
              ]}
            </Select>
            <Select label="Pricing" defaultValue={value.pricing}>
              {[
                { label: "All", value: "all" },
                { label: "Premium", value: "premium" },
                { label: "Free", value: "free" },
              ]}
            </Select>
            <Select label="Status" defaultValue={value.status}>
              {[
                { label: "All", value: "all" },
                { label: "In progress", value: "in progress" },
                { label: "Done", value: "done" },
              ]}
            </Select>
          </form>

          <PrimaryButton
            className="absolute -translate-x-1/2 bottom-12 left-1/2"
            onClick={() => {
              if (!form.current) return;
              const formData = new FormData(form.current);
              setValue({
                difficulty: formData.get("Difficulty") as ChallengeDifficulty,
                pricing: formData.get("Pricing") as ChallengePricing,
                status: formData.get("Status") as ChallengeStatus,
              });
              setOpen(false);
            }}
          >
            Apply filter
          </PrimaryButton>
        </FullscreenDialog>
      </section>
      {children}
    </FilterContext.Provider>
  );
}
