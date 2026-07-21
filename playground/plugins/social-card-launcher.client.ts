type BugfreedbackUiConfig = {
  buttonLayout?: 'horizontal' | 'vertical'
  position?: { edge?: 'left' | 'right' | 'top' | 'bottom', offsetX?: number, offsetY?: number }
}

const DEFAULT_LAUNCHER: BugfreedbackUiConfig = {
  buttonLayout: 'vertical',
  position: { edge: 'right', offsetX: 0, offsetY: 0 },
}

const SOCIAL_CARD_LAUNCHER: BugfreedbackUiConfig = {
  buttonLayout: 'horizontal',
  position: { edge: 'bottom', offsetX: 0, offsetY: 0 },
}

function applyLauncherForPath(path: string): void {
  const config = useRuntimeConfig()
  const bugfreedback = config.public.bugfreedback as BugfreedbackUiConfig
  const patch = path === '/social-card' ? SOCIAL_CARD_LAUNCHER : DEFAULT_LAUNCHER

  bugfreedback.buttonLayout = patch.buttonLayout
  bugfreedback.position = { ...patch.position }
}

export default defineNuxtPlugin(() => {
  const router = useRouter()

  applyLauncherForPath(router.currentRoute.value.path)
  router.afterEach((to) => {
    applyLauncherForPath(to.path)
  })
})
