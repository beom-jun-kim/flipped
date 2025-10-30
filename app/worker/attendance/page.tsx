"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { WorkerHeader } from "@/components/worker/worker-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  checkIn,
  checkOut,
  getTodayAttendance,
  getUserAttendanceHistory,
  initializeMockAttendance,
  getAttendanceRecords,
  type AttendanceRecord,
} from "@/lib/attendance";
import { Clock, LogIn, LogOut, Calendar, TrendingUp } from "lucide-react";
import { AttendanceCalendar } from "@/components/worker/attendance-calendar";

export default function WorkerAttendancePage() {
  const router = useRouter();
  const user = useMemo(() => getCurrentUser(), []);
  const [todayRecord, setTodayRecord] = useState<AttendanceRecord | null>(null);
  const [history, setHistory] = useState<AttendanceRecord[]>([]);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setCurrentTime(new Date());
    setIsLoaded(true);

    if (!user) {
      router.push("/login");
      return;
    }
    if (user.role !== "worker") {
      router.push("/company/dashboard");
      return;
    }

    initializeMockAttendance();
    const today = getTodayAttendance(user.id);
    const userHistory = getUserAttendanceHistory(user.id, 10);
    setTodayRecord(today);
    setHistory(userHistory);

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, [user]);

  const reloadAttendanceData = () => {
    if (!user) return;
    const today = getTodayAttendance(user.id);
    const userHistory = getUserAttendanceHistory(user.id, 10);
    setTodayRecord(today);
    setHistory(userHistory);
    console.log("출퇴근 데이터 새로고침:", { today, userHistory }); // 테스트용 로그
  };

  const handleCheckIn = () => {
    if (!user) return;
    const newRecord = checkIn(user.id, user.name);
    console.log("출근 완료:", newRecord); // 테스트용 로그
    reloadAttendanceData();
  };

  const handleCheckOut = () => {
    if (!user) return;
    const updatedRecord = checkOut(user.id);
    console.log("퇴근 완료:", updatedRecord); // 테스트용 로그
    reloadAttendanceData();
  };

  const getStatusBadge = (status: AttendanceRecord["status"]) => {
    switch (status) {
      case "present":
        return (
          <Badge className="bg-[#23CCB7]/15 text-[#23CCB7] hover:bg-[#23CCB7]/15">
            정상 출근
          </Badge>
        );
      case "late":
        return (
          <Badge className="bg-[#FFBC0A]/15 text-[#FFBC0A] hover:bg-[#FFBC0A]/15">
            지각
          </Badge>
        );
      case "absent":
        return (
          <Badge className="bg-[#FF6262]/15 text-[#FF6262] hover:bg-[#FF6262]/15">
            결근
          </Badge>
        );
      case "leave":
        return (
          <Badge className="bg-[#7F6FFF]/15 text-[#7F6FFF] hover:bg-[#7F6FFF]/15">
            연차
          </Badge>
        );
    }
  };

  if (!isLoaded || !user) return null;

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <WorkerHeader />

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Statistics */}
        <div className="grid sm:grid-cols-3 gap-4">
          <Card className="border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#22ccb7]/10 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-[#23CCB7]" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">이번 달 출근</p>
                  <p className="text-2xl font-bold">18일</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#23CCB7]/15">
                  <TrendingUp className="w-5 h-5 text-[#23CCB7]" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">정상 출근</p>
                  <p className="text-2xl font-bold">16일</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#23CCB7]/15">
                  <Clock className="w-5 h-5 text-[#23CCB7]" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">지각</p>
                  <p className="text-2xl font-bold">2일</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Check In/Out Card */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="border-gray-200 gap-1">
            <CardHeader>
              <CardTitle className="text-lg">오늘의 출퇴근</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {todayRecord ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#23CCB7]/15">
                        <LogIn className="w-5 h-5 text-[#23CCB7]" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          출근 시간
                        </p>
                        <p className="text-xl font-bold">
                          {todayRecord.checkIn || "-"}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(todayRecord.status)}
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#23CCB7]/15">
                        <LogOut className="w-5 h-5 text-[#23CCB7]" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          퇴근 시간
                        </p>
                        <p className="text-xl font-bold">
                          {todayRecord.checkOut || "-"}
                        </p>
                      </div>
                    </div>
                    {todayRecord.workHours && (
                      <Badge className="bg-[#23CCB7]/15 text-[#23CCB7] hover:bg-[#23CCB7]/15">
                        {todayRecord.workHours}시간 근무
                      </Badge>
                    )}
                  </div>

                  {!todayRecord.checkOut && (
                    <Button
                      onClick={handleCheckOut}
                      className="w-full h-12 bg-[#22ccb7] hover:bg-[#1ab5a3] text-white cursor-pointer"
                    >
                      <LogOut className="w-5 h-5 mr-2" />
                      퇴근하기
                    </Button>
                  )}
                </div>
              ) : (
                <div className="text-center py-2">
                  <div className="w-16 h-16 bg-[#f4fdfc] rounded-full flex items-center justify-center mx-auto mb-4">
                    <LogIn className="w-8 h-8 text-[#22ccb7]" />
                  </div>
                  <p className="text-muted-foreground mb-4">
                    아직 출근하지 않았습니다
                  </p>
                  <Button
                    onClick={handleCheckIn}
                    className="h-12 px-8 bg-[#22ccb7] hover:bg-[#1ab5a3] text-white cursor-pointer"
                  >
                    <LogIn className="w-5 h-5 mr-2" />
                    출근하기
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          <AttendanceCalendar
            attendanceHistory={history}
            todayRecord={todayRecord}
            onDateSelect={(date) => {
              console.log("Selected date:", date);
            }}
          />
        </div>
      </main>
    </div>
  );
}
