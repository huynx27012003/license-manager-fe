import { toast } from "@/lib/toast"

export async function copyToClipboard(text: string) {
  try {
    try {
      if (navigator.clipboard?.writeText && window.isSecureContext) {
        await navigator.clipboard.writeText(text)
      } else {
        fallbackCopy(text)
      }
    } catch {
      fallbackCopy(text)
    }
    toast({ message: "Copied to clipboard" })
  } catch (err) {
    console.error(err)
    toast({
      message: "Failed to copy",
      description: "Try again later",
      variant: "error",
    })
  }
}

function fallbackCopy(text: string) {
  const textarea = document.createElement("textarea")
  textarea.value = text
  textarea.setAttribute("readonly", "")
  textarea.style.position = "fixed"
  textarea.style.left = "0"
  textarea.style.top = "0"
  textarea.style.width = "1px"
  textarea.style.height = "1px"
  textarea.style.opacity = "0"
  textarea.style.pointerEvents = "none"
  document.body.appendChild(textarea)
  textarea.focus()
  textarea.select()

  const ok = document.execCommand("copy")
  document.body.removeChild(textarea)

  if (!ok) {
    throw new Error("Clipboard fallback failed")
  }
}
