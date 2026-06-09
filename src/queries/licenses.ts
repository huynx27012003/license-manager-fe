import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

import { useEnvironment } from "@/hooks/use-environment"

import * as Schemas from "@/schemas"

import { APIError } from "@/types/api"
import { Encoding } from "@/types/files"
import { License, LicenseFile, type LicenseFilters } from "@/types/licenses"

import * as atLicense from "@/atLicense"
import { diff } from "@/lib/utils"

export type { LicenseFilters }

export function useGetLicense(licenseId: string) {
  const { code } = useEnvironment()

  return useQuery({
    queryKey: ["licenses", licenseId, { environment: code }],
    queryFn: async () => {
      const response = await atLicense.licenses.get({ id: licenseId })

      if (!response.data) {
        throw new Error("License not found")
      }

      return response.data
    },
    enabled: !!licenseId,
  })
}

export function useListLicenses(
  params?: {
    page: number
    pageSize: number
    filters?: LicenseFilters
  },
  options?: { enabled?: boolean },
) {
  const { code } = useEnvironment()

  const query = useQuery({
    queryKey: ["licenses", { environment: code, ...params }],
    queryFn: async () => {
      const response = await atLicense.licenses.list(
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

export function useCreateLicense() {
  const queryClient = useQueryClient()
  const { code } = useEnvironment()

  return useMutation<License, APIError, Schemas.Licenses.CreateValues>({
    mutationFn: async (values) => {
      const response = await atLicense.licenses.create(values)

      if (response.errors) {
        throw new APIError(response.errors[0])
      }

      return response.data
    },

    onSuccess: async (newLicense) => {
      queryClient.setQueryData(
        ["licenses", newLicense.id, { environment: code }],
        newLicense,
      )
      await queryClient.invalidateQueries({
        queryKey: ["licenses", { environment: code }],
      })
    },
  })
}

export function useUpdateLicense(licenseId: string) {
  const queryClient = useQueryClient()
  const { code } = useEnvironment()

  return useMutation<License, APIError, Schemas.Licenses.UpdateValues>({
    mutationFn: (values) =>
      atLicense.licenses.get({ id: licenseId }).then(async (response) => {
        if (response.errors) {
          throw new APIError(response.errors[0])
        }

        const current = response.data

        const changes = diff(
          current.attributes,
          values as Partial<typeof current.attributes>,
        ) as Schemas.Licenses.UpdateValues
        if (Object.keys(changes).length === 0) return current

        const updateResponse = await atLicense.licenses.update({
          id: licenseId,
          values: changes,
        })

        if (updateResponse.errors) {
          throw new APIError(updateResponse.errors[0])
        }

        return updateResponse.data
      }),

    onSuccess: async (updated) => {
      queryClient.setQueryData(
        ["licenses", licenseId, { environment: code }],
        updated,
      )
      await queryClient.invalidateQueries({
        queryKey: ["licenses", { environment: code }],
      })
    },
  })
}

export function useChangeLicenseOwner() {
  const queryClient = useQueryClient()
  const { code } = useEnvironment()

  return useMutation<
    License,
    APIError,
    { licenseId: string; ownerId: string | null }
  >({
    mutationFn: async ({ licenseId, ownerId }) => {
      const response = await atLicense.licenses.changeOwner({
        id: licenseId,
        ownerId,
      })

      if (response.errors) {
        throw new APIError(response.errors[0])
      }

      return response.data
    },

    onSuccess: async (updated) => {
      queryClient.setQueryData(
        ["licenses", updated.id, { environment: code }],
        updated,
      )
      await queryClient.invalidateQueries({
        queryKey: ["licenses", { environment: code }],
      })
      await queryClient.invalidateQueries({
        queryKey: ["licenses", updated.id, "users", { environment: code }],
      })
    },
  })
}

export function useRemoveLicense(licenseId: string) {
  const queryClient = useQueryClient()
  const { code } = useEnvironment()

  return useMutation({
    mutationFn: () => atLicense.licenses.remove({ id: licenseId }),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["licenses", { environment: code }],
      })
      queryClient.removeQueries({
        queryKey: ["licenses", licenseId, { environment: code }],
      })
    },
  })
}

export function useSuspendLicense(licenseId: string) {
  const queryClient = useQueryClient()
  const { code } = useEnvironment()

  return useMutation<License, APIError>({
    mutationFn: () =>
      atLicense.licenses
        .suspend({ id: licenseId })
        .then((response) => response.data as License),

    onSuccess: async (updated) => {
      queryClient.setQueryData(
        ["licenses", licenseId, { environment: code }],
        updated,
      )
      await queryClient.invalidateQueries({
        queryKey: ["licenses", { environment: code }],
      })
    },
  })
}

export function useReinstateLicense(licenseId: string) {
  const queryClient = useQueryClient()
  const { code } = useEnvironment()

  return useMutation<License, APIError>({
    mutationFn: () =>
      atLicense.licenses
        .reinstate({ id: licenseId })
        .then((response) => response.data as License),

    onSuccess: async (updated) => {
      queryClient.setQueryData(
        ["licenses", licenseId, { environment: code }],
        updated,
      )
      await queryClient.invalidateQueries({
        queryKey: ["licenses", { environment: code }],
      })
    },
  })
}

export function useRenewLicense(licenseId: string) {
  const queryClient = useQueryClient()
  const { code } = useEnvironment()

  return useMutation<License, APIError>({
    mutationFn: () => {
      return atLicense.licenses.renew({ id: licenseId }).then((response) => {
        if (response.errors) {
          throw new APIError(response.errors[0])
        }

        return response.data
      })
    },

    onSuccess: async (updated) => {
      queryClient.setQueryData(
        ["licenses", licenseId, { environment: code }],
        updated,
      )
      await queryClient.invalidateQueries({
        queryKey: ["licenses", { environment: code }],
      })
    },
  })
}

export function useCheckInLicense(licenseId: string) {
  const queryClient = useQueryClient()
  const { code } = useEnvironment()

  return useMutation<License, APIError>({
    mutationFn: () => {
      return atLicense.licenses.checkIn({ id: licenseId }).then((response) => {
        if (response.errors) {
          throw new APIError(response.errors[0])
        }

        return response.data
      })
    },

    onSuccess: async (updated) => {
      queryClient.setQueryData(
        ["licenses", licenseId, { environment: code }],
        updated,
      )
      await queryClient.invalidateQueries({
        queryKey: ["licenses", { environment: code }],
      })
    },
  })
}

export function useCheckOutLicense(licenseId: string) {
  const queryClient = useQueryClient()
  const { code } = useEnvironment()

  return useMutation<LicenseFile, APIError, Schemas.Licenses.CheckOutValues>({
    mutationFn: (values) => {
      const include =
        values.includeEnabled && values.include.length > 0
          ? values.include
          : undefined

      const ttl = values.ttlEnabled && values.ttl ? values.ttl : undefined

      const encoding = values.encryptEnabled
        ? Encoding.Aes256Gcm
        : Encoding.Base64
      const algorithm = `${encoding}+${values.algorithm}`

      return atLicense.licenses
        .checkOut({ id: licenseId, include, ttl, algorithm })
        .then((response) => response.data as LicenseFile)
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["licenses", licenseId, { environment: code }],
      })
    },
  })
}

