import { Badge } from "@/components/ui/badge"

type BadgeVariant = "default" | "secondary" | "destructive" | "outline"

interface BadgeCellProps {
  value: string | number | null | undefined
  variant?: BadgeVariant
}

export default function BadgeCell({ value, variant = "default" }: BadgeCellProps) {
  if (!value) return null

  return (
    <Badge variant={variant} className="capitalize">
      {value}
    </Badge>
  )
}
