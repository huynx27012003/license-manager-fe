import config from "@/atLicense/config"
import client from "@/atLicense/client"
import { GroupResponse } from "@/types/groups"

config.validate()

interface GetProps {
  id: string
}

export default async function get({ id }: GetProps): Promise<GroupResponse> {
  const result = (await client.request(`/accounts/${config.id}/groups/${id}`, {
    method: "GET",
  })) as GroupResponse

  return result
}
