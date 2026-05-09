// Design tokens — same BMW M palette as web, also exposed as TS so animations can use them
// Keep in sync with tailwind.config.js

export const colors = {
  canvas: "#000000",
  surfaceSoft: "#0d0d0d",
  surfaceCard: "#1a1a1a",
  surfaceElevated: "#262626",
  carbonGray: "#2b2b2b",
  mBlueLight: "#0066b1",
  mBlueDark: "#1c69d4",
  mRed: "#e22718",
  onDark: "#ffffff",
  body: "#bbbbbb",
  bodyStrong: "#e6e6e6",
  muted: "#7e7e7e",
  hairline: "#3c3c3c",
  hairlineStrong: "#262626",
  warning: "#f4b400",
  success: "#0fa336",
} as const;

// Reanimated easings — physical, controlled, never bouncy
export const ease = {
  expoOut: { damping: 18, stiffness: 120, mass: 1 },
  spring: { damping: 22, stiffness: 220, mass: 0.8 },
} as const;
