"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { setCheckInPopupDelay } from "@/lib/attendance";
import { Clock, X, LogIn } from "lucide-react";

interface CheckInPopupProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  userId: string;
}

export function CheckInPopup({ isOpen, onClose, userName, userId }: CheckInPopupProps) {
  const router = useRouter();
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 200);
  };

  const handleCheckIn = () => {
    router.push("/worker/attendance");
  };

  const handleLater = () => {
    // 5시간 후에 다시 팝업이 나타나도록 설정
    setCheckInPopupDelay(userId, 5);
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className={`absolute inset-0 bg-black/50 transition-opacity duration-200 ${
          isClosing ? "opacity-0" : "opacity-100"
        }`}
        onClick={handleClose}
      />
      
      {/* Popup */}
      <Card className={`relative z-10 w-full max-w-md mx-4 transform transition-all duration-200 ${
        isClosing ? "scale-95 opacity-0" : "scale-100 opacity-100"
      }`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#22ccb7]/10 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-[#22ccb7]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">출근 확인</h3>
                <p className="text-sm text-muted-foreground">오늘 출근하셨나요?</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-8 w-8 p-0 hover:bg-gray-100"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-4">
            <p className="text-center text-muted-foreground">
              안녕하세요, <span className="font-semibold text-foreground">{userName}</span>님!<br />
              아직 출근하지 않으셨습니다.
            </p>
            
             <div className="flex gap-3">
               <Button
                 variant="outline"
                 onClick={handleLater}
                 className="flex-1 cursor-pointer"
               >
                 나중에 (5시간 후)
               </Button>
              <Button
                onClick={handleCheckIn}
                className="flex-1 bg-[#22ccb7] hover:bg-[#1ab5a3] text-white cursor-pointer"
              >
                <LogIn className="w-4 h-4 mr-2" />
                출근하기
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
