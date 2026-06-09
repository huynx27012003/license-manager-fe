import config from "@/atLicense/config"
import client from "@/atLicense/client"

import { LicenseResponse } from "@/types/licenses"

config.validate()

interface SuspendProps {
  id: string
}

export default async function suspend({
  id,
}: SuspendProps): Promise<LicenseResponse> {
  const result = (await client.request(
    `/accounts/${config.id}/licenses/${id}/actions/suspend`,
    { method: "POST" },
  )) as LicenseResponse

  return result
}
