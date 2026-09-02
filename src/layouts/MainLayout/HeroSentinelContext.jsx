import { createContext, useContext } from "react";

export const HeroSentinelContext = createContext(null);

const noop = () => {};

export function useHeroSentinel() {
  return useContext(HeroSentinelContext) ?? noop;
}