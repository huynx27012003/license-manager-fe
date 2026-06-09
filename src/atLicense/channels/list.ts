import config from "@/atLicense/config"
import client from "@/atLicense/client"
import { ChannelsListResponse } from "@/types/channels"

config.validate()

interface ListProps {
  limit?: number
  pageNumber?: number
  pageSize?: number
}

export default async function list({
  limit,
  pageNumber,
  pageSize,
}: ListProps): Promise<ChannelsListResponse> {
  const params = new URLSearchParams()
  if (limit != null) {
    params.set("limit", limit.toString())
  }
  if (pageNumber != null) {
    params.set("page[number]", pageNumber.toString())
  }
  if (pageSize != null) {
    params.set("page[size]", pageSize.toString())
  }

  const result = (await client.request(
    `/accounts/${config.id}/channels?${params.toString()}`,
    {
      method: "GET",
    },
  )) as ChannelsListResponse

  return result
}
