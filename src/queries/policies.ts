import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

import { useEnvironment } from "@/hooks/use-environment"

import * as Schemas from "@/schemas"

import { APIError } from "@/types/api"
import { Policy, type PolicyFilters } from "@/types/policies"

import * as atLicense from "@/atLicense"
import { diff } from "@/lib/utils"

export type { PolicyFilters }

export function useGetPolicy(policyId: string) {
  const { code } = useEnvironment()

  return useQuery({
    queryKey: ["policies", policyId, { environment: code }],
    queryFn: async () => {
      const response = await atLicense.policies.get({ id: policyId })

      if (!response.data) {
        throw new Error("Policy not found")
      }

      return response.data
    },
    enabled: !!policyId,
  })
}

export function useListPolicies(
  params?: { page: number; pageSize: number; filters?: PolicyFilters },
  options?: { enabled?: boolean },
) {
  const { code } = useEnvironment()

  const query = useQuery({
    queryKey: ["policies", { environment: code, ...params }],
    queryFn: async () => {
      const response = await atLicense.policies.list(
        params
          ? {
              pageNumber: params.page,
              pageSize: params.pageSize,
              filters: params.filters,
            }
          : {},
      )

      if (response.errors) {
        throw new APIError(response.errors[0])
      }

      return response
    },
    enabled: options?.enabled,
  })

  return {
    ...query,
    data: query.data?.data ?? [],
    links: query.data?.links,
  }
}

export function useCreatePolicy() {
  const queryClient = useQueryClient()
  const { code } = useEnvironment()

  return useMutation<Policy, APIError, Schemas.Policies.CreateValues>({
    mutationFn: async (values) => {
      const response = await atLicense.policies.create(values)

      if (response.errors) {
        throw new APIError(response.errors[0])
      }

      return response.data
    },

    onSuccess: async (newPolicy) => {
      queryClient.setQueryData(["policy", newPolicy.id], newPolicy)
      await queryClient.invalidateQueries({
        queryKey: ["policies", { environment: code }],
      })
    },
  })
}

export function useUpdatePolicy(policyId: string) {
  const queryClient = useQueryClient()
  const { code } = useEnvironment()

  return useMutation<Policy, APIError, Schemas.Policies.UpdateValues>({
    mutationFn: (values) =>
      atLicense.policies.get({ id: policyId }).then(async (response) => {
        if (response.errors) {
          throw new APIError(response.errors[0])
        }

        const current = response.data

        const changes = diff(
          current.attributes,
          values,
        ) as Schemas.Policies.UpdateValues
        if (Object.keys(changes).length === 0) return current

        const updateResponse = await atLicense.policies.update({
          id: policyId,
          values: changes,
        })

        if (updateResponse.errors) {
          throw new APIError(updateResponse.errors[0])
        }

        return updateResponse.data
      }),

    onSuccess: async (updated) => {
      queryClient.setQueryData(
        ["policies", policyId, { environment: code }],
        updated,
      )
      await queryClient.invalidateQueries({
        queryKey: ["policies", { environment: code }],
      })
    },
  })
}

export function useRemovePolicy(policyId: string) {
  const queryClient = useQueryClient()
  const { code } = useEnvironment()

  return useMutation({
    mutationFn: () => atLicense.policies.remove({ id: policyId }),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["policies", { environment: code }],
      })
      queryClient.removeQueries({
        queryKey: ["policies", policyId, { environment: code }],
      })
    },
  })
}

export function useListPolicyEntitlements(policyId: string) {
  const { code } = useEnvironment()

  return useQuery({
    queryKey: ["policies", policyId, "entitlements", { environment: code }],
    queryFn: () =>
      atLicense.policies
        .listEntitlements({ policyId })
        .then((response) => response.data ?? []),
    enabled: !!policyId,
  })
}

export function useAttachPolicyEntitlements() {
  const queryClient = useQueryClient()
  const { code } = useEnvironment()

  return useMutation<
    null,
    APIError,
    { policyId: string; entitlementIds: string[] }
  >({
    mutationFn: ({ policyId, entitlementIds }) =>
      atLicense.policies.attachEntitlements({ policyId, entitlementIds }),

    onSuccess: async (_, { policyId }) => {
      await queryClient.invalidateQueries({
        queryKey: ["policies", policyId, "entitlements", { environment: code }],
      })
      await queryClient.invalidateQueries({
        queryKey: ["policies", policyId, { environment: code }],
      })
    },
  })
}

export function useDetachPolicyEntitlements() {
  const queryClient = useQueryClient()
  const { code } = useEnvironment()

  return useMutation<
    null,
    APIError,
    { policyId: string; entitlementIds: string[] }
  >({
    mutationFn: ({ policyId, entitlementIds }) =>
      atLicense.policies.detachEntitlements({ policyId, entitlementIds }),

    onSuccess: async (_, { policyId }) => {
      await queryClient.invalidateQueries({
        queryKey: ["policies", policyId, "entitlements", { environment: code }],
      })
      await queryClient.invalidateQueries({
        queryKey: ["policies", policyId, { environment: code }],
      })
    },
  })
}
