import { collapseTailwindClassName } from "@/utils/collapseTailwindClassName";
import React from "react";

export default function IconRoadMap({
    className = "",
}: {
    className?: string;
}) {
  return (
    <div className={collapseTailwindClassName(["w-[24px] h-[24px]", className])}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 -960 960 960"
        fill="currentColor"
      >
        <path d="M160-160v-640h80v640h-80Zm280 0v-160h80v160h-80Zm280 0v-640h80v640h-80ZM440-400v-160h80v160h-80Zm0-240v-160h80v160h-80Z" />
      </svg>
    </div>
  );
}
