import config from "@/atLicense/config"
import client from "@/atLicense/client"
import { PolicyResponse } from "@/types/policies"

config.validate()

interface GetProps {
  id: string
}

export default async function get({ id }: GetProps): Promise<PolicyResponse> {
  const result = (await client.request(
    `/accounts/${config.id}/policies/${id}`,
    {
      method: "GET",
    },
  )) as PolicyResponse

  return result
}
