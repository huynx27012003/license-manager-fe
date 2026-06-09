import config from "@/atLicense/config"
import client from "@/atLicense/client"
import { ArtifactResponse } from "@/types/artifacts"

config.validate()

interface GetProps {
  id: string
}

export default async function get({ id }: GetProps): Promise<ArtifactResponse> {
  const result = (await client.request(
    `/accounts/${config.id}/artifacts/${id}`,
    {
      method: "GET",
      headers: {
        Prefer: "no-redirect, no-download",
      },
    },
  )) as ArtifactResponse

  return result
}
