import { createFileRoute, redirect } from "@tanstack/react-router"
import * as atLicense from "@/atLicense"

export const Route = createFileRoute("/$accountId/")({
  loader: () => {
    return redirect({
      to: "/$accountId/app/dashboard",
      params: { accountId: atLicense.config.id },
      replace: true,
    })
  },
  component: () => null,
})
