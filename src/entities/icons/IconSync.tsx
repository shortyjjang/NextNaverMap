import { collapseTailwindClassName } from "@/utils/collapseTailwindClassName";
import React from "react";

export default function IconSync({ className = '' }: { className?: string }) {
  return (
    <div className={collapseTailwindClassName(["w-[24px] h-[24px]", className])}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 -960 960 960"
        className="w-full h-full"
        fill="currentColor"
      >
        <path d="M160-160v-80h110l-16-14q-52-46-73-105t-21-119q0-111 66.5-197.5T400-790v84q-72 26-116 88.5T240-478q0 45 17 87.5t53 78.5l10 10v-98h80v240H160Zm400-10v-84q72-26 116-88.5T720-482q0-45-17-87.5T650-648l-10-10v98h-80v-240h240v80H690l16 14q49 49 71.5 106.5T800-482q0 111-66.5 197.5T560-170Z" />
      </svg>
    </div>
  );
}
