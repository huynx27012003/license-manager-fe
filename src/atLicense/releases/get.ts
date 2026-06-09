import config from "@/atLicense/config"
import client from "@/atLicense/client"
import { ReleaseResponse } from "@/types/releases"

config.validate()

interface GetProps {
  id: string
}

export default async function get({ id }: GetProps): Promise<ReleaseResponse> {
  const result = (await client.request(
    `/accounts/${config.id}/releases/${id}`,
    {
      method: "GET",
    },
  )) as ReleaseResponse

  return result
}
