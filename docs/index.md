---
# https://vitepress.dev/reference/default-theme-home-page
layout: home
title: bugfreedback
description: Self-hosted Nuxt feedback widget with screenshot capture, annotation, and exports to GitHub, Linear, Slack, and more — no external portal required.
ogImage: /og-share.png
ogImageAlt: bugfreedback — Feedback for Nuxt with a horizontal Feedback launcher button

hero:
  name: bugfreedback
  text: Feedback for Nuxt
  tagline: Capture, annotate, and route feedback reports to the tools your team already uses. Bug-free Feedback
  image:
    src: /hero-launcher.png
    alt: Feedback launcher button on the edge of your app
  actions:
    - theme: brand
      text: Get started
      link: /guide/getting-started
    - theme: alt
      text: About
      link: /about
    - theme: alt
      text: Local demo
      link: /guide/demo
    - theme: alt
      text: Adapters
      link: /guide/adapters
    - theme: alt
      text: GitHub
      link: https://github.com/bugfreedback/bugfreedback

features:
  - title: Screen capture + annotate
    details: Optional tab capture with pens, shapes, text, and redaction — no third-party SDK.
  - title: Pluggable storage
    details: Upload screenshots to GCS or S3-compatible buckets with durable public URLs.
  - title: Modular exports
    details: GitHub Issues, Linear, Jira, Notion, Slack, Asana, Trello, Webhook, and IFTTT.
  - title: Local demo
    details: Clone the repo and run npm run dev to try the widget on a sample Nuxt app before integrating it.
---
