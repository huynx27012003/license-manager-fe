import config from "@/atLicense/config"
import client from "@/atLicense/client"
import { AccountSettingListResponse } from "@/types/accounts"

config.validate()

export default async function settings(): Promise<AccountSettingListResponse> {
  const result = (await client.request(`/accounts/${config.id}/settings`, {
    method: "GET",
  })) as AccountSettingListResponse

  return result
}
