import { afterEach, describe, expect, it } from 'vitest'
import { resolveExportOptions, resolveStorageOptions } from '../src/runtime/server/utils/resolve-adapters'

function withEnv<T>(values: Record<string, string | undefined>, run: () => T): T {
  const previous = new Map<string, string | undefined>()
  for (const [key, value] of Object.entries(values)) {
    previous.set(key, process.env[key])
    if (value === undefined) {
      Reflect.deleteProperty(process.env, key)
    }
    else {
      process.env[key] = value
    }
  }

  try {
    return run()
  }
  finally {
    for (const [key, value] of previous.entries()) {
      if (value === undefined) {
        Reflect.deleteProperty(process.env, key)
      }
      else {
        process.env[key] = value
      }
    }
  }
}

function clearEnv(keys: readonly string[]): void {
  for (const key of keys) {
    Reflect.deleteProperty(process.env, key)
  }
}

const STORAGE_ENV_KEYS = [
  'NUXT_BUGFREEDBACK_STORAGE_BUCKET',
  'FEEDBACK_GCS_BUCKET',
  'BUGFREEDBACK_GCS_BUCKET',
] as const

const EXPORT_ENV_KEYS = [
  'NUXT_BUGFREEDBACK_EXPORT_TOKEN',
  'GITHUB_FEEDBACK_TOKEN',
  'BUGFREEDBACK_GITHUB_TOKEN',
  'BUGFREEDBACK_WEBHOOK_URL',
  'BUGFREEDBACK_LINEAR_API_KEY',
  'BUGFREEDBACK_LINEAR_TEAM_ID',
  'BUGFREEDBACK_SLACK_WEBHOOK_URL',
  'BUGFREEDBACK_NOTION_TOKEN',
  'BUGFREEDBACK_NOTION_DATABASE_ID',
  'BUGFREEDBACK_JIRA_BASE_URL',
  'BUGFREEDBACK_JIRA_EMAIL',
  'BUGFREEDBACK_JIRA_API_TOKEN',
  'BUGFREEDBACK_JIRA_PROJECT_KEY',
  'BUGFREEDBACK_ASANA_TOKEN',
  'BUGFREEDBACK_ASANA_PROJECT_GID',
  'BUGFREEDBACK_TRELLO_API_KEY',
  'BUGFREEDBACK_TRELLO_TOKEN',
  'BUGFREEDBACK_TRELLO_LIST_ID',
  'BUGFREEDBACK_IFTTT_EVENT_NAME',
  'BUGFREEDBACK_IFTTT_WEBHOOK_KEY',
] as const

afterEach(() => {
  clearEnv(STORAGE_ENV_KEYS)
  clearEnv(EXPORT_ENV_KEYS)
})

describe('resolveStorageOptions', () => {
  it('prefers NUXT_BUGFREEDBACK_STORAGE_BUCKET for GCS', () => {
    withEnv({
      NUXT_BUGFREEDBACK_STORAGE_BUCKET: 'nuxt-bucket',
      FEEDBACK_GCS_BUCKET: 'feedback-bucket',
      BUGFREEDBACK_GCS_BUCKET: 'legacy-bucket',
    }, () => {
      expect(resolveStorageOptions({ provider: 'gcs', bucket: '' })).toMatchObject({
        provider: 'gcs',
        bucket: 'nuxt-bucket',
      })
    })
  })

  it('fills GCS bucket from FEEDBACK_GCS_BUCKET', () => {
    withEnv({ FEEDBACK_GCS_BUCKET: 'runtime-bucket' }, () => {
      expect(resolveStorageOptions({ provider: 'gcs', bucket: '' })).toMatchObject({
        provider: 'gcs',
        bucket: 'runtime-bucket',
      })
    })
  })
})

