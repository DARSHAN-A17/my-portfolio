import React, { useRef, useState } from "react";
import type { MouseEvent, ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  glowColor?: string;
  backgroundColor?: string;
  textColor?: string;
  hoverTextColor?: string;
}

const HoverButton: React.FC<ButtonProps> = ({
  children,
  onClick,
  className = "",
  disabled = false,
  glowColor = "#D9A85C",
  backgroundColor = "#0B0B0B",
  textColor = "#F1EDE8",
  hoverTextColor = "#D9A85C",
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [glowPosition, setGlowPosition] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLButtonElement>) => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setGlowPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
  };

  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 400);
    onClick?.();
  };

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      disabled={disabled}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        group relative inline-flex items-center justify-center
        overflow-hidden cursor-pointer
        rounded-full
        transition-all duration-300 ease-out
        z-10
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        ${className}
      `}
      style={{
        backgroundColor,
        color: isHovered ? hoverTextColor : textColor,
        border: "1px solid rgba(184,115,51,0.18)",
        boxShadow: isHovered
          ? "0 4px 24px rgba(0,0,0,0.5), 0 0 16px rgba(184,115,51,0.08), inset 0 1px 0 rgba(237,233,224,0.03)"
          : "0 2px 12px rgba(0,0,0,0.4), inset 0 1px 0 rgba(237,233,224,0.02)",
        transform: isClicked
          ? "scale(0.97)"
          : isHovered
          ? "translateY(-2px) scale(1.02)"
          : "translateY(0) scale(1)",
      }}
    >
      {/* Mouse-following glow */}
      <div
        className="pointer-events-none absolute w-[220px] h-[220px] rounded-full opacity-60 -translate-x-1/2 -translate-y-1/2 transition-transform duration-300 ease-out"
        style={{
          left: `${glowPosition.x}px`,
          top: `${glowPosition.y}px`,
          background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
          transform: isHovered ? "scale(1.2)" : "scale(0)",
          opacity: isClicked ? 0.9 : isHovered ? 0.5 : 0,
          zIndex: 0,
        }}
      />

      {/* Top edge highlight on hover */}
      <span
        className="absolute left-[15%] right-[15%] top-0 h-px pointer-events-none transition-opacity duration-300"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(184,115,51,0.5), transparent)",
          opacity: isHovered ? 1 : 0,
        }}
      />

      {/* Bottom edge highlight on hover */}
      <span
        className="absolute left-[25%] right-[25%] bottom-0 h-px pointer-events-none transition-opacity duration-500"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(184,115,51,0.15), transparent)",
          opacity: isHovered ? 1 : 0,
        }}
      />

      {/* Content */}
      <span
        className="relative z-10 flex items-center gap-2.5"
        style={{
          padding: "14px 32px",
          fontFamily: "ui-monospace, monospace",
          fontSize: "11px",
          fontWeight: 700,
          letterSpacing: "0.22em",
        }}
      >
        {children}
        <span
          className="inline-block transition-transform duration-300 ease-out"
          style={{
            transform: isHovered ? "translateX(4px)" : "translateX(0)",
            color: isHovered ? "#E8C9A0" : "#D9A85C",
          }}
        >
          →
        </span>
      </span>

      {/* Ambient border glow */}
      <span
        className="absolute inset-0 rounded-full pointer-events-none transition-opacity duration-300"
        style={{
          border: "1px solid rgba(184,115,51,0.12)",
          opacity: isHovered ? 0 : 1,
        }}
      />
    </button>
  );
};

export { HoverButton };







