import config from "@/atLicense/config"
import client from "@/atLicense/client"

config.validate()

interface RemoveProps {
  id: string
}

export default async function remove({ id }: RemoveProps): Promise<null> {
  await client.request(`/accounts/${config.id}/licenses/${id}`, {
    method: "DELETE",
  })

  return null
}
