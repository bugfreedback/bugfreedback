const AUTH_KEY = "bugfreedbackAuth";
export function provideBugfreedbackAuth(provider) {
  const nuxtApp = useNuxtApp();
  nuxtApp.provide(AUTH_KEY, provider);
}
export function useBugfreedbackAuth() {
  const nuxtApp = useNuxtApp();
  const injected = nuxtApp.$bugfreedbackAuth;
  if (injected?.getToken) {
    return injected;
  }
  return {
    getToken: () => null,
    getUser: () => null
  };
}
