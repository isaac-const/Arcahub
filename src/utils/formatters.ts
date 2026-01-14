export const smartUrl = (url: string) => {
  const clean = url.trim()
  if (!clean) return ''
  if (!/^https?:\/\//i.test(clean) && clean.includes('.')) {
    return `https://${clean}`
  }
  return clean
}