export function getCompanyPDF(query) {
  const normalizedQuery = query.toLowerCase()

  if (normalizedQuery.includes('tata')) {
    return '/mock-data/Tata.pdf'
  }

  if (normalizedQuery.includes('reliance')) {
    return '/mock-data/Reliance.pdf'
  }

  if (normalizedQuery.includes('adani')) {
    return '/mock-data/Adani.pdf'
  }

  if (normalizedQuery.includes('infosys')) {
    return '/mock-data/Infosys.pdf'
  }

  if (normalizedQuery.includes('vardhman')) {
    return '/mock-data/Vardhaman.pdf'
  }

  if (normalizedQuery.includes('amrutulya')) {
    return '/mock-data/Amratulya.pdf'
  }

  return null
}
