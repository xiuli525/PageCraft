import { nanoid } from 'nanoid'

export const ROOT_ID = 'ROOT'

export function generateId(size = 12): string {
  return nanoid(size)
}
