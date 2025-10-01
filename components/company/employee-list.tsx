import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Clock, CheckCircle2, XCircle } from "lucide-react"

interface Employee {
  id: string
  name: string
  department: string
  position: string
  status: "present" | "absent" | "leave"
  checkIn?: string
  checkOut?: string
}

const MOCK_EMPLOYEES: Employee[] = [
  {
    id: "1",
    name: "김근로",
    department: "개발팀",
    position: "사원",
    status: "present",
    checkIn: "09:00",
  },
  {
    id: "2",
    name: "이직원",
    department: "디자인팀",
    position: "대리",
    status: "present",
    checkIn: "08:55",
  },
  {
    id: "3",
    name: "박사원",
    department: "마케팅팀",
    position: "사원",
    status: "leave",
  },
  {
    id: "4",
    name: "최근무",
    department: "개발팀",
    position: "주임",
    status: "present",
    checkIn: "09:10",
  },
  {
    id: "5",
    name: "정출근",
    department: "영업팀",
    position: "과장",
    status: "absent",
  },
]

const getStatusBadge = (status: Employee["status"]) => {
  switch (status) {
    case "present":
      return (
        <Badge className="bg-[#23CCB7]/15 text-[#23CCB7] hover:bg-[#23CCB7]/15">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          출근
        </Badge>
      )
    case "absent":
      return (
        <Badge className="bg-[#23CCB7]/15 text-[#23CCB7] hover:bg-[#23CCB7]/15">
          <XCircle className="w-3 h-3 mr-1" />
          미출근
        </Badge>
      )
    case "leave":
      return (
        <Badge className="bg-[#23CCB7]/15 text-[#23CCB7] hover:bg-[#23CCB7]/15">
          <Clock className="w-3 h-3 mr-1" />
          연차
        </Badge>
      )
  }
}

export function EmployeeList() {
  return (
    <Card className="border-gray-200">
      <CardHeader>
        <CardTitle className="text-lg">직원 출근 현황</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {MOCK_EMPLOYEES.map((employee) => (
            <div
              key={employee.id}
              className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Avatar className="h-10 w-10 bg-[#22ccb7] text-white">
                <AvatarFallback className="bg-[#22ccb7] text-white">{employee.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{employee.name}</p>
                <p className="text-xs text-muted-foreground">
                  {employee.department} · {employee.position}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {employee.checkIn && (
                  <span className="text-xs text-muted-foreground hidden sm:inline">출근: {employee.checkIn}</span>
                )}
                {getStatusBadge(employee.status)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
