export function getCompanyPDF(query) {
  const normalizedQuery = query.toLowerCase()

  if (normalizedQuery.includes('tata')) {
    return '/mock-data/Tata.pdf'
  }

  return null
}
