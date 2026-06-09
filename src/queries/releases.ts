import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

import { useEnvironment } from "@/hooks/use-environment"

import * as Schemas from "@/schemas"
import { APIError } from "@/types/api"
import { Release, type ReleaseFilters } from "@/types/releases"

import * as atLicense from "@/atLicense"
import { diff } from "@/lib/utils"

export type { ReleaseFilters }

export function useGetRelease(releaseId: string) {
  const { code } = useEnvironment()

  return useQuery({
    queryKey: ["releases", releaseId, { environment: code }],
    queryFn: async () => {
      const response = await atLicense.releases.get({ id: releaseId })

      if (!response.data) {
        throw new Error("Release not found")
      }

      return response.data
    },
    enabled: !!releaseId,
  })
}

export function useListReleases(
  params?: { page: number; pageSize: number; filters?: ReleaseFilters },
  options?: { enabled?: boolean },
) {
  const { code } = useEnvironment()

  const query = useQuery({
    queryKey: ["releases", { environment: code, ...params }],
    queryFn: async () => {
      const response = await atLicense.releases.list(
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

export function useCreateRelease() {
  const queryClient = useQueryClient()
  const { code } = useEnvironment()

  return useMutation<Release, APIError, Schemas.Releases.CreateValues>({
    mutationFn: (values) =>
      atLicense.releases.create(values).then((response) => {
        if (response.errors) {
          throw new APIError(response.errors[0])
        }

        return response.data
      }),

    onSuccess: async (newRelease) => {
      queryClient.setQueryData(
        ["releases", newRelease.id, { environment: code }],
        newRelease,
      )
      await queryClient.invalidateQueries({
        queryKey: ["releases", { environment: code }],
      })
    },
  })
}

export function useUpdateRelease(releaseId: string) {
  const queryClient = useQueryClient()
  const { code } = useEnvironment()

  return useMutation<Release, APIError, Schemas.Releases.UpdateValues>({
    mutationFn: (values) =>
      atLicense.releases.get({ id: releaseId }).then(async (response) => {
        if (response.errors) {
          throw new APIError(response.errors[0])
        }

        const current = response.data

        const changes = diff(
          current.attributes,
          values as Partial<typeof current.attributes>,
        ) as Schemas.Releases.UpdateValues
        if (Object.keys(changes).length === 0) return current

        const updateResponse = await atLicense.releases.update({
          id: releaseId,
          values: changes,
        })

        if (updateResponse.errors) {
          throw new APIError(updateResponse.errors[0])
        }

        return updateResponse.data
      }),

    onSuccess: async (updated) => {
      queryClient.setQueryData(
        ["releases", releaseId, { environment: code }],
        updated,
      )
      await queryClient.invalidateQueries({
        queryKey: ["releases", { environment: code }],
      })
    },
  })
}

export function useRemoveRelease(releaseId: string) {
  const queryClient = useQueryClient()
  const { code } = useEnvironment()

  return useMutation({
    mutationFn: () => atLicense.releases.remove({ id: releaseId }),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["releases", { environment: code }],
      })
      queryClient.removeQueries({
        queryKey: ["releases", releaseId, { environment: code }],
      })
    },
  })
}

export function usePublishRelease(releaseId: string) {
  const queryClient = useQueryClient()
  const { code } = useEnvironment()

  return useMutation<Release, APIError>({
    mutationFn: () =>
      atLicense.releases
        .publish({ id: releaseId })
        .then((response) => response.data as Release),

    onSuccess: async (updated) => {
      queryClient.setQueryData(
        ["releases", releaseId, { environment: code }],
        updated,
      )
      await queryClient.invalidateQueries({
        queryKey: ["releases", { environment: code }],
      })
    },
  })
}

export function useYankRelease(releaseId: string) {
  const queryClient = useQueryClient()
  const { code } = useEnvironment()

  return useMutation<Release, APIError>({
    mutationFn: () =>
      atLicense.releases
        .yank({ id: releaseId })
        .then((response) => response.data as Release),

    onSuccess: async (updated) => {
      queryClient.setQueryData(
        ["releases", releaseId, { environment: code }],
        updated,
      )
      await queryClient.invalidateQueries({
        queryKey: ["releases", { environment: code }],
      })
    },
  })
}

export function useListReleaseArtifacts(releaseId: string) {
  const { code } = useEnvironment()

  return useQuery({
    queryKey: ["releases", releaseId, "artifacts", { environment: code }],
    queryFn: () =>
      atLicense.releases
        .listArtifacts({ releaseId })
        .then((response) => response.data ?? []),
    enabled: !!releaseId,
  })
}

export function useListReleaseConstraints(releaseId: string) {
  const { code } = useEnvironment()

  return useQuery({
    queryKey: ["releases", releaseId, "constraints", { environment: code }],
    queryFn: () =>
      atLicense.releases
        .listConstraints({ releaseId })
        .then((response) => response.data ?? []),
    enabled: !!releaseId,
  })
}

export function useAttachReleaseConstraints() {
  const queryClient = useQueryClient()
  const { code } = useEnvironment()

  return useMutation<
    null,
    APIError,
    { releaseId: string; entitlementIds: string[] }
  >({
    mutationFn: ({ releaseId, entitlementIds }) =>
      atLicense.releases.attachConstraints({ releaseId, entitlementIds }),

    onSuccess: async (_, { releaseId }) => {
      await queryClient.invalidateQueries({
        queryKey: ["releases", releaseId, "constraints", { environment: code }],
      })
      await queryClient.invalidateQueries({
        queryKey: ["releases", releaseId, { environment: code }],
      })
    },
  })
}

export function useDetachReleaseConstraints() {
  const queryClient = useQueryClient()
  const { code } = useEnvironment()

  return useMutation<
    null,
    APIError,
    { releaseId: string; constraintIds: string[] }
  >({
    mutationFn: ({ releaseId, constraintIds }) =>
      atLicense.releases.detachConstraints({ releaseId, constraintIds }),

    onSuccess: async (_, { releaseId }) => {
      await queryClient.invalidateQueries({
        queryKey: ["releases", releaseId, "constraints", { environment: code }],
      })
      await queryClient.invalidateQueries({
        queryKey: ["releases", releaseId, { environment: code }],
      })
    },
  })
}

export function useChangeReleasePackage() {
  const queryClient = useQueryClient()
  const { code } = useEnvironment()

  return useMutation<
    Release,
    APIError,
    { releaseId: string; packageId: string | null }
  >({
    mutationFn: async ({ releaseId, packageId }) => {
      const response = await atLicense.releases.changePackage({
        id: releaseId,
        packageId,
      })

      if (response.errors) {
        throw new APIError(response.errors[0])
      }

      return response.data
    },

    onSuccess: async (updated) => {
      queryClient.setQueryData(
        ["releases", updated.id, { environment: code }],
        updated,
      )
      await queryClient.invalidateQueries({
        queryKey: ["releases", { environment: code }],
      })
    },
  })
}
