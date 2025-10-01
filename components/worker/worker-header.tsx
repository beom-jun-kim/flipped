"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getCurrentUser, logout } from "@/lib/auth";
import { getAccessibilitySettings, saveAccessibilitySettings, type FontSize, type ContrastMode, initializeAccessibility } from "@/lib/accessibility";
import { LogOut, Menu, Type, Contrast, X } from "lucide-react";
import { useState, useEffect } from "react";

export function WorkerHeader() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false);
  const [fontSize, setFontSize] = useState<FontSize | undefined>(undefined);
  const [contrastMode, setContrastMode] = useState<ContrastMode | undefined>(undefined);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setIsLoaded(true);
    
    initializeAccessibility();
    const settings = getAccessibilitySettings();
    setFontSize(settings.fontSize);
    setContrastMode(settings.contrastMode);
  }, []);

  const handleFontSizeChange = (size: FontSize) => {
    setFontSize(size);
    saveAccessibilitySettings({ fontSize: size, contrastMode: contrastMode || "normal" });
  };

  const handleContrastModeChange = (mode: ContrastMode) => {
    setContrastMode(mode);
    saveAccessibilitySettings({ fontSize: fontSize || "medium", contrastMode: mode });
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (!isLoaded || !user) return null;

  return (
    <header className="bg-[#22ccb7] border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            {/* <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-[#f4fdfc] rounded-lg cursor-pointer transition-colors"
              aria-label="메뉴 열기"
            >
              <Menu className="w-5 h-5 text-[#22ccb7]" />
            </button> */}
            <div className="w-24 bg-[#22ccb7] flex items-center justify-center">
              <img
                src="https://xn--5y2bj31c.com/static/media/logo_basic.f40d41f4044bb64fb975b46bdf59bd3b.svg"
                alt="logo"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-white">{user.name}</p>
              <p className="text-xs text-white">{user.department}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAccessibilityOpen(!isAccessibilityOpen)}
              className="flex items-center gap-2 border-white text-white cursor-pointer bg-transparent outline-none"
              aria-label="접근성 설정"
            >
              <Type className="w-4 h-4" />
              <span className="hidden sm:inline">장애우 맞춤 기능</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="flex items-center gap-2 border-white text-white cursor-pointer bg-transparent outline-none"
              aria-label="로그아웃"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">로그아웃</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Accessibility Panel */}
      {isAccessibilityOpen && isLoaded && (
        <div className="absolute top-16 right-4 z-50 w-80 animate-in slide-in-from-top-4">
          <Card className="border-[#22ccb7]/20 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">접근성 설정</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsAccessibilityOpen(false)}
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
    </header>
  );
}
