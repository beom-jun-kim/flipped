"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  getAccessibilitySettings,
  saveAccessibilitySettings,
  type FontSize,
  type ContrastMode,
  initializeAccessibility,
} from "@/lib/accessibility"
import { Type, Contrast, X } from "lucide-react"

export function AccessibilityToolbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [fontSize, setFontSize] = useState<FontSize | undefined>(undefined)
  const [contrastMode, setContrastMode] = useState<ContrastMode | undefined>(undefined)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    initializeAccessibility()
    const settings = getAccessibilitySettings()
    setFontSize(settings.fontSize)
    setContrastMode(settings.contrastMode)
    setIsLoaded(true)
  }, [])

  const handleFontSizeChange = (size: FontSize) => {
    setFontSize(size)
    saveAccessibilitySettings({ fontSize: size, contrastMode: contrastMode || "normal" })
  }

  const handleContrastModeChange = (mode: ContrastMode) => {
    setContrastMode(mode)
    saveAccessibilitySettings({ fontSize: fontSize || "medium", contrastMode: mode })
  }

  // 하이드레이션 오류 방지를 위해 로드 완료 후에만 렌더링
  if (!isLoaded) {
    return null
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#22ccb7] hover:bg-[#1ab5a3] text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 cursor-pointer"
        aria-label="접근성 도구 열기"
      >
        <Type className="w-6 h-6" />
      </button>

      {/* Toolbar Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 animate-in slide-in-from-bottom-4">
          <Card className="border-[#22ccb7]/20 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">접근성 설정</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8 p-0 cursor-pointer"
                  aria-label="닫기"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Font Size Control */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Type className="w-4 h-4 text-[#22ccb7]" />
                  <label className="text-sm font-medium">글자 크기</label>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={fontSize === "small" ? "default" : "outline"}
                    onClick={() => handleFontSizeChange("small")}
                    className={`cursor-pointer flex-1 min-w-0 ${fontSize === "small" ? "bg-[#22ccb7] hover:bg-[#1ab5a3]" : "border-[#22ccb7]/30 hover:bg-[#f4fdfc]"}`}
                  >
                    작게
                  </Button>
                  <Button
                    variant={fontSize === "medium" ? "default" : "outline"}
                    onClick={() => handleFontSizeChange("medium")}
                    className={`cursor-pointer flex-1 min-w-0 ${fontSize === "medium" ? "bg-[#22ccb7] hover:bg-[#1ab5a3]" : "border-[#22ccb7]/30 hover:bg-[#f4fdfc]"}`}
                  >
                    보통
                  </Button>
                  <Button
                    variant={fontSize === "large" ? "default" : "outline"}
                    onClick={() => handleFontSizeChange("large")}
                    className={`cursor-pointer flex-1 min-w-0 ${fontSize === "large" ? "bg-[#22ccb7] hover:bg-[#1ab5a3]" : "border-[#22ccb7]/30 hover:bg-[#f4fdfc]"}`}
                  >
                    크게
                  </Button>
                  <Button
                    variant={fontSize === "xlarge" ? "default" : "outline"}
                    onClick={() => handleFontSizeChange("xlarge")}
                    className={`cursor-pointer flex-2 min-w-0 ${fontSize === "xlarge" ? "bg-[#22ccb7] hover:bg-[#1ab5a3]" : "border-[#22ccb7]/30 hover:bg-[#f4fdfc]"}`}
                  >
                    매우 크게
                  </Button>
                </div>
              </div>

              {/* Contrast Mode Control */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <Contrast className="w-4 h-4 text-[#22ccb7]" />
                  <label className="text-sm font-medium">대비 모드</label>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={contrastMode === "normal" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleContrastModeChange("normal")}
                    className={`cursor-pointer ${contrastMode === "normal" ? "bg-[#22ccb7] hover:bg-[#1ab5a3]" : "border-[#22ccb7]/30 hover:bg-[#f4fdfc]"}`}
                  >
                    일반
                  </Button>
                  <Button
                    variant={contrastMode === "high" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleContrastModeChange("high")}
                    className={`cursor-pointer ${contrastMode === "high" ? "bg-[#22ccb7] hover:bg-[#1ab5a3]" : "border-[#22ccb7]/30 hover:bg-[#f4fdfc]"}`}
                  >
                    고대비
                  </Button>
                </div>
              </div>

              <p className="text-xs text-muted-foreground mt-4">
                설정은 자동으로 저장되며 다음 방문 시에도 유지됩니다.
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
