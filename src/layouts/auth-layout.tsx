import { useEffect } from "react"
import { Outlet, useMatches, useNavigate } from "@tanstack/react-router"

import logo from "/logo.svg"

import * as atLicense from "@/atLicense"

import { AuthProvider } from "@/providers/auth-provider"
import { useSession } from "@/hooks/use-session"

import * as Loading from "@/components/loading"
import BackButton from "@/components/back-button"

export default function AuthLayout() {
  const navigate = useNavigate()
  const { user } = useSession()
  const matches = useMatches()

  useEffect(() => {
    if (!user) return
    void navigate({
      to: "/$accountId/app/dashboard",
      params: { accountId: atLicense.config.id },
      replace: true,
    })
  }, [user, navigate])

  if (user) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Loading.Dots />
      </div>
    )
  }

  const currentRoute = matches[matches.length - 1] as { routeId: string }

  const label = (() => {
    if (currentRoute.routeId === "/$accountId/auth/password") return "Go Back"
    if (currentRoute.routeId === "/$accountId/auth/sso")
      return "Return to Login"
    if (currentRoute.routeId === "/$accountId/auth/verify")
      return "Return to Login"
    if (currentRoute.routeId === "/$accountId/auth/recovery")
      return "Return to Login"
    if (currentRoute.routeId === "/$accountId/auth/sent")
      return "Return to Login"
    return ""
  })()

  return (
    <AuthProvider>
      <div className="flex min-h-screen">
        <section className="flex w-full flex-col bg-background md:w-1/2">
          <nav className="grid w-full grid-cols-[1fr_auto_1fr] items-center gap-4 pt-4 md:pt-8">
            <div className="justify-self-center">
              {label && (
                <BackButton
                  path={"/$id/auth/login"}
                  label={label}
                  className="hidden md:flex"
                />
              )}
            </div>
            <div className="justify-self-center">
              <img src={logo} alt="AT-License Logo" className="h-6 md:h-5" />
            </div>
          </nav>
          <main className="flex flex-1 items-center justify-center px-4">
            <Outlet />
          </main>
        </section>

        <section className="hidden w-1/2 bg-gradient-to-br from-blue-50 via-blue-50 to-blue-100 md:flex md:flex-col md:justify-center md:p-12 md:overflow-hidden relative">
          <div className="flex flex-col gap-6 z-10 max-w-lg">
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                <div className="w-3 h-3 bg-blue-600 rounded-sm"></div>
                <div className="w-3 h-3 bg-red-500 rounded-sm"></div>
              </div>
              <span className="text-lg font-bold text-gray-800">AT-License</span>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 leading-tight">
              Cấp phát &amp; kiểm soát license tập trung cho phần mềm, thiết bị.
            </h2>

            <div className="flex flex-col gap-4 mt-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
                    <path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">Quản lý nhiều sản phẩm</p>
                  <p className="text-xs text-gray-500">trên một nền tảng</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">Giới hạn đăng nhập</p>
                  <p className="text-xs text-gray-500">1-2 thiết bị / machine</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">Theo dõi kích hoạt</p>
                  <p className="text-xs text-gray-500">và cảnh báo gia hạn</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2 mt-8 z-10">
            <div className="w-8 h-8 bg-blue-200 rounded-sm"></div>
            <div className="w-8 h-8 bg-red-400 rounded-sm"></div>
          </div>

          <div className="absolute top-8 right-8 w-64 h-80 bg-white rounded-xl shadow-lg border border-gray-100 p-4 z-20 hidden lg:block">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-blue-600 rounded-sm flex items-center justify-center">
                <span className="text-white text-xs font-bold">A</span>
              </div>
              <span className="text-xs font-semibold text-gray-800">AT-License</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-purple-100 rounded text-[8px] font-bold text-purple-600 flex items-center justify-center">AS</div>
                  <span className="text-[10px] text-gray-700">AT SCADA Suite</span>
                </div>
                <span className="text-[8px] text-green-600 bg-green-50 px-1 rounded">Dang hoat dong</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-red-100 rounded text-[8px] font-bold text-red-600 flex items-center justify-center">DM</div>
                  <span className="text-[10px] text-gray-700">AT Device Manager</span>
                </div>
                <span className="text-[8px] text-green-600 bg-green-50 px-1 rounded">Dang hoat dong</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-green-100 rounded text-[8px] font-bold text-green-600 flex items-center justify-center">GT</div>
                  <span className="text-[10px] text-gray-700">AT Gateway Toolkit</span>
                </div>
                <span className="text-[8px] text-green-600 bg-green-50 px-1 rounded">Dang hoat dong</span>
              </div>
            </div>
            <p className="text-[9px] text-blue-600 mt-3 text-center">Xem tat ca san pham &rarr;</p>
          </div>

          <div className="absolute bottom-16 right-12 w-56 bg-white rounded-xl shadow-lg border border-gray-100 p-3 z-10 hidden lg:block">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
              </svg>
              <span className="text-[10px] font-semibold text-gray-800">Canh bao sap het han</span>
            </div>
            <p className="text-[9px] text-gray-500">28 license se het han trong 30 ngay toi.</p>
            <p className="text-[9px] text-blue-600 mt-1">Xem chi tiet &rarr;</p>
          </div>
        </section>
      </div>
    </AuthProvider>
  )
}
