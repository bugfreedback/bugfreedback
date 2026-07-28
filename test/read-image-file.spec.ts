import { describe, expect, it } from 'vitest'
import { estimateDataUrlBytes } from '../src/runtime/utils/readImageFileAsDataUrl'

describe('readImageFileAsDataUrl helpers', () => {
  it('estimates decoded bytes from a data URL', () => {
    const png = Buffer.from('hello').toString('base64')
    const dataUrl = `data:image/png;base64,${png}`
    expect(estimateDataUrlBytes(dataUrl)).toBe(5)
  })
})