export function useResetUsageLicense(licenseId: string) {
  const queryClient = useQueryClient()
  const { code } = useEnvironment()

  return useMutation<License, APIError>({
    mutationFn: () =>
      atLicense.licenses
        .resetUsage({ id: licenseId })
        .then((response) => response.data as License),

    onSuccess: async (updated) => {
      queryClient.setQueryData(
        ["licenses", licenseId, { environment: code }],
        updated,
      )
      await queryClient.invalidateQueries({
        queryKey: ["licenses", { environment: code }],
      })
    },
  })
}

export function useListLicenseEntitlements(licenseId: string) {
  const { code } = useEnvironment()

  return useQuery({
    queryKey: ["licenses", licenseId, "entitlements", { environment: code }],
    queryFn: () =>
      atLicense.licenses
        .listEntitlements({ licenseId })
        .then((response) => response.data ?? []),
    enabled: !!licenseId,
  })
}

export function useAttachLicenseEntitlements() {
  const queryClient = useQueryClient()
  const { code } = useEnvironment()

  return useMutation<
    null,
    APIError,
    { licenseId: string; entitlementIds: string[] }
  >({
    mutationFn: ({ licenseId, entitlementIds }) =>
      atLicense.licenses.attachEntitlements({ licenseId, entitlementIds }),

    onSuccess: async (_, { licenseId }) => {
      await queryClient.invalidateQueries({
        queryKey: [
          "licenses",
          licenseId,
          "entitlements",
          { environment: code },
        ],
      })
      await queryClient.invalidateQueries({
        queryKey: ["licenses", licenseId, { environment: code }],
      })
    },
  })
}

export function useDetachLicenseEntitlements() {
  const queryClient = useQueryClient()
  const { code } = useEnvironment()

  return useMutation<
    null,
    APIError,
    { licenseId: string; entitlementIds: string[] }
  >({
    mutationFn: ({ licenseId, entitlementIds }) =>
      atLicense.licenses.detachEntitlements({ licenseId, entitlementIds }),

    onSuccess: async (_, { licenseId }) => {
      await queryClient.invalidateQueries({
        queryKey: [
          "licenses",
          licenseId,
          "entitlements",
          { environment: code },
        ],
      })
      await queryClient.invalidateQueries({
        queryKey: ["licenses", licenseId, { environment: code }],
      })
    },
  })
}

export function useListLicenseUsers(licenseId: string) {
  const { code } = useEnvironment()

  return useQuery({
    queryKey: ["licenses", licenseId, "users", { environment: code }],
    queryFn: () =>
      atLicense.licenses
        .listUsers({ licenseId })
        .then((response) => response.data ?? []),
    enabled: !!licenseId,
  })
}

export function useAttachLicenseUsers() {
  const queryClient = useQueryClient()
  const { code } = useEnvironment()

  return useMutation<null, APIError, { licenseId: string; userIds: string[] }>({
    mutationFn: ({ licenseId, userIds }) =>
      atLicense.licenses.attachUsers({ licenseId, userIds }),

    onSuccess: async (_, { licenseId }) => {
      await queryClient.invalidateQueries({
        queryKey: ["licenses", licenseId, "users", { environment: code }],
      })
      await queryClient.invalidateQueries({
        queryKey: ["licenses", licenseId, { environment: code }],
      })
    },
  })
}

export function useDetachLicenseUsers() {
  const queryClient = useQueryClient()
  const { code } = useEnvironment()

  return useMutation<null, APIError, { licenseId: string; userIds: string[] }>({
    mutationFn: ({ licenseId, userIds }) =>
      atLicense.licenses.detachUsers({ licenseId, userIds }),

    onSuccess: async (_, { licenseId }) => {
      await queryClient.invalidateQueries({
        queryKey: ["licenses", licenseId, "users", { environment: code }],
      })
      await queryClient.invalidateQueries({
        queryKey: ["licenses", licenseId, { environment: code }],
      })
    },
  })
}
