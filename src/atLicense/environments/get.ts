import config from "@/atLicense/config"
import client from "@/atLicense/client"
import { EnvironmentResponse } from "@/types/environments"

config.validate()

interface GetProps {
  id: string
}

export default async function get({
  id,
}: GetProps): Promise<EnvironmentResponse> {
  const result = (await client.request(
    `/accounts/${config.id}/environments/${id}`,
    {
      method: "GET",
      root: true,
    },
  )) as EnvironmentResponse

  return result
}
