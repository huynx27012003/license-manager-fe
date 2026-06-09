import config from "@/atLicense/config"
import client from "@/atLicense/client"

import { MachineResponse } from "@/types/machines"

config.validate()

interface ResetHeartbeatProps {
  id: string
}

export default async function resetHeartbeat({
  id,
}: ResetHeartbeatProps): Promise<MachineResponse> {
  const result = (await client.request(
    `/accounts/${config.id}/machines/${id}/actions/reset`,
    { method: "POST" },
  )) as MachineResponse

  return result
}
