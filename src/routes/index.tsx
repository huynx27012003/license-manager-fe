import { createFileRoute, redirect } from "@tanstack/react-router"
import * as atLicense from "@/atLicense"

export const Route = createFileRoute("/")({
  loader: () => {
    const token =
      localStorage.getItem("token") ?? sessionStorage.getItem("token")

    return redirect({
      to: token ? "/$accountId/app/dashboard" : "/$accountId/auth/login",
      params: { accountId: atLicense.config.id },
      replace: true,
    })
  },
  component: () => null,
})
