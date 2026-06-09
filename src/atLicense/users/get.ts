import config from "@/atLicense/config"
import client from "@/atLicense/client"
import { UserResponse } from "@/types/users"

config.validate()

interface GetProps {
  id: string
}

export default async function get({ id }: GetProps): Promise<UserResponse> {
  const result = (await client.request(`/accounts/${config.id}/users/${id}`, {
    method: "GET",
  })) as UserResponse

  return result
}
