<template>
  <div class="page">
    <header class="hero">
      <p class="eyebrow">
        @bugfreedback/bugfreedback
      </p>
      <h1>bugfreedback</h1>
      <p class="lede">
        Capture bugs with screenshots, annotate them, and ship feedback to GitHub, Linear, Slack, and more.
      </p>
    </header>
    <main>
      <p>Use the Feedback launcher on the edge of the screen to try the widget.</p>
    </main>
    <BugfreedbackHost />
  </div>
</template>

<style>
html,
body,
#__nuxt {
  margin: 0;
  min-height: 100%;
  font-family: 'Segoe UI', system-ui, sans-serif;
  background:
    radial-gradient(circle at top left, #e0f2fe, transparent 45%),
    radial-gradient(circle at bottom right, #fef3c7, transparent 40%),
    #f8fafc;
  color: #0f172a;
}
.page {
  max-width: 48rem;
  margin: 0 auto;
  padding: 4rem 1.5rem;
}
.hero h1 {
  font-size: clamp(2.5rem, 8vw, 4rem);
  letter-spacing: -0.04em;
  margin: 0.25rem 0 0.75rem;
}
.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.75rem;
  font-weight: 700;
  color: #0284c7;
  margin: 0;
}
.lede {
  font-size: 1.15rem;
  line-height: 1.5;
  max-width: 36rem;
}
</style>
