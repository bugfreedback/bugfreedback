export type BugfreedbackReporter = {
  id?: string
  username?: string | null
  email?: string | null
}

export type BugfreedbackAuthProvider = {
  getToken: () => string | null | undefined
  getUser?: () => BugfreedbackReporter | null | undefined
}

const AUTH_KEY = 'bugfreedbackAuth'

/**
 * Host apps call this from a Nuxt plugin to supply JWT / session accessors.
 *
 * @example
 * ```ts
 * export default defineNuxtPlugin(() => {
 *   const auth = useAuth()
 *   provideBugfreedbackAuth({
 *     getToken: () => auth.getToken(),
 *     getUser: () => auth.user.value,
 *   })
 * })
 * ```
 */
export function provideBugfreedbackAuth(provider: BugfreedbackAuthProvider) {
  const nuxtApp = useNuxtApp()
  nuxtApp.provide(AUTH_KEY, provider)
}

export function useBugfreedbackAuth(): BugfreedbackAuthProvider {
  const nuxtApp = useNuxtApp()
  const injected = nuxtApp.$bugfreedbackAuth as BugfreedbackAuthProvider | undefined
  if (injected?.getToken) {
    return injected
  }
  return {
    getToken: () => null,
    getUser: () => null,
  }
}
