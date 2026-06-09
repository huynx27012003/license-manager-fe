import config from "@/atLicense/config"
import client from "@/atLicense/client"

import * as Schemas from "@/schemas"
import { compact } from "@/lib/compact"
import { EntitlementResponse } from "@/types/entitlements"

config.validate()

interface CreateProps {
  values: Schemas.Entitlements.CreateValues
}

export default async function create({
  values,
}: CreateProps): Promise<EntitlementResponse> {
  const body = {
    data: {
      type: "entitlements",
      attributes: compact(values),
    },
  }

  const result = (await client.request(`/accounts/${config.id}/entitlements`, {
    method: "POST",
    body: JSON.stringify(body),
  })) as EntitlementResponse

  return result
}
