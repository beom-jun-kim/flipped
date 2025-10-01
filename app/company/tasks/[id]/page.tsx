"use client";

import type React from "react";
import { useEffect, useState, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { CompanyHeader } from "@/components/company/company-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getAllTasks, deleteTask, type Task } from "@/lib/tasks";
import {
  Briefcase,
  Calendar,
  ArrowLeft,
  User,
  Trash2,
  Edit,
} from "lucide-react";

export default function CompanyTaskDetailPage() {
  const router = useRouter();
  const params = useParams();
  const user = useMemo(() => getCurrentUser(), []);
  const [task, setTask] = useState<Task | null>(null);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    if (user.role !== "company") {
      router.push("/worker/dashboard");
      return;
    }

    const allTasks = getAllTasks();
    const foundTask = allTasks.find((task) => task.id === params.id);

    if (foundTask) {
      setTask(foundTask);
    } else {
      router.push("/company/tasks");
    }
  }, [user, params.id]);

  const handleDelete = () => {
    if (!task || !confirm("정말로 이 업무지시를 삭제하시겠습니까?")) return;
    
    deleteTask(task.id);
    router.push("/company/tasks");
  };

  if (!user || !task) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <CompanyHeader />

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">업무지시 상세</h2>
            <p className="text-muted-foreground">업무지시 내용을 확인하고 관리하세요</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => router.push("/company/tasks")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              목록으로
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="flex items-center gap-2 bg-[#22ccb7]"
            >
              <Trash2 className="w-4 h-4" />
              삭제하기
            </Button>
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
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-[#22ccb7]" />
                      <span>근로자: {task.assignedToName}</span>
                    </div>
                    {/* <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#22ccb7]" />
                      <span>지시일: {task.dueDate}</span>
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
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  지시일
                </h4>
                <p className="text-sm">
                  {new Date(task.createdAt).toLocaleDateString("ko-KR")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
