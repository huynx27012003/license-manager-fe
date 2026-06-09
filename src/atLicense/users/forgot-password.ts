import config from "@/atLicense/config"
import client from "@/atLicense/client"

import { APIResponse } from "@/types/api"

config.validate()

interface ForgotProps {
  email: string
}

export default async function forgot({
  email,
}: ForgotProps): Promise<APIResponse<void>> {
  const body = {
    meta: {
      email,
    },
  }

  const result = await client.request<void>(
    `/accounts/${config.id}/passwords`,
    {
      method: "POST",
      body: JSON.stringify(body),
    },
  )

  return result
}
