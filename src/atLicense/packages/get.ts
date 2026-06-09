import config from "@/atLicense/config"
import client from "@/atLicense/client"
import { PackageResponse } from "@/types/packages"

config.validate()

interface GetProps {
  id: string
}

export default async function get({ id }: GetProps): Promise<PackageResponse> {
  const result = (await client.request(
    `/accounts/${config.id}/packages/${id}`,
    {
      method: "GET",
    },
  )) as PackageResponse

  return result
}
