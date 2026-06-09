import config from "@/atLicense/config"
import client from "@/atLicense/client"

import * as Schemas from "@/schemas"
import { compact } from "@/lib/compact"
import { ReleaseResponse } from "@/types/releases"

config.validate()

interface UpdateProps {
  id: string
  values: Schemas.Releases.UpdateValues
}

export default async function update({
  id,
  values,
}: UpdateProps): Promise<ReleaseResponse> {
  const { constraints, packageId, ...attributes } = values

  void constraints
  void packageId

  const body = {
    data: {
      type: "releases",
      attributes: compact(attributes),
    },
  }

  const result = (await client.request(
    `/accounts/${config.id}/releases/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify(body),
    },
  )) as ReleaseResponse

  return result
}
