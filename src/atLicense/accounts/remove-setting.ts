import config from "@/atLicense/config"
import client from "@/atLicense/client"

config.validate()

interface RemoveSettingProps {
  id: string
}

export default async function removeSetting({
  id,
}: RemoveSettingProps): Promise<null> {
  await client.request(`/accounts/${config.id}/settings/${id}`, {
    method: "DELETE",
  })

  return null
}
