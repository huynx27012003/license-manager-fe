import config from "@/atLicense/config"
import client from "@/atLicense/client"
import { ArchResponse } from "@/types/arches"

config.validate()

interface GetProps {
  id: string
}

export default async function get({ id }: GetProps): Promise<ArchResponse> {
  const result = (await client.request(`/accounts/${config.id}/arches/${id}`, {
    method: "GET",
  })) as ArchResponse

  return result
}
