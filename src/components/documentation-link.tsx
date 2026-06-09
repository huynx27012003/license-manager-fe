import { cn } from "@/lib/utils"
import { ResourceType } from "@/types/api"

interface DocumentationLinkProps {
  page?: ResourceType | ""
  section?: string
  message?: string
  className?: string
  children?: React.ReactNode
}

export default function DocumentationLink({
  page = "",
  message = "",
  className,
}: DocumentationLinkProps): React.ReactElement {
  return (
    <p
      className={cn(
        "mx-6 my-4 hidden flex-wrap items-center gap-1 text-sm text-content-subdued md:flex",
        className,
      )}
    >
      {message || `To learn more about ${page || "AT-License"}, see the documentation.`}
    </p>
  )
}
