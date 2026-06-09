import config from "@/atLicense/config"
import client from "@/atLicense/client"

import { APIResponse } from "@/types/api"

config.validate()

export type CancelSubscriptionResponse = APIResponse<null>

export default async function cancelSubscription(): Promise<CancelSubscriptionResponse> {
  const result = (await client.request(
    `/accounts/${config.id}/actions/cancel-subscription`,
    { method: "POST" },
  )) as CancelSubscriptionResponse

  return result
}
