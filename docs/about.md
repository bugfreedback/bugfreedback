---
title: About
description: Why bugfreedback exists — self-hosted feedback capture that routes to the tools your team already uses, without another subscription portal.
ogImage: /hero-launcher.png
ogImageAlt: bugfreedback Feedback launcher button
---

# About bugfreedback

bugfreedback is a **Nuxt module** for capturing annotated user feedback from your own application and routing it to services your team already uses — GitHub Issues, Linear, Jira, Notion, Slack, and others.

It exists because I kept hitting the same wall with hosted bug-reporting products.

## The problem with another feedback portal

After trying several popular tools — including [Ybug](https://ybug.io/), [BetterBugs](https://betterbugs.io/), [Jam.dev](https://jam.dev/), and [Bugfender](https://bugfender.com/) — I consistently ran into two frustrations:

1. **External portals** — feedback lived in someone else's dashboard. Triage meant leaving our existing workflow, signing into yet another product, and reconciling reports across systems.
2. **Paid integrations** — many tools charge subscriptions just to connect with services teams already pay for and live in every day (issue trackers, chat, docs).

I did not want screenshot annotation and user feedback to require **another vendor**, **another login**, and **another monthly bill** for the privilege of sending data to GitHub or Linear.

## What bugfreedback does differently

bugfreedback runs **inside your Nuxt app**:

- Users submit feedback from a launcher embedded in your UI
- Screenshots can be captured and annotated in-browser
- Submissions export to **your** configured destination via adapters
- Storage stays in **your** GCS or S3 bucket when you need durable screenshot URLs

There is no bugfreedback-hosted management console. You keep control of the data path end to end.

## Design goals

| Goal | How |
|------|-----|
| No lock-in | MIT-licensed module; configure storage and export yourself |
| Use existing tools | Export adapters for GitHub, Linear, Jira, Notion, Slack, Asana, Trello, webhooks, IFTTT |
| Honest scope | A feedback widget and server adapters — not a full product-management suite |
| Nuxt-native | `@nuxt/ui` components, composables, and a single `<BugfreedbackHost />` mount |

## Who it is for

bugfreedback fits teams that:

- Already track bugs and requests in GitHub Issues, Linear, Jira, or similar
- Want in-app screenshot feedback without routing users to a third-party portal
- Prefer self-hosted or bring-your-own-cloud storage over SaaS lock-in
- Need a lightweight integration they can audit, fork, and extend

If you need session replay, full product analytics, or a standalone feedback CRM, a dedicated SaaS may still be the better fit. bugfreedback focuses on **capture, annotate, and route** — deliberately.

## Get started

- [Getting started](./guide/getting-started.md) — install and configure the module
- [Adapters overview](./guide/adapters.md) — choose storage and export providers
- [Local demo](./guide/demo.md) — try the widget in the included playground

Questions and contributions are welcome on [GitHub](https://github.com/bugfreedback/bugfreedback).
