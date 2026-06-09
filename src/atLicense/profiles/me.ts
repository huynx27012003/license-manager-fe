import config from "@/atLicense/config"
import client from "@/atLicense/client"
import { UserResponse } from "@/types/users"

config.validate()

export default async function me(): Promise<UserResponse> {
  const result = (await client.request(`/accounts/${config.id}/me`, {
    method: "GET",
    root: true,
  })) as UserResponse

  return result
}
