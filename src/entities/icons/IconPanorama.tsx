import { collapseTailwindClassName } from "@/utils/collapseTailwindClassName";
import React from "react";

export default function IconPanorama({ className = "" }: { className?: string }) {
  return (
    <div
      className={collapseTailwindClassName([
        "w-[24px] h-[24px]",
        className,
      ])}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 -960 960 960"
        fill="currentColor"
      >
        <path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm0-80h640v-480H160v480Zm80-80h480L570-520 450-360l-90-120-120 160Zm-80 80v-480 480Z" />
      </svg>
    </div>
  );
}
