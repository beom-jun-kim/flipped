"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { LucideIcon } from "lucide-react"

interface QuickActionCardProps {
  title: string
  description: string
  icon: LucideIcon
  onClick: () => void
  color?: string
}

export function QuickActionCard({ title, description, icon: Icon, onClick, color = "#22ccb7" }: QuickActionCardProps) {
  return (
    <Card className="border-gray-200 hover:shadow-md transition-shadow cursor-pointer" onClick={onClick}>
      <CardContent className="p-6">
        <div
          className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
          style={{ backgroundColor: `${color}15` }}
        >
          <Icon className="w-6 h-6" style={{ color }} />
        </div>
        <h3 className="font-semibold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        <Button
          onClick={(e) => {
            e.stopPropagation()
            onClick()
          }}
          className="w-full bg-[#22ccb7] hover:bg-[#1ab5a3] text-white cursor-pointer"
        >
          바로가기
        </Button>
      </CardContent>
    </Card>
  )
}
