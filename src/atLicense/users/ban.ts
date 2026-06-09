import config from "@/atLicense/config"
import client from "@/atLicense/client"

import { UserResponse } from "@/types/users"

config.validate()

interface BanProps {
  id: string
}

export default async function ban({ id }: BanProps): Promise<UserResponse> {
  const result = (await client.request(
    `/accounts/${config.id}/users/${id}/actions/ban`,
    { method: "POST" },
  )) as UserResponse

  return result
}
