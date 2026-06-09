import config from "@/atLicense/config"
import client from "@/atLicense/client"

import { LicenseResponse } from "@/types/licenses"

config.validate()

interface RenewProps {
  id: string
}

export default async function renew({
  id,
}: RenewProps): Promise<LicenseResponse> {
  const result = (await client.request(
    `/accounts/${config.id}/licenses/${id}/actions/renew`,
    { method: "POST" },
  )) as LicenseResponse

  return result
}
