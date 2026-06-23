export function sanitizeHtml(str: string): string {
  return str.replace(/<[^>]*>/g, '').trim()
}