describe('resolveExportOptions', () => {
  it('returns null when export is undefined', () => {
    expect(resolveExportOptions(undefined)).toBeNull()
  })

  it('prefers NUXT_BUGFREEDBACK_EXPORT_TOKEN for GitHub', () => {
    withEnv({
      NUXT_BUGFREEDBACK_EXPORT_TOKEN: 'nuxt-token',
      GITHUB_FEEDBACK_TOKEN: 'github-token',
    }, () => {
      expect(resolveExportOptions({
        provider: 'github',
        token: '',
        owner: 'bugfreedback',
        repo: 'bugfreedback',
      })).toMatchObject({ token: 'nuxt-token' })
    })
  })

  it('fills GitHub token from GITHUB_FEEDBACK_TOKEN', () => {
    withEnv({ GITHUB_FEEDBACK_TOKEN: 'ghp_runtime' }, () => {
      expect(resolveExportOptions({
        provider: 'github',
        token: '',
        owner: 'bugfreedback',
        repo: 'bugfreedback',
      })).toMatchObject({ token: 'ghp_runtime' })
    })
  })

  it('fills webhook url from BUGFREEDBACK_WEBHOOK_URL', () => {
    withEnv({ BUGFREEDBACK_WEBHOOK_URL: 'https://hooks.example/feedback' }, () => {
      expect(resolveExportOptions({ provider: 'webhook', url: '' })).toMatchObject({
        url: 'https://hooks.example/feedback',
      })
    })
  })

  it('fills Linear credentials from env', () => {
    withEnv({
      BUGFREEDBACK_LINEAR_API_KEY: 'lin_key',
      BUGFREEDBACK_LINEAR_TEAM_ID: 'team_1',
    }, () => {
      expect(resolveExportOptions({ provider: 'linear', apiKey: '', teamId: '' })).toMatchObject({
        apiKey: 'lin_key',
        teamId: 'team_1',
      })
    })
  })

  it('fills Slack webhook from env', () => {
    withEnv({ BUGFREEDBACK_SLACK_WEBHOOK_URL: 'https://hooks.slack.com/services/T/B/X' }, () => {
      expect(resolveExportOptions({ provider: 'slack', webhookUrl: '' })).toMatchObject({
        webhookUrl: 'https://hooks.slack.com/services/T/B/X',
      })
    })
  })

  it('fills Notion credentials from env', () => {
    withEnv({
      BUGFREEDBACK_NOTION_TOKEN: 'secret',
      BUGFREEDBACK_NOTION_DATABASE_ID: 'db',
    }, () => {
      expect(resolveExportOptions({ provider: 'notion', token: '', databaseId: '' })).toMatchObject({
        token: 'secret',
        databaseId: 'db',
      })
    })
  })

  it('fills Jira credentials from env', () => {
    withEnv({
      BUGFREEDBACK_JIRA_BASE_URL: 'https://example.atlassian.net',
      BUGFREEDBACK_JIRA_EMAIL: 'bot@example.com',
      BUGFREEDBACK_JIRA_API_TOKEN: 'token',
      BUGFREEDBACK_JIRA_PROJECT_KEY: 'ENG',
    }, () => {
      expect(resolveExportOptions({
        provider: 'jira',
        baseUrl: '',
        email: '',
        apiToken: '',
        projectKey: '',
      })).toMatchObject({
        baseUrl: 'https://example.atlassian.net',
        email: 'bot@example.com',
        apiToken: 'token',
        projectKey: 'ENG',
      })
    })
  })

  it('fills Asana credentials from env', () => {
    withEnv({
      BUGFREEDBACK_ASANA_TOKEN: 'token',
      BUGFREEDBACK_ASANA_PROJECT_GID: 'proj',
    }, () => {
      expect(resolveExportOptions({ provider: 'asana', token: '', projectGid: '' })).toMatchObject({
        token: 'token',
        projectGid: 'proj',
      })
    })
  })

  it('fills Trello credentials from env', () => {
    withEnv({
      BUGFREEDBACK_TRELLO_API_KEY: 'key',
      BUGFREEDBACK_TRELLO_TOKEN: 'token',
      BUGFREEDBACK_TRELLO_LIST_ID: 'list',
    }, () => {
      expect(resolveExportOptions({
        provider: 'trello',
        apiKey: '',
        token: '',
        listId: '',
      })).toMatchObject({
        apiKey: 'key',
        token: 'token',
        listId: 'list',
      })
    })
  })

  it('fills IFTTT credentials from env', () => {
    withEnv({
      BUGFREEDBACK_IFTTT_EVENT_NAME: 'feedback_received',
      BUGFREEDBACK_IFTTT_WEBHOOK_KEY: 'secret',
    }, () => {
      expect(resolveExportOptions({
        provider: 'ifttt',
        eventName: '',
        webhookKey: '',
      })).toMatchObject({
        eventName: 'feedback_received',
        webhookKey: 'secret',
      })
    })
  })
})
