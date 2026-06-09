import config from "@/atLicense/config"
import client from "@/atLicense/client"

import { LicenseResponse } from "@/types/licenses"

config.validate()

interface CheckInProps {
  id: string
}

export default async function checkIn({
  id,
}: CheckInProps): Promise<LicenseResponse> {
  const result = (await client.request(
    `/accounts/${config.id}/licenses/${id}/actions/check-in`,
    { method: "POST" },
  )) as LicenseResponse

  return result
}
