import { describe, expect, it, vi } from 'vitest'
import {
  buildGithubIssueBody,
  createGithubExportAdapter,
} from '../src/runtime/server/adapters/export/github'
import { createWebhookExportAdapter } from '../src/runtime/server/adapters/export/webhook'
import { createLinearExportAdapter } from '../src/runtime/server/adapters/export/linear'
import { createSlackExportAdapter } from '../src/runtime/server/adapters/export/slack'
import { createIftttExportAdapter } from '../src/runtime/server/adapters/export/ifttt'

const sampleInput = {
  title: 'Broken button',
  description: 'Clicking save does nothing',
  email: 'tester@example.com',
  screenshotUrl: 'https://example.com/a.png',
  metadata: { path: '/characters', appVersion: '0.1.0' },
}

describe('github export adapter', () => {
  it('builds a markdown issue body with screenshot and metadata', () => {
    const body = buildGithubIssueBody(sampleInput)
    expect(body).toContain('## Description')
    expect(body).toContain('Clicking save does nothing')
    expect(body).toContain('![Feedback screenshot](https://example.com/a.png)')
    expect(body).toContain('tester@example.com')
    expect(body).toContain('"path": "/characters"')
  })

  it('creates a GitHub issue via fetch', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ number: 42, html_url: 'https://github.com/bugfreedback/bugfreedback/issues/42' }),
    })

    const adapter = createGithubExportAdapter({
      token: 'ghp_test',
      owner: 'bugfreedback',
      repo: 'bugfreedback',
      fetchImpl: fetchImpl as unknown as typeof fetch,
    })

    const result = await adapter.create({ ...sampleInput, labels: ['feedback'] })
    expect(result).toEqual({
      id: '42',
      url: 'https://github.com/bugfreedback/bugfreedback/issues/42',
    })
    expect(fetchImpl).toHaveBeenCalledWith(
      'https://api.github.com/repos/bugfreedback/bugfreedback/issues',
      expect.objectContaining({ method: 'POST' }),
    )
  })
})

describe('webhook export adapter', () => {
  it('posts JSON payload to the configured URL', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ id: 'wh-1', url: 'https://hooks.example/1' }),
    })
    const adapter = createWebhookExportAdapter({
      url: 'https://hooks.example/feedback',
      fetchImpl: fetchImpl as unknown as typeof fetch,
    })
    const result = await adapter.create(sampleInput)
    expect(result).toEqual({ id: 'wh-1', url: 'https://hooks.example/1' })
    expect(fetchImpl).toHaveBeenCalledWith(
      'https://hooks.example/feedback',
      expect.objectContaining({ method: 'POST' }),
    )
  })
})

describe('linear export adapter', () => {
  it('creates an issue via GraphQL', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        data: {
          issueCreate: {
            success: true,
            issue: { id: 'iss_1', url: 'https://linear.app/issue/ENG-1' },
          },
        },
      }),
    })
    const adapter = createLinearExportAdapter({
      apiKey: 'lin_key',
      teamId: 'team_1',
      fetchImpl: fetchImpl as unknown as typeof fetch,
    })
    const result = await adapter.create(sampleInput)
    expect(result).toEqual({ id: 'iss_1', url: 'https://linear.app/issue/ENG-1' })
  })
})

describe('slack export adapter', () => {
  it('posts blocks to the incoming webhook', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({ ok: true, text: async () => 'ok' })
    const adapter = createSlackExportAdapter({
      webhookUrl: 'https://hooks.slack.com/services/T/B/X',
      fetchImpl: fetchImpl as unknown as typeof fetch,
    })
    const result = await adapter.create(sampleInput)
    expect(result.id).toBe('slack-ok')
  })
})

describe('ifttt export adapter', () => {
  it('triggers the maker webhook', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({ ok: true, text: async () => 'Congratulations!' })
    const adapter = createIftttExportAdapter({
      eventName: 'feedback_received',
      webhookKey: 'secret',
      fetchImpl: fetchImpl as unknown as typeof fetch,
    })
    const result = await adapter.create(sampleInput)
    expect(result.id).toBe('ifttt-ok')
    expect(fetchImpl).toHaveBeenCalledWith(
      'https://maker.ifttt.com/trigger/feedback_received/with/key/secret',
      expect.objectContaining({ method: 'POST' }),
    )
  })
})

describe('jira export adapter', () => {
  it('creates an issue', async () => {
    const { createJiraExportAdapter } = await import('../src/runtime/server/adapters/export/jira')
    const fetchImpl = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ id: '10001', key: 'ENG-9' }),
    })
    const adapter = createJiraExportAdapter({
      baseUrl: 'https://example.atlassian.net',
      email: 'bot@example.com',
      apiToken: 'token',
      projectKey: 'ENG',
      fetchImpl: fetchImpl as unknown as typeof fetch,
    })
    const result = await adapter.create(sampleInput)
    expect(result).toEqual({ id: 'ENG-9', url: 'https://example.atlassian.net/browse/ENG-9' })
  })
})

describe('notion export adapter', () => {
  it('creates a page', async () => {
    const { createNotionExportAdapter } = await import('../src/runtime/server/adapters/export/notion')
    const fetchImpl = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ id: 'page_1', url: 'https://notion.so/page_1' }),
    })
    const adapter = createNotionExportAdapter({
      token: 'secret',
      databaseId: 'db',
      fetchImpl: fetchImpl as unknown as typeof fetch,
    })
    const result = await adapter.create(sampleInput)
    expect(result.id).toBe('page_1')
  })
})

describe('asana export adapter', () => {
  it('creates a task', async () => {
    const { createAsanaExportAdapter } = await import('../src/runtime/server/adapters/export/asana')
    const fetchImpl = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: { gid: 'task_1', permalink_url: 'https://app.asana.com/0/1/task_1' } }),
    })
    const adapter = createAsanaExportAdapter({
      token: 'token',
      projectGid: 'proj',
      fetchImpl: fetchImpl as unknown as typeof fetch,
    })
    const result = await adapter.create(sampleInput)
    expect(result.id).toBe('task_1')
  })
})

describe('trello export adapter', () => {
  it('creates a card', async () => {
    const { createTrelloExportAdapter } = await import('../src/runtime/server/adapters/export/trello')
    const fetchImpl = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ id: 'card_1', shortUrl: 'https://trello.com/c/abc' }),
    })
    const adapter = createTrelloExportAdapter({
      apiKey: 'key',
      token: 'token',
      listId: 'list',
      fetchImpl: fetchImpl as unknown as typeof fetch,
    })
    const result = await adapter.create(sampleInput)
    expect(result).toEqual({ id: 'card_1', url: 'https://trello.com/c/abc' })
  })
})
