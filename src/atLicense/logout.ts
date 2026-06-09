import client from "@/atLicense/client"
import config from "@/atLicense/config"
import * as tokens from "@/atLicense/tokens"

const STORAGE_KEYS = config.isCloud ? ["tokenId"] : ["token", "tokenId"]

export async function logout() {
  const tokenId = client.currentTokenId

  if (tokenId) {
    try {
      await tokens.revoke({ id: tokenId })
    } catch (error) {
      console.error("Failed to revoke token on logout", error)
    }
  }

  client.setRootToken(null)
  client.setEnvironmentToken(null)
  client.setEnvironment(null)
  client.setUser(null)
  client.setTokenId(null)

  for (const key of STORAGE_KEYS) {
    localStorage.removeItem(key)
    sessionStorage.removeItem(key)
  }
}
