"use client"

export type FontSize = "small" | "medium" | "large" | "xlarge"
export type ContrastMode = "normal" | "high"

export interface AccessibilitySettings {
  fontSize: FontSize
  contrastMode: ContrastMode
}

const ACCESSIBILITY_KEY = "accessibility_settings"

const DEFAULT_SETTINGS: AccessibilitySettings = {
  fontSize: "medium",
  contrastMode: "normal",
}

export function getAccessibilitySettings(): AccessibilitySettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS
  const data = localStorage.getItem(ACCESSIBILITY_KEY)
  return data ? JSON.parse(data) : DEFAULT_SETTINGS
}

export function saveAccessibilitySettings(settings: AccessibilitySettings): void {
  if (typeof window === "undefined") return
  localStorage.setItem(ACCESSIBILITY_KEY, JSON.stringify(settings))
  applyAccessibilitySettings(settings)
}

export function applyAccessibilitySettings(settings: AccessibilitySettings): void {
  if (typeof window === "undefined") return

  const root = document.documentElement

  // 폰트 크기 적용
  switch (settings.fontSize) {
    case "small":
      root.style.fontSize = "14px"
      break
    case "medium":
      root.style.fontSize = "16px"
      break
    case "large":
      root.style.fontSize = "18px"
      break
    case "xlarge":
      root.style.fontSize = "20px"
      break
  }

  // 고대비 모드 적용
  if (settings.contrastMode === "high") {
    root.classList.add("high-contrast")
  } else {
    root.classList.remove("high-contrast")
  }
}

export function initializeAccessibility(): void {
  const settings = getAccessibilitySettings()
  applyAccessibilitySettings(settings)
}
