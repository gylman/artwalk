"use client";

import { createContext } from "react";

export type ChallengeDifficulty = "easy" | "medium" | "hard" | "expert";
export type ChallengeStatus = "in progress" | "done";
export type ChallengePricing = "premium" | "free";

interface FilterContext {
  value: {
    difficulty: "all" | ChallengeDifficulty;
    status: "all" | ChallengeStatus;
    pricing: "all" | ChallengePricing;
  };
}
export const defaultFilterValue: FilterContext["value"] = {
  difficulty: "all",
  status: "all",
  pricing: "all",
};

export const FilterContext = createContext<FilterContext>(undefined!);
