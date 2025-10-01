"use client";

import type React from "react";
import { useEffect, useState, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { WorkerHeader } from "@/components/worker/worker-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getUserTasks, type Task } from "@/lib/tasks";
import {
  Briefcase,
  Calendar,
  ArrowLeft,
  User,
  Clock,
  FileText,
} from "lucide-react";

export default function TaskDetailPage() {
  const router = useRouter();
  const params = useParams();
  const user = useMemo(() => getCurrentUser(), []);
  const [task, setTask] = useState<Task | null>(null);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    if (user.role !== "worker") {
      router.push("/company/dashboard");
      return;
    }

    const userTasks = getUserTasks(user.id);
    const foundTask = userTasks.find((task) => task.id === params.id);

    if (foundTask) {
      setTask(foundTask);
    } else {
      router.push("/worker/tasks");
    }
  }, [user, params.id]);

  if (!user || !task) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <WorkerHeader />

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">업무지시 상세</h2>
            <p className="text-muted-foreground">업무지시 내용을 확인하세요</p>
          </div>
        </div>

        {/* Task Detail */}
        <Card className="border-gray-200 bg-white">
          <CardHeader className="border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#22ccb7]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Briefcase className="w-6 h-6 text-[#22ccb7]" />
                </div>
                <div>
                  <CardTitle className="text-xl mb-2">{task.title}</CardTitle>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    {/* <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#22ccb7]" />
                      <span>지시일: {task.dueDate}</span>
                    </div> */}
                    {/* <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-[#22ccb7]" />
                      <span>지시자: {task.assignedByName}</span>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            {/* 업무 내용 */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-800">
                업무 내용
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm whitespace-pre-wrap leading-relaxed">
                  {task.description}
                </p>
              </div>
            </div>

            {/* 업무 정보 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  담당자
                </h4>
                <p className="text-sm">{task.assignedToName}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700">생성일</h4>
                <p className="text-sm">
                  {new Date(task.createdAt).toLocaleDateString("ko-KR")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 목록으로 버튼 */}
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={() => router.push("/worker/tasks")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            목록으로
          </Button>
        </div>
      </main>
    </div>
  );
}
