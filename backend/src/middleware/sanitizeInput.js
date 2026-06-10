import sanitizeHtml from 'sanitize-html'

const SANITIZE_OPTIONS = { allowedTags: [], allowedAttributes: {} }

export function sanitizeFields(obj, fields) {
  const result = { ...obj }
  for (const field of fields) {
    if (typeof result[field] === 'string') {
      result[field] = sanitizeHtml(result[field], SANITIZE_OPTIONS).trim()
    }
  }
  return result
}
