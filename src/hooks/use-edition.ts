import config from "@/atLicense/config"

export function useEdition(): { isCE: boolean; isEE: boolean } {
  return { isCE: config.isCE, isEE: !config.isCE }
}
