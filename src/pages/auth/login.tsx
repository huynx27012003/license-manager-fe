import { useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate, Link } from "@tanstack/react-router"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import * as atLicense from "@/atLicense"

import { useAuth } from "@/hooks/use-auth"
import { useSession } from "@/hooks/use-session"

import { AuthErrorCode } from "@/types/auth"

import * as Loading from "@/components/loading"

const emailSchema = z.object({
  username: z.string().email("Please enter a valid email."),
})

const passwordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters."),
  remember: z.boolean().optional(),
})

type Step = "email" | "password"

export default function Login() {
  const [step, setStep] = useState<Step>("email")
  const [loading, setLoading] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)

  const auth = useAuth()
  const session = useSession()
  const error = localError || auth.error

  const navigate = useNavigate()

  const emailForm = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: { username: "" },
  })

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: "", remember: false },
  })

  async function onSubmitEmail() {
    setLoading(true)
    setLocalError(null)
    auth.setError(null)

    const email = emailForm.getValues().username

    try {
      const response = await atLicense.authenticate({ email })
      const { errors } = response || {}

      if (!errors?.length) {
        throw new Error("Service is unavailable.")
      }

      const err = errors[0] as {
        code: AuthErrorCode
        detail?: string
        links?: { redirect?: string | null }
      }

      auth.setEmail(email)

      switch (err.code) {
        case AuthErrorCode.PasswordRequired:
          setStep("password")
          break
        case AuthErrorCode.SsoRequired:
          if (err.links?.redirect) {
            auth.setSsoRedirectUrl(err.links.redirect)
            void navigate({ to: `/${atLicense.config.id}/auth/sso` })
          } else {
            setLocalError("Single sign-on is unavailable.")
          }
          break
        case AuthErrorCode.OtpRequired:
          setLocalError("Invalid email. Please try again.")
          break
        default:
          throw new Error(err.detail)
      }
    } catch (error) {
      console.error(error)
      setLocalError("Service is unavailable. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  async function onSubmitPassword() {
    setLoading(true)
    setLocalError(null)
    auth.setError(null)

    const { password, remember } = passwordForm.getValues()

    try {
      const { data, errors } = await atLicense.authenticate({
        email: auth.email!,
        password,
      })

      if (errors?.length) {
        const { code } = errors[0] as unknown as { code: AuthErrorCode }

        switch (code) {
          case AuthErrorCode.PasswordInvalid:
            setLocalError("Invalid password. Please try again.")
            break
          case AuthErrorCode.OtpRequired:
            auth.setPassword(password)
            auth.setRemember(remember || false)
            void navigate({ to: `/${atLicense.config.id}/auth/verify` })
            break
          default:
            throw new Error(errors[0]?.detail)
        }

        return
      }

      const { id: tokenId, attributes, relationships } = data!
      const { token } = attributes
      const userId = relationships.bearer.data.id

      const storage = remember ? localStorage : sessionStorage
      storage.setItem("tokenId", tokenId)
      atLicense.client.setTokenId(tokenId)

      if (!atLicense.config.isCloud) {
        storage.setItem("token", token)
        atLicense.client.setRootToken(token)
      }

      session.setUser(userId)

      void navigate({ to: "/" })
    } catch (error) {
      console.error(error)
      auth.setError("Service is unavailable. Please try again later.")

      void navigate({
        to: "/$accountId/auth/login",
        params: { accountId: atLicense.config.id },
      })
    } finally {
      setLoading(false)
    }
  }

  function handleBack() {
    setStep("email")
    setLocalError(null)
    auth.setError(null)
    passwordForm.reset()
  }

  return (
    <section className="flex w-80 flex-col justify-center">
      {step === "email" ? (
        <Form {...emailForm}>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              void emailForm.handleSubmit(onSubmitEmail)(e)
            }}
            noValidate
            className="my-3 w-full space-y-7"
          >
            <h1 className="bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text font-owners-wide text-2xl font-medium text-transparent select-none">
              Sign in to your account
            </h1>

            <FormField
              control={emailForm.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-content-muted">
                    Email address
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      autoComplete="username"
                      autoFocus
                      placeholder="Enter email..."
                      disabled={loading}
                      onChange={(e) => {
                        field.onChange(e)
                        setLocalError(null)
                        auth.setError(null)
                      }}
                    />
                  </FormControl>
                  <FormMessage>{error}</FormMessage>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <Loading.Dots className="bg-background" />
              ) : (
                "Continue"
              )}
            </Button>
          </form>
        </Form>
      ) : (
        <Form {...passwordForm}>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              void passwordForm.handleSubmit(onSubmitPassword)(e)
            }}
            className="my-3 space-y-7"
          >
            <div>
              <button
                type="button"
                onClick={handleBack}
                className="mb-2 text-sm text-secondary hover:text-content-loud transition-colors"
              >
                &larr; Back
              </button>
              <h1 className="bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text font-owners-wide text-2xl font-medium text-transparent select-none">
                Enter your password
              </h1>
              <p className="mt-1 text-sm text-content-subdued">
                {auth.email}
              </p>
            </div>

            <FormField
              control={passwordForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-content-muted">Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      variant="default"
                      type="password"
                      toggle={true}
                      autoComplete="current-password"
                      autoFocus
                      placeholder="Enter your password..."
                      disabled={loading}
                      onChange={(e) => {
                        field.onChange(e)
                        setLocalError(null)
                        auth.setError(null)
                      }}
                    />
                  </FormControl>
                  <FormMessage>{error}</FormMessage>

                  <Button
                    variant="link"
                    size="link"
                    asChild
                    className={`${
                      loading
                        ? "pointer-events-none text-content-disabled"
                        : "pointer-events-auto text-secondary"
                    } w-fit`}
                  >
                    <Link
                      to="/$accountId/auth/recovery"
                      params={{ accountId: atLicense.config.id }}
                    >
                      Forgot password?
                    </Link>
                  </Button>
                </FormItem>
              )}
            />

            <FormField
              control={passwordForm.control}
              name="remember"
              render={({ field }) => (
                <FormItem className="flex items-center">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormLabel>Remember me on this device</FormLabel>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <Loading.Dots className="bg-background" />
              ) : (
                "Sign in"
              )}
            </Button>
          </form>
        </Form>
      )}

      <div className="space-x-2 rounded border border-content-subdued p-2 text-center text-sm select-none">
        <span className="text-content-subdued">No account yet?</span>
        <Button
          asChild
          variant="link"
          size="link"
          className="text-content-loud"
        >
          <Link
            to="/$accountId/auth/register"
            className="text-content-main underline-slide py-0.5 font-bold"
            params={{ accountId: atLicense.config.id }}
          >
            Create one
          </Link>
        </Button>
      </div>
    </section>
  )
}
