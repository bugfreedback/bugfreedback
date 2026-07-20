import { describe, expect, it } from 'vitest'
import { resolveExportOptions, resolveStorageOptions } from '../src/runtime/server/utils/resolve-adapters'

describe('resolveStorageOptions', () => {
  it('fills GCS bucket from FEEDBACK_GCS_BUCKET', () => {
    const previous = process.env.FEEDBACK_GCS_BUCKET
    process.env.FEEDBACK_GCS_BUCKET = 'runtime-bucket'
    try {
      const resolved = resolveStorageOptions({ provider: 'gcs', bucket: '' })
      expect(resolved).toMatchObject({ provider: 'gcs', bucket: 'runtime-bucket' })
    }
    finally {
      if (previous === undefined) {
        delete process.env.FEEDBACK_GCS_BUCKET
      }
      else {
        process.env.FEEDBACK_GCS_BUCKET = previous
      }
    }
  })
})

describe('resolveExportOptions', () => {
  it('fills GitHub token from GITHUB_FEEDBACK_TOKEN', () => {
    const previous = process.env.GITHUB_FEEDBACK_TOKEN
    process.env.GITHUB_FEEDBACK_TOKEN = 'ghp_runtime'
    try {
      const resolved = resolveExportOptions({
        provider: 'github',
        token: '',
        owner: 'bugfreedback',
        repo: 'bugfreedback',
      })
      expect(resolved).toMatchObject({ token: 'ghp_runtime' })
    }
    finally {
      if (previous === undefined) {
        delete process.env.GITHUB_FEEDBACK_TOKEN
      }
      else {
        process.env.GITHUB_FEEDBACK_TOKEN = previous
      }
    }
  })
})
