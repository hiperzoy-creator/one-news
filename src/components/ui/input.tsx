import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400",
        "focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    />
  )
}

export { Input }
