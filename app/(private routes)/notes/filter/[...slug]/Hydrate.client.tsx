"use client";

import type { DehydratedState } from "@tanstack/react-query";
import { HydrationBoundary } from "@tanstack/react-query";

type Props = {
  state: DehydratedState;
  children: React.ReactNode;
};

export default function HydrateClient({ state, children }: Props) {
  return <HydrationBoundary state={state}>{children}</HydrationBoundary>;
}
