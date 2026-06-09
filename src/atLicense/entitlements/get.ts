import config from "@/atLicense/config"
import client from "@/atLicense/client"
import { EntitlementResponse } from "@/types/entitlements"

config.validate()

interface GetProps {
  id: string
}

export default async function get({
  id,
}: GetProps): Promise<EntitlementResponse> {
  const result = (await client.request(
    `/accounts/${config.id}/entitlements/${id}`,
    {
      method: "GET",
    },
  )) as EntitlementResponse

  return result
}
