import { afterEach, describe, expect, it, vi } from 'vitest'
import type { BugfreedbackExportOptions } from '../src/types'
import {
  assertSubmitExportConfigured,
  BugfreedbackSubmitConfigError,
} from '../src/runtime/server/utils/submit'
import { resolveExportOptions } from '../src/runtime/server/utils/resolve-adapters'

const EXPORT_ENV_KEYS = [
  'NUXT_BUGFREEDBACK_EXPORT_TOKEN',
  'GITHUB_FEEDBACK_TOKEN',
  'BUGFREEDBACK_GITHUB_TOKEN',
  'BUGFREEDBACK_WEBHOOK_URL',
] as const

function clearExportEnv(): void {
  for (const key of EXPORT_ENV_KEYS) {
    Reflect.deleteProperty(process.env, key)
  }
}

afterEach(() => {
  clearExportEnv()
})

describe('assertSubmitExportConfigured', () => {
  it('returns resolved export options when GitHub token is present in config', () => {
    const exportConfig: BugfreedbackExportOptions = {
      provider: 'github',
      token: 'ghp_config',
      owner: 'bugfreedback',
      repo: 'bugfreedback',
    }

    expect(assertSubmitExportConfigured(exportConfig)).toEqual(exportConfig)
  })

  it('accepts GitHub export when token is injected from NUXT_BUGFREEDBACK_EXPORT_TOKEN', () => {
    process.env.NUXT_BUGFREEDBACK_EXPORT_TOKEN = 'nuxt-runtime-token'

    const resolved = assertSubmitExportConfigured({
      provider: 'github',
      token: '',
      owner: 'chronosis',
      repo: 'wayfarer',
    })

    expect(resolved).toMatchObject({
      provider: 'github',
      token: 'nuxt-runtime-token',
      owner: 'chronosis',
      repo: 'wayfarer',
    })
  })

  it('accepts GitHub export when token is injected from GITHUB_FEEDBACK_TOKEN', () => {
    process.env.GITHUB_FEEDBACK_TOKEN = 'github-runtime-token'

    const resolved = assertSubmitExportConfigured({
      provider: 'github',
      token: '',
      owner: 'chronosis',
      repo: 'wayfarer',
    })

    expect(resolved).toMatchObject({
      provider: 'github',
      token: 'github-runtime-token',
      owner: 'chronosis',
      repo: 'wayfarer',
    })
  })

  it('throws when export is not configured', () => {
    expect(() => assertSubmitExportConfigured(undefined)).toThrow(BugfreedbackSubmitConfigError)
    expect(() => assertSubmitExportConfigured(undefined)).toThrow(/not configured/)
  })

  it('throws when GitHub export has no token after env resolution', () => {
    expect(() => assertSubmitExportConfigured({
      provider: 'github',
      token: '',
      owner: 'chronosis',
      repo: 'wayfarer',
    })).toThrow(BugfreedbackSubmitConfigError)

    try {
      assertSubmitExportConfigured({
        provider: 'github',
        token: '   ',
        owner: 'chronosis',
        repo: 'wayfarer',
      })
    }
    catch (error) {
      expect(error).toBeInstanceOf(BugfreedbackSubmitConfigError)
      expect((error as BugfreedbackSubmitConfigError).statusCode).toBe(503)
      expect((error as BugfreedbackSubmitConfigError).message).toMatch(/NUXT_BUGFREEDBACK_EXPORT_TOKEN/)
    }
  })

  it('allows non-GitHub providers without a GitHub token', () => {
    process.env.BUGFREEDBACK_WEBHOOK_URL = 'https://hooks.example/feedback'

    const resolved = assertSubmitExportConfigured({
      provider: 'webhook',
      url: '',
    })

    expect(resolved).toMatchObject({
      provider: 'webhook',
      url: 'https://hooks.example/feedback',
    })
  })

  it('uses the injected resolver for unit tests', () => {
    const resolveOptions = vi.fn().mockReturnValue({
      provider: 'slack',
      webhookUrl: 'https://hooks.slack.com/services/T/B/X',
    } satisfies BugfreedbackExportOptions)

    const resolved = assertSubmitExportConfigured(
      { provider: 'slack', webhookUrl: '' },
      resolveOptions,
    )

    expect(resolveOptions).toHaveBeenCalledOnce()
    expect(resolved.provider).toBe('slack')
  })
})

describe('assertSubmitExportConfigured integration with resolveExportOptions', () => {
  it('mirrors Wayfarer runtime env precedence for GitHub tokens', () => {
    process.env.NUXT_BUGFREEDBACK_EXPORT_TOKEN = 'nuxt-token'
    process.env.GITHUB_FEEDBACK_TOKEN = 'github-token'

    const resolved = assertSubmitExportConfigured({
      provider: 'github',
      token: '',
      owner: 'chronosis',
      repo: 'wayfarer',
    }, resolveExportOptions)

    expect(resolved).toMatchObject({
      provider: 'github',
      token: 'nuxt-token',
      owner: 'chronosis',
      repo: 'wayfarer',
    })
  })
})
