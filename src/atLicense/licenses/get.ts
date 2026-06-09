import config from "@/atLicense/config"
import client from "@/atLicense/client"
import { LicenseResponse } from "@/types/licenses"

config.validate()

interface GetProps {
  id: string
}

export default async function get({ id }: GetProps): Promise<LicenseResponse> {
  const result = (await client.request(
    `/accounts/${config.id}/licenses/${id}`,
    {
      method: "GET",
    },
  )) as LicenseResponse

  return result
}
