<template>
  <div class="demo">
    <header class="demo__header">
      <div class="demo__brand">
        <span class="demo__logo">bf</span>
        <span>Acme Dashboard</span>
      </div>
      <nav
        class="demo__nav"
        aria-label="Demo navigation"
      >
        <a href="#">Overview</a>
        <a href="#">Projects</a>
        <a href="#">Settings</a>
      </nav>
    </header>

    <section class="demo__hero">
      <p class="demo__eyebrow">
        bugfreedback playground
      </p>
      <h1>Example app for docs &amp; screenshots</h1>
      <p class="demo__lede">
        This Nuxt app loads the module from <code>../src/module</code>. Use the
        <strong>Feedback</strong> launcher on the right edge to exercise the full flow:
        form → optional capture → annotate → submit.
      </p>
      <ul class="demo__steps">
        <li>Click <strong>Feedback</strong> on the mid-right edge</li>
        <li>Fill the form or attach a screenshot</li>
        <li>Annotate with pen, shapes, text, or redaction</li>
        <li>Submit (playground uses <code>storage: none</code> + webhook stub)</li>
      </ul>
    </section>

    <section
      class="demo__grid"
      aria-label="Sample dashboard cards"
    >
      <article
        v-for="card in cards"
        :key="card.title"
        class="demo__card"
      >
        <h2>{{ card.title }}</h2>
        <p>{{ card.body }}</p>
        <button
          type="button"
          class="demo__card-btn"
        >
          {{ card.action }}
        </button>
      </article>
    </section>

    <footer class="demo__footer">
      <p>
        Run locally: <code>npm run dev</code> from the repo root · Docs:
        <a href="https://bugfreedback.github.io/bugfreedback/">bugfreedback.github.io</a>
      </p>
    </footer>

    <BugfreedbackHost />
  </div>
</template>

<script setup lang="ts">
import { createDemoScreenshot } from './utils/createDemoScreenshot'

const cards = [
  {
    title: 'Active users',
    body: 'Sample metric card — useful background when capturing the launcher over a realistic UI.',
    action: 'View report',
  },
  {
    title: 'Open issues',
    body: 'Feedback submissions from this demo can route to GitHub, Linear, Slack, and other adapters.',
    action: 'See queue',
  },
  {
    title: 'Deployments',
    body: 'Screenshot the form, annotate step, and toolbar separately for documentation.',
    action: 'Open pipeline',
  },
]

const route = useRoute()
const widget = useBugfreedbackWidget()

onMounted(async () => {
  const demo = route.query.demo
  if (typeof demo !== 'string' || !demo.startsWith('annotate')) {
    return
  }

  await nextTick()
  widget.title.value = 'Sample feedback for docs'
  widget.open.value = true
  widget.originalScreenshotDataUrl.value = createDemoScreenshot()
  widget.step.value = 'annotate'

  if (demo !== 'annotate-text') {
    return
  }

  await waitFor(() => document.querySelector('.bf-annotator canvas'))
  await nextTick()

  document.querySelector<HTMLButtonElement>('button[aria-label="Text"]')?.click()
  await nextTick()

  const canvas = document.querySelector<HTMLCanvasElement>('.bf-annotator canvas')
  if (!canvas) {
    return
  }

  const rect = canvas.getBoundingClientRect()
  const x = rect.left + rect.width * 0.35
  const y = rect.top + rect.height * 0.42
  const pointerOpts: PointerEventInit = {
    bubbles: true,
    clientX: x,
    clientY: y,
    pointerId: 1,
    pointerType: 'mouse',
    isPrimary: true,
  }
  canvas.dispatchEvent(new PointerEvent('pointerdown', pointerOpts))
  canvas.dispatchEvent(new PointerEvent('pointerup', pointerOpts))

  await nextTick()
  const input = document.querySelector<HTMLInputElement>('#bugfreedback-annotate-text-input')
  if (input) {
    input.value = 'Highlight this area'
    input.dispatchEvent(new Event('input', { bubbles: true }))
  }
})

function waitFor(predicate: () => unknown, timeoutMs = 5000): Promise<void> {
  return new Promise((resolve, reject) => {
    const started = Date.now()
    const tick = () => {
      if (predicate()) {
        resolve()
        return
      }
      if (Date.now() - started > timeoutMs) {
        reject(new Error('Timed out waiting for annotate UI'))
        return
      }
      requestAnimationFrame(tick)
    }
    tick()
  })
}
</script>

<style>
html,
body,
#__nuxt {
  margin: 0;
  min-height: 100%;
  font-family: 'Segoe UI', system-ui, sans-serif;
  background:
    radial-gradient(circle at 12% 8%, rgba(14, 165, 233, 0.18), transparent 42%),
    radial-gradient(circle at 88% 92%, rgba(251, 191, 36, 0.16), transparent 38%),
    #f1f5f9;
  color: #0f172a;
}

.demo {
  max-width: 56rem;
  margin: 0 auto;
  padding: 1.5rem 1.25rem 4rem;
}

.demo__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.75rem 1rem;
  margin-bottom: 2rem;
  border-radius: 0.75rem;
  background: rgba(255, 255, 255, 0.85);
  border: 1px solid rgba(15, 23, 42, 0.08);
  backdrop-filter: blur(8px);
}

.demo__brand {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  font-weight: 600;
}

.demo__logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
  background: #0ea5e9;
  color: #fff;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: -0.04em;
}

.demo__nav {
  display: flex;
  gap: 1rem;
  font-size: 0.875rem;
}

.demo__nav a {
  color: #475569;
  text-decoration: none;
}

.demo__nav a:hover {
  color: #0ea5e9;
}

.demo__hero {
  margin-bottom: 2rem;
}

.demo__eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.7rem;
  font-weight: 700;
  color: #0284c7;
  margin: 0 0 0.5rem;
}

.demo__hero h1 {
  font-size: clamp(1.75rem, 5vw, 2.75rem);
  letter-spacing: -0.03em;
  margin: 0 0 0.75rem;
  line-height: 1.15;
}

.demo__lede {
  font-size: 1.05rem;
  line-height: 1.55;
  max-width: 42rem;
  color: #334155;
  margin: 0 0 1rem;
}

.demo__steps {
  margin: 0;
  padding-left: 1.25rem;
  color: #475569;
  line-height: 1.6;
}

.demo__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.demo__card {
  padding: 1.25rem;
  border-radius: 0.75rem;
  background: #fff;
  border: 1px solid rgba(15, 23, 42, 0.08);
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
}

.demo__card h2 {
  margin: 0 0 0.5rem;
  font-size: 1rem;
}

.demo__card p {
  margin: 0 0 1rem;
  font-size: 0.875rem;
  color: #64748b;
  line-height: 1.5;
}

.demo__card-btn {
  border: 0;
  border-radius: 0.375rem;
  padding: 0.35rem 0.75rem;
  font-size: 0.8rem;
  font-weight: 600;
  background: #e0f2fe;
  color: #0369a1;
  cursor: pointer;
}

.demo__footer {
  font-size: 0.8rem;
  color: #64748b;
}

.demo__footer a {
  color: #0284c7;
}

code {
  font-size: 0.85em;
  background: rgba(15, 23, 42, 0.06);
  padding: 0.1em 0.35em;
  border-radius: 0.25rem;
}
</style>
