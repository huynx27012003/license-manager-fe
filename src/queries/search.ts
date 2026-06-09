import { useQuery } from "@tanstack/react-query"

import {
  SearchOperator,
  type SearchQuery,
  SearchableResource,
} from "@/types/search"

import { useEnvironment } from "@/hooks/use-environment"

import { hasMinimumSearchQuery } from "@/lib/search"

import * as atLicense from "@/atLicense"

export function useSearch(
  type: SearchableResource | null,
  query: SearchQuery,
  op?: SearchOperator,
) {
  const { code } = useEnvironment()
  const enabled = type != null && hasMinimumSearchQuery(query)

  return useQuery({
    queryKey: ["search", type, query, op, { environment: code }],
    queryFn: () =>
      atLicense
        .search({ type: type!, query, op })
        .then((response) => response.data ?? []),
    enabled,
  })
}
