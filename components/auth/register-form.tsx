"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { register, type UserRole } from "@/lib/auth";
import { AlertCircle, Search, CheckCircle, Calendar } from "lucide-react";

export function RegisterForm() {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>("worker");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [department, setDepartment] = useState("");
  const [email, setEmail] = useState("");
  const [emailDomain, setEmailDomain] = useState("");
  const [phone, setPhone] = useState("");
  const [disabilityLevel, setDisabilityLevel] = useState("");
  const [disabilityType, setDisabilityType] = useState("");
  const [subDisabilityType, setSubDisabilityType] = useState("");
  const [startHour, setStartHour] = useState("");
  const [startMinute, setStartMinute] = useState("");
  const [endHour, setEndHour] = useState("");
  const [endMinute, setEndMinute] = useState("");
  const [agreeAll, setAgreeAll] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [usernameChecked, setUsernameChecked] = useState(false);
  const [emailChecked, setEmailChecked] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [birthDate, setBirthDate] = useState("");

  // 중복확인 함수들
  const handleUsernameCheck = () => {
    if (!username) {
      setError("아이디를 입력해주세요.");
      return;
    }
    // 실제로는 API 호출
    setUsernameChecked(true);
    setError("");
  };

  const handleEmailCheck = () => {
    if (!email || !emailDomain) {
      setError("이메일을 입력해주세요.");
      return;
    }
    // 실제로는 API 호출
    setEmailChecked(true);
    setError("");
  };

  const handleCompanySearch = () => {
    if (!company) {
      setError("회사명을 입력해주세요.");
      return;
    }
    // 실제로는 API 호출
    setError("");
  };

  const handlePhoneVerification = () => {
    if (!phone) {
      setError("휴대폰번호를 입력해주세요.");
      return;
    }
    // 실제로는 API 호출
    setVerificationSent(true);
    setError("");
  };

  // 약관 동의 처리
  const handleAgreeAll = (checked: boolean) => {
    setAgreeAll(checked);
    setAgreeTerms(checked);
    setAgreePrivacy(checked);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // 필수 필드 검증
    if (!name) {
      setError("이름을 입력해주세요.");
      return;
    }
    if (!company) {
      setError("회사명을 입력해주세요.");
      return;
    }
    if (!username) {
      setError("아이디를 입력해주세요.");
      return;
    }
    if (!usernameChecked) {
      setError("아이디 중복확인을 해주세요.");
      return;
    }
    if (!password) {
      setError("비밀번호를 입력해주세요.");
      return;
    }
    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }
    if (!email || !emailDomain) {
      setError("이메일을 입력해주세요.");
      return;
    }
    if (!emailChecked) {
      setError("이메일 중복확인을 해주세요.");
      return;
    }
    if (!phone) {
      setError("휴대폰번호를 입력해주세요.");
      return;
    }
    if (role === "company" && !birthDate) {
      setError("생년월일을 입력해주세요.");
      return;
    }
    if (!agreeTerms || !agreePrivacy) {
      setError("필수 약관에 동의해주세요.");
      return;
    }

    setIsLoading(true);

    try {
      const success = register(username, password, role, name, {
        company,
        department,
      });

      if (success) {
        alert("회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.");
        router.push("/login");
      } else {
        setError("이미 존재하는 아이디입니다.");
      }
    } catch (err) {
      setError("회원가입 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-sm">
      {/* 헤더 */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">
          <span className="text-[#22ccb7]">회원가입</span>
          <span className="text-gray-500">
            {role === "worker" ? " (개인회원)" : " (기업회원)"}
          </span>
        </h1>
        <p className="text-gray-600">플립에 오신 것을 환영합니다.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 계정 유형 선택 */}
        <div className="space-y-1 flex flex-col">
          <Label className="text-base font-medium">계정 유형</Label>
          <RadioGroup
            value={role}
            onValueChange={(value) => {
              if (value === "worker" || value === "company") {
                setRole(value)
              }
            }}
          >
            <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-[#f4fdfc] transition-colors">
              <RadioGroupItem value="worker" id="worker" />
              <Label htmlFor="worker" className="flex-1 cursor-pointer">
                근로자 (장애인)
              </Label>
            </div>
            <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-[#f4fdfc] transition-colors">
              <RadioGroupItem value="company" id="company" />
              <Label htmlFor="company" className="flex-1 cursor-pointer">
                기업 (인사담당자)
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* 이름 */}
        <div className="space-y-1 flex flex-col">
          <Label htmlFor="name" className="text-base font-medium">
            이름
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="이름을 입력해주세요."
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="h-12 text-base border-gray-300"
          />
        </div>

        {/* 회사명 검색 */}
        <div className="space-y-1 flex flex-col">
          <Label htmlFor="company" className="text-base font-medium">
            회사명
          </Label>
          <div className="flex gap-2">
            <Input
              id="company"
              type="text"
              placeholder="회사명을 검색해주세요."
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="h-12 text-base border-gray-300 flex-1"
            />
            <Button
              type="button"
              onClick={handleCompanySearch}
              className="h-12 px-6 bg-[#22ccb7] hover:bg-[#1ab5a3] text-white"
            >
              {/* <Search className="w-4 h-4 mr-2" /> */}
              검색
            </Button>
          </div>
        </div>

        {/* 아이디 중복확인 */}
        <div className="space-y-1 flex flex-col">
          <Label htmlFor="username" className="text-base font-medium">
            아이디
          </Label>
          <div className="flex gap-2">
            <Input
              id="username"
              type="text"
              placeholder="아이디를 입력해주세요."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="h-12 text-base border-gray-300 flex-1"
            />
            <Button
              type="button"
              onClick={handleUsernameCheck}
              className="h-12 px-6 bg-[#22ccb7] hover:bg-[#1ab5a3] text-white"
            >
              중복확인
            </Button>
          </div>
          {usernameChecked && (
            <div className="flex items-center text-green-600 text-sm">
              <CheckCircle className="w-4 h-4 mr-1" />
              사용 가능한 아이디입니다.
            </div>
          )}
        </div>

        {/* 비밀번호 */}
        <div className="space-y-1 flex flex-col">
          <Label htmlFor="password" className="text-base font-medium">
            비밀번호
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="!,@,#,$,%를 포함한 비밀번호를 입력해주세요.(영문/숫자/특수문자 조합 6~15자)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="h-12 text-base border-gray-300"
          />
        </div>

        {/* 비밀번호 확인 */}
        <div className="space-y-1 flex flex-col">
          <Label htmlFor="confirmPassword" className="text-base font-medium">
            비밀번호 확인
          </Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="비밀번호를 한번 더 입력해주세요."
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="h-12 text-base border-gray-300"
          />
        </div>

        {/* 이메일 */}
        <div className="space-y-1 flex flex-col">
          <Label className="text-base font-medium">이메일</Label>
          <div className="space-y-2">
            {/* 데스크톱 레이아웃 */}
            <div className="hidden sm:flex gap-2 items-center">
              <Input
                type="text"
                placeholder="이메일 주소를 입력해주세요."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 text-base border-gray-300 flex-1"
              />
              <span className="text-gray-500">@</span>
              <Input
                type="text"
                placeholder="선택해주세요"
                value={emailDomain}
                onChange={(e) => setEmailDomain(e.target.value)}
                className="h-12 text-base border-gray-300 flex-1"
              />
              <Select onValueChange={setEmailDomain}>
                <SelectTrigger className="h-12 w-24 border-gray-300">
                  <SelectValue placeholder="선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gmail.com">gmail.com</SelectItem>
                  <SelectItem value="naver.com">naver.com</SelectItem>
                  <SelectItem value="daum.net">daum.net</SelectItem>
                  <SelectItem value="hanmail.net">hanmail.net</SelectItem>
                </SelectContent>
              </Select>
              <Button
                type="button"
                onClick={handleEmailCheck}
                className="h-12 px-4 bg-[#22ccb7] hover:bg-[#1ab5a3] text-white whitespace-nowrap"
              >
                중복확인
              </Button>
            </div>

            {/* 모바일 레이아웃 */}
            <div className="sm:hidden space-y-1 flex flex-col gap-1">
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="이메일 주소"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 text-base border-gray-300 flex-1"
                />
                <span className="text-gray-500 self-center">@</span>
                <Input
                  type="text"
                  placeholder="도메인"
                  value={emailDomain}
                  onChange={(e) => setEmailDomain(e.target.value)}
                  className="h-12 text-base border-gray-300 flex-1"
                />
              </div>
              <div className="flex gap-2">
                <Select onValueChange={setEmailDomain}>
                  <SelectTrigger className="h-12 flex-1 border-gray-300">
                    <SelectValue placeholder="도메인 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gmail.com">gmail.com</SelectItem>
                    <SelectItem value="naver.com">naver.com</SelectItem>
                    <SelectItem value="daum.net">daum.net</SelectItem>
                    <SelectItem value="hanmail.net">hanmail.net</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  onClick={handleEmailCheck}
                  className="h-12 px-4 bg-[#22ccb7] hover:bg-[#1ab5a3] text-white whitespace-nowrap"
                >
                  중복확인
                </Button>
              </div>
            </div>
          </div>
          {emailChecked && (
            <div className="flex items-center text-green-600 text-sm">
              <CheckCircle className="w-4 h-4 mr-1" />
              사용 가능한 이메일입니다.
            </div>
          )}
        </div>

        {/* 휴대폰번호 */}
        <div className="space-y-1 flex flex-col">
          <Label htmlFor="phone" className="text-base font-medium">
            휴대폰번호
          </Label>
          <div className="flex gap-2">
            <Input
              id="phone"
              type="tel"
              placeholder="휴대폰번호를 -없이 입력해주세요."
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="h-12 text-base border-gray-300 flex-1"
            />
            <Button
              type="button"
              onClick={handlePhoneVerification}
              className="h-12 px-6 bg-[#22ccb7] hover:bg-[#1ab5a3] text-white"
            >
              인증번호발송
            </Button>
          </div>
          {verificationSent && (
            <div className="flex items-center text-green-600 text-sm">
              <CheckCircle className="w-4 h-4 mr-1" />
              인증번호가 발송되었습니다.
            </div>
          )}
        </div>

        {/* 생년월일 (기업회원만) */}
        {role === "company" && (
          <div className="space-y-1 flex flex-col">
            <Label htmlFor="birthDate" className="text-base font-medium">
              생년월일
            </Label>
            <div className="relative">
              <Input
                id="birthDate"
                type="text"
                placeholder="회원가입(기업회원)하려는 회원의 생년월일을 입력해주세요."
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="h-12 text-base border-gray-300 pr-10"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Calendar className="w-5 h-5 text-gray-400" />
              </div>
            </div>
            {/* <p className="text-sm text-gray-500">연도-월-일</p> */}
          </div>
        )}

        {/* 장애유형 (근로자만) */}
        {role === "worker" && (
          <div className="space-y-1 flex flex-col">
            <Label className="text-base font-medium">장애유형</Label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Select onValueChange={setDisabilityLevel}>
                <SelectTrigger className="h-12 border-gray-300">
                  <SelectValue placeholder="장애 정도 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1급">1급</SelectItem>
                  <SelectItem value="2급">2급</SelectItem>
                  <SelectItem value="3급">3급</SelectItem>
                  <SelectItem value="4급">4급</SelectItem>
                  <SelectItem value="5급">5급</SelectItem>
                  <SelectItem value="6급">6급</SelectItem>
                </SelectContent>
              </Select>
              <Select onValueChange={setDisabilityType}>
                <SelectTrigger className="h-12 border-gray-300">
                  <SelectValue placeholder="장애 유형 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="지체장애">지체장애</SelectItem>
                  <SelectItem value="뇌병변장애">뇌병변장애</SelectItem>
                  <SelectItem value="시각장애">시각장애</SelectItem>
                  <SelectItem value="청각장애">청각장애</SelectItem>
                  <SelectItem value="언어장애">언어장애</SelectItem>
                  <SelectItem value="지적장애">지적장애</SelectItem>
                  <SelectItem value="자폐성장애">자폐성장애</SelectItem>
                  <SelectItem value="정신장애">정신장애</SelectItem>
                  <SelectItem value="신장장애">신장장애</SelectItem>
                  <SelectItem value="심장장애">심장장애</SelectItem>
                  <SelectItem value="간장애">간장애</SelectItem>
                  <SelectItem value="안면장애">안면장애</SelectItem>
                  <SelectItem value="장루·요루장애">장루·요루장애</SelectItem>
                  <SelectItem value="뇌전증장애">뇌전증장애</SelectItem>
                </SelectContent>
              </Select>
              <Select onValueChange={setSubDisabilityType}>
                <SelectTrigger className="h-12 border-gray-300">
                  <SelectValue placeholder="부장애 유형 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="없음">없음</SelectItem>
                  <SelectItem value="지체장애">지체장애</SelectItem>
                  <SelectItem value="뇌병변장애">뇌병변장애</SelectItem>
                  <SelectItem value="시각장애">시각장애</SelectItem>
                  <SelectItem value="청각장애">청각장애</SelectItem>
                  <SelectItem value="언어장애">언어장애</SelectItem>
                  <SelectItem value="지적장애">지적장애</SelectItem>
                  <SelectItem value="자폐성장애">자폐성장애</SelectItem>
                  <SelectItem value="정신장애">정신장애</SelectItem>
                  <SelectItem value="신장장애">신장장애</SelectItem>
                  <SelectItem value="심장장애">심장장애</SelectItem>
                  <SelectItem value="간장애">간장애</SelectItem>
                  <SelectItem value="안면장애">안면장애</SelectItem>
                  <SelectItem value="장루·요루장애">장루·요루장애</SelectItem>
                  <SelectItem value="뇌전증장애">뇌전증장애</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* 출퇴근시간 (근로자만) */}
        {role === "worker" && (
          <div className="space-y-1 flex flex-col">
            <Label className="text-base font-medium">출퇴근시간</Label>
            <div className="space-y-2">
              {/* 데스크톱 레이아웃 */}
              <div className="hidden sm:flex items-center gap-2">
                <Select onValueChange={setStartHour}>
                  <SelectTrigger className="h-12 w-20 border-gray-300">
                    <SelectValue placeholder="선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 24 }, (_, i) => (
                      <SelectItem key={i} value={i.toString().padStart(2, "0")}>
                        {i.toString().padStart(2, "0")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select onValueChange={setStartMinute}>
                  <SelectTrigger className="h-12 w-20 border-gray-300">
                    <SelectValue placeholder="선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 60 }, (_, i) => (
                      <SelectItem key={i} value={i.toString().padStart(2, "0")}>
                        {i.toString().padStart(2, "0")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span className="text-gray-500">~</span>
                <Select onValueChange={setEndHour}>
                  <SelectTrigger className="h-12 w-20 border-gray-300">
                    <SelectValue placeholder="선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 24 }, (_, i) => (
                      <SelectItem key={i} value={i.toString().padStart(2, "0")}>
                        {i.toString().padStart(2, "0")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select onValueChange={setEndMinute}>
                  <SelectTrigger className="h-12 w-20 border-gray-300">
                    <SelectValue placeholder="선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 60 }, (_, i) => (
                      <SelectItem key={i} value={i.toString().padStart(2, "0")}>
                        {i.toString().padStart(2, "0")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 모바일 레이아웃 */}
              <div className="sm:hidden space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 w-12">시작</span>
                  <Select onValueChange={setStartHour}>
                    <SelectTrigger className="h-12 flex-1 border-gray-300">
                      <SelectValue placeholder="시" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }, (_, i) => (
                        <SelectItem
                          key={i}
                          value={i.toString().padStart(2, "0")}
                        >
                          {i.toString().padStart(2, "0")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select onValueChange={setStartMinute}>
                    <SelectTrigger className="h-12 flex-1 border-gray-300">
                      <SelectValue placeholder="분" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 60 }, (_, i) => (
                        <SelectItem
                          key={i}
                          value={i.toString().padStart(2, "0")}
                        >
                          {i.toString().padStart(2, "0")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 w-12">종료</span>
                  <Select onValueChange={setEndHour}>
                    <SelectTrigger className="h-12 flex-1 border-gray-300">
                      <SelectValue placeholder="시" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }, (_, i) => (
                        <SelectItem
                          key={i}
                          value={i.toString().padStart(2, "0")}
                        >
                          {i.toString().padStart(2, "0")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select onValueChange={setEndMinute}>
                    <SelectTrigger className="h-12 flex-1 border-gray-300">
                      <SelectValue placeholder="분" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 60 }, (_, i) => (
                        <SelectItem
                          key={i}
                          value={i.toString().padStart(2, "0")}
                        >
                          {i.toString().padStart(2, "0")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 약관 동의 */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Checkbox
              id="agreeAll"
              checked={agreeAll}
              onCheckedChange={handleAgreeAll}
            />
            <Label htmlFor="agreeAll" className="cursor-pointer">
              모든 항목에 동의
            </Label>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
            <div className="flex items-center gap-2">
              <Checkbox
                id="agreeTerms"
                checked={agreeTerms}
                onCheckedChange={(checked) => setAgreeTerms(checked === true)}
              />
              <Label htmlFor="agreeTerms" className="text-sm cursor-pointer">
                이용약관{" "}
                <span className="text-[#22ccb7] underline">[보기]</span>
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="agreePrivacy"
                checked={agreePrivacy}
                onCheckedChange={(checked) => setAgreePrivacy(checked === true)}
              />
              <Label htmlFor="agreePrivacy" className="text-sm cursor-pointer">
                개인정보 수집 및 이용{" "}
                <span className="text-[#22ccb7] underline">[보기]</span>
              </Label>
            </div>
          </div>
        </div>

        {error && (
          <div
            className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 rounded-lg"
            role="alert"
          >
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* 버튼 */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
          <Button
            type="submit"
            className="flex-1 h-12 text-base font-semibold bg-[#22ccb7] hover:bg-[#1ab5a3] text-white"
            disabled={isLoading}
          >
            {isLoading ? "가입 중..." : "회원가입"}
          </Button>
          <Button
            type="button"
            onClick={() => router.push("/login")}
            className="flex-1 h-12 text-base font-semibold bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            취소
          </Button>
        </div>
      </form>
    </div>
  );
}
