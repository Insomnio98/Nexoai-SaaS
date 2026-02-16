export function Logo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer hexagon */}
      <path
        d="M50 5 L85 27.5 L85 72.5 L50 95 L15 72.5 L15 27.5 Z"
        stroke="url(#gradient1)"
        strokeWidth="3"
        fill="url(#gradient2)"
      />

      {/* Inner geometric pattern */}
      <path
        d="M50 25 L70 37.5 L70 62.5 L50 75 L30 62.5 L30 37.5 Z"
        fill="url(#gradient3)"
        opacity="0.8"
      />

      {/* Center element */}
      <circle
        cx="50"
        cy="50"
        r="15"
        fill="url(#gradient4)"
      />

      {/* Inner circle */}
      <circle
        cx="50"
        cy="50"
        r="8"
        fill="#0EA5E9"
      />

      {/* Gradients */}
      <defs>
        <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>

        <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1E40AF" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.3" />
        </linearGradient>

        <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="100%" stopColor="#A78BFA" />
        </linearGradient>

        <radialGradient id="gradient4">
          <stop offset="0%" stopColor="#0EA5E9" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.2" />
        </radialGradient>
      </defs>
    </svg>
  );
}

export function LogoText({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Logo className="h-8 w-8" />
      <span className="text-2xl font-bold tracking-tight">Nexoai</span>
    </div>
  );
}
