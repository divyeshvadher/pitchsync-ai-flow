
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

const tagVariants = cva(
  "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset",
  {
    variants: {
      variant: {
        default: "bg-gray-50 text-gray-600 ring-gray-500/10",
        primary: "bg-blue-50 text-blue-700 ring-blue-700/10",
        secondary: "bg-gray-50 text-gray-600 ring-gray-500/10",
        destructive: "bg-red-50 text-red-700 ring-red-600/10",
        success: "bg-green-50 text-green-700 ring-green-600/10",
        warning: "bg-yellow-50 text-yellow-800 ring-yellow-600/20",
        info: "bg-sky-50 text-sky-700 ring-sky-700/10",
        outline: "bg-transparent text-gray-700 ring-gray-700/10",
        "ai": "bg-purple-50 text-purple-700 ring-purple-700/10",
        "climate": "bg-green-50 text-green-700 ring-green-600/10",
        "fintech": "bg-blue-50 text-blue-700 ring-blue-700/10",
        "health": "bg-cyan-50 text-cyan-700 ring-cyan-700/10",
        "edtech": "bg-yellow-50 text-yellow-800 ring-yellow-600/20",
      },
      removable: {
        true: "pr-1"
      }
    },
    defaultVariants: {
      variant: "default",
      removable: false
    }
  }
);

export interface TagProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof tagVariants> {
  removable?: boolean;
  onRemove?: () => void;
}

const Tag = React.forwardRef<HTMLSpanElement, TagProps>(
  ({ className, variant, removable, onRemove, children, ...props }, ref) => {
    return (
      <span
        className={cn(tagVariants({ variant, removable }), className)}
        ref={ref}
        {...props}
      >
        {children}
        {removable && (
          <button
            type="button"
            className="ml-1 inline-flex items-center justify-center rounded-md p-0.5 hover:bg-gray-200/50"
            onClick={onRemove}
          >
            <X className="h-3 w-3" />
            <span className="sr-only">Remove</span>
          </button>
        )}
      </span>
    );
  }
);

Tag.displayName = "Tag";

export { Tag, tagVariants };
