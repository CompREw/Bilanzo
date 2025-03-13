import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-300 shadow-md disabled:pointer-events-none disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
        destructive: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-400",
        outline: "border border-gray-300 text-gray-700 hover:bg-gray-100",
        secondary: "bg-gray-500 text-white hover:bg-gray-600",
        ghost: "hover:bg-gray-200 text-gray-700",
        link: "text-blue-600 underline hover:text-blue-700",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 px-4",
        lg: "h-12 px-6 text-lg",
        icon: "p-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props} />
  );
}

export { Button, buttonVariants }
