import config from "@/atLicense/config"
import client from "@/atLicense/client"
import { EngineResponse } from "@/types/engines"

config.validate()

interface GetProps {
  id: string
}

export default async function get({ id }: GetProps): Promise<EngineResponse> {
  const result = (await client.request(`/accounts/${config.id}/engines/${id}`, {
    method: "GET",
  })) as EngineResponse

  return result
}
