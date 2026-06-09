import config from "@/atLicense/config"

export function useCloud(): { isCloud: boolean } {
  return { isCloud: config.isCloud }
}
