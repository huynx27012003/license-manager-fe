import config from "@/atLicense/config"
import client from "@/atLicense/client"

config.validate()

interface RemoveProps {
  userId: string
  id: string
}

export default async function remove({
  userId,
  id,
}: RemoveProps): Promise<null> {
  await client.request(
    `/accounts/${config.id}/users/${userId}/second-factors/${id}`,
    {
      method: "DELETE",
      root: client.currentUser === userId,
    },
  )

  return null
}
