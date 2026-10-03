import type { ReactNode } from "react";

type IconName =
  | "landmark"
  | "arrow"
  | "external"
  | "trend"
  | "users"
  | "shield"
  | "school"
  | "briefcase"
  | "network"
  | "rocket"
  | "clock"
  | "video"
  | "calendar"
  | "check"
  | "play"
  | "menu"
  | "close"
  | "spark"
  | "quote"
  | "pin"
  | "chevron"
  | "book"
  | "headphones";

type IconProps = {
  name: IconName;
  size?: number;
  className?: string;
};

const drawings: Record<IconName, ReactNode> = {
  landmark: (
    <>
      <path d="M3 9h18M4.5 9v10M8.5 9v10M15.5 9v10M19.5 9v10M3 21h18M2 19h20M12 3 2 8h20L12 3Z" />
    </>
  ),
  arrow: <path d="M4 12h15m-6-6 6 6-6 6" />,
  external: (
    <>
      <path d="M14 4h6v6M20 4l-9 9" />
      <path d="M18 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6" />
    </>
  ),
  trend: (
    <>
      <path d="m3 17 6-6 4 4 8-9" />
      <path d="M15 6h6v6M4 21h16" />
    </>
  ),
  users: (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="10" cy="7" r="4" />
      <path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </>
  ),
  shield: (
    <>
      <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  school: (
    <>
      <path d="m2 10 10-6 10 6-10 6-10-6Z" />
      <path d="M6 12v5c3.5 3 8.5 3 12 0v-5M22 10v6" />
    </>
  ),
  briefcase: (
    <>
      <rect x="3" y="7" width="18" height="14" rx="2" />
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18M10 12v2h4v-2" />
    </>
  ),
  network: (
    <>
      <circle cx="12" cy="5" r="3" />
      <circle cx="5" cy="18" r="3" />
      <circle cx="19" cy="18" r="3" />
      <path d="m10.5 7.6-4 7.8m7-7.8 4 7.8M8 18h8" />
    </>
  ),
  rocket: (
    <>
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09Z" />
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 3c0 2.72-.78 7.5-5 11-.95.78-2.17 1.35-3.95 2Z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0m1 7v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
      <circle cx="16" cy="8" r="1" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  video: (
    <>
      <rect x="3" y="5" width="13" height="14" rx="2" />
      <path d="m16 10 5-3v10l-5-3" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4M8 3v4M3 10h18m-12 4h.01M12 14h.01M16 14h.01M8 17h.01M12 17h.01" />
    </>
  ),
  check: <path d="m5 12 4 4L19 6" />,
  play: <path d="m8 5 12 7-12 7V5Z" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  spark: (
    <>
      <path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2L12 3Z" />
      <path d="m19 14 1.2 2.8L23 18l-2.8 1.2L19 22l-1.2-2.8L15 18l2.8-1.2L19 14Z" />
    </>
  ),
  quote: <path d="M10 11H5.5A2.5 2.5 0 0 1 3 8.5V7a2 2 0 0 1 2-2h4v6c0 4-1.5 6-5 8m15-8h-4.5A2.5 2.5 0 0 1 12 8.5V7a2 2 0 0 1 2-2h4v6c0 4-1.5 6-5 8" />,
  pin: (
    <>
      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  chevron: <path d="m6 9 6 6 6-6" />,
  book: (
    <>
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5v-16Z" />
      <path d="M4 17a2 2 0 0 1 2-2h14M8 7h8m-8 4h6" />
    </>
  ),
  headphones: (
    <>
      <path d="M3 14v-3a9 9 0 0 1 18 0v3" />
      <path d="M5 13h2a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H6a3 3 0 0 1-3-3v-3a2 2 0 0 1 2-2Zm14 0h-2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h1a3 3 0 0 0 3-3v-3a2 2 0 0 0-2-2Z" />
    </>
  ),
};

export function Icon({ name, size = 22, className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {drawings[name]}
    </svg>
  );
}
