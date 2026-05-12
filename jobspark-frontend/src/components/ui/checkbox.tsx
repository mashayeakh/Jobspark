"use client"

import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

const Checkbox = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { defaultChecked?: boolean }
>(({ className, defaultChecked, checked: controlledChecked, ...props }, ref) => {
  const [internalChecked, setInternalChecked] = React.useState(defaultChecked || false)
  const isControlled = controlledChecked !== undefined
  const checked = isControlled ? controlledChecked : internalChecked

  return (
    <div
      onClick={() => {
        if (!isControlled) {
          setInternalChecked(!internalChecked)
        }
      }}
      className={cn(
        "peer h-5 w-5 shrink-0 rounded-md border-2 border-[#4880FF] ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 cursor-pointer flex items-center justify-center",
        checked ? "bg-[#4880FF] text-white border-[#4880FF]" : "bg-transparent border-gray-200",
        className
      )}
    >
      {checked && <Check className="h-3.5 w-3.5 font-black animate-in zoom-in-50 duration-200" />}
      <input
        type="checkbox"
        ref={ref}
        checked={checked}
        className="sr-only"
        readOnly
        {...props}
      />
    </div>
  )
})
Checkbox.displayName = "Checkbox"

export { Checkbox }
