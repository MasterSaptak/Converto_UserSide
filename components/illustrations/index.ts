/**
 * Illustration Design System — barrel exports & registry.
 * 
 * Usage:
 *   import { IllustrationRegistry } from "@/components/illustrations";
 *   const Illustration = IllustrationRegistry["exchange"];
 *   <Illustration size={64} accent="#EC4899" animated />
 * 
 * Adding a new illustration:
 *   1. Create the component file (e.g., NewService.tsx)
 *   2. Add one line to IllustrationRegistry below
 *   3. Done — Quick Actions picks it up automatically via `illustrationKey`
 */

export type { IllustrationProps } from "./types";
export { BaseIllustration } from "./BaseIllustration";
export { MotionWrapper } from "./MotionWrapper";

// ─── Individual illustration exports ───────────────────────

export { MoneyExchangeIllustration } from "./MoneyExchange";
export { BuyForMeIllustration } from "./BuyForMe";
export { TicketBookingIllustration } from "./TicketBooking";
export { EducationIllustration } from "./Education";
export { MoneyTransferIllustration } from "./MoneyTransfer";
export { TrackingIllustration } from "./Tracking";

// ─── Future-proof registry ─────────────────────────────────

import type { IllustrationProps } from "./types";
import type { ComponentType } from "react";

import { MoneyExchangeIllustration } from "./MoneyExchange";
import { BuyForMeIllustration } from "./BuyForMe";
import { TicketBookingIllustration } from "./TicketBooking";
import { EducationIllustration } from "./Education";
import { MoneyTransferIllustration } from "./MoneyTransfer";
import { TrackingIllustration } from "./Tracking";

/**
 * Registry mapping service keys → illustration components.
 * 
 * Quick Actions references an `illustrationKey` string.
 * To add a new service, add one entry here + the component file.
 */
export const IllustrationRegistry: Record<string, ComponentType<IllustrationProps>> = {
  exchange: MoneyExchangeIllustration,
  buy_for_me: BuyForMeIllustration,
  ticket_booking: TicketBookingIllustration,
  education: EducationIllustration,
  global_payments: MoneyTransferIllustration,
  track: TrackingIllustration,
};
