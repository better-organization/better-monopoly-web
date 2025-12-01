export function FieldLines() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none z-10"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      {/* Outer boundary - Full pitch */}
      <rect
        x="2"
        y="2"
        width="96"
        height="96"
        fill="none"
        stroke="white"
        strokeWidth="0.5"
        opacity="0.6"
      />

      {/* Halfway line - Horizontal across vertical pitch */}
      <line
        x1="2"
        y1="50"
        x2="98"
        y2="50"
        stroke="white"
        strokeWidth="0.5"
        opacity="0.6"
      />

      {/* Center circle */}
      <circle
        cx="50"
        cy="50"
        r="10"
        fill="none"
        stroke="white"
        strokeWidth="0.5"
        opacity="0.6"
      />
      <circle
        cx="50"
        cy="50"
        r="0.6"
        fill="white"
        opacity="0.7"
      />

      {/* Top penalty area (vertical pitch orientation) */}
      <rect
        x="20"
        y="2"
        width="60"
        height="16"
        fill="none"
        stroke="white"
        strokeWidth="0.5"
        opacity="0.6"
      />

      {/* Top goal area */}
      <rect
        x="35"
        y="2"
        width="30"
        height="6"
        fill="none"
        stroke="white"
        strokeWidth="0.5"
        opacity="0.6"
      />

      {/* Bottom penalty area */}
      <rect
        x="20"
        y="82"
        width="60"
        height="16"
        fill="none"
        stroke="white"
        strokeWidth="0.5"
        opacity="0.6"
      />

      {/* Bottom goal area */}
      <rect
        x="35"
        y="92"
        width="30"
        height="6"
        fill="none"
        stroke="white"
        strokeWidth="0.5"
        opacity="0.6"
      />

      {/* Penalty spots */}
      <circle cx="50" cy="13" r="0.6" fill="white" opacity="0.7" />
      <circle cx="50" cy="87" r="0.6" fill="white" opacity="0.7" />

      {/* Penalty arcs */}
      <path
        d="M 40 18 A 10 10 0 0 0 60 18"
        fill="none"
        stroke="white"
        strokeWidth="0.5"
        opacity="0.6"
      />
      <path
        d="M 40 82 A 10 10 0 0 1 60 82"
        fill="none"
        stroke="white"
        strokeWidth="0.5"
        opacity="0.6"
      />

      {/* Corner arcs */}
      <path d="M 2 4 A 2 2 0 0 0 4 2" fill="none" stroke="white" strokeWidth="0.5" opacity="0.6" />
      <path d="M 96 2 A 2 2 0 0 0 98 4" fill="none" stroke="white" strokeWidth="0.5" opacity="0.6" />
      <path d="M 98 96 A 2 2 0 0 0 96 98" fill="none" stroke="white" strokeWidth="0.5" opacity="0.6" />
      <path d="M 4 98 A 2 2 0 0 0 2 96" fill="none" stroke="white" strokeWidth="0.5" opacity="0.6" />
    </svg>
  );
}

