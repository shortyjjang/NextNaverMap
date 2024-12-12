import { collapseTailwindClassName } from "@/utils/collapseTailwindClassName";
import React, { forwardRef } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

function Button(
  { children, className = "", ...props }: ButtonProps,
  ref: React.Ref<HTMLButtonElement>
) {
  return (
    <button
      {...props}
      ref={ref}
      className={collapseTailwindClassName([
        "rounded-md border border-gray-300 px-4 py-2 bg-white text-gray-600",
        className,
      ])}
    >
      {children}
    </button>
  );
}
export default forwardRef(Button);
