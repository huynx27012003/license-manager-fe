import config from "@/atLicense/config"
import client from "@/atLicense/client"

import { MachineResponse } from "@/types/machines"

config.validate()

interface ChangeOwnerProps {
  id: string
  ownerId: string | null
}

export default async function changeOwner({
  id,
  ownerId,
}: ChangeOwnerProps): Promise<MachineResponse> {
  const body = {
    data: ownerId ? { type: "users", id: ownerId } : null,
  }

  const result = (await client.request(
    `/accounts/${config.id}/machines/${id}/owner`,
    {
      method: "PUT",
      body: JSON.stringify(body),
    },
  )) as MachineResponse

  return result
}
