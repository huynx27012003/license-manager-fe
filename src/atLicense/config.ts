const CLOUD_HOSTS = ["api.atLicense.sh", "api.atLicense.dev"]

const config = {
  host: import.meta.env.VITE_AT_LICENSE_HOST,
  mode: import.meta.env.VITE_AT_LICENSE_MODE,
  isCE: import.meta.env.VITE_AT_LICENSE_EDITION !== "EE",
  isCloud:
    import.meta.env.VITE_AT_LICENSE_EDITION === "EE" &&
    import.meta.env.VITE_AT_LICENSE_MODE === "multiplayer" &&
    CLOUD_HOSTS.includes(import.meta.env.VITE_AT_LICENSE_HOST),
  version: import.meta.env.VITE_AT_LICENSE_VERSION,
  id: import.meta.env.VITE_AT_LICENSE_ACCOUNT_ID,

  validate(): void {
    const missing: string[] = []

    if (!this.host) missing.push("VITE_AT_LICENSE_HOST")
    if (!this.mode) missing.push("VITE_AT_LICENSE_MODE")
    if (!this.version) missing.push("VITE_AT_LICENSE_VERSION")
    if (!this.id) missing.push("VITE_AT_LICENSE_ACCOUNT_ID")

    if (missing.length > 0) {
      throw new Error(
        `Missing required environment variables: ${missing.join(", ")}`,
      )
    }
  },
}

export default config
