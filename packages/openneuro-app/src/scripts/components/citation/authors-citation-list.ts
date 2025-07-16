export function authorsCitationList(authors: string[], limit?: number): string {
  let formattedAuthors = "NO AUTHORS FOUND"
  if (authors && authors.length > 0) {
    if (!limit || authors.length <= limit) {
      // Pre-Limit
      // Join with commas, with "and" before the last author
      if (authors.length === 1) {
        formattedAuthors = authors[0]
      } else if (authors.length === 2) {
        formattedAuthors = `${authors[0]} and ${authors[1]}`
      } else {
        const lastAuthor = authors[authors.length - 1]
        const remainingAuthors = authors.slice(0, authors.length - 1)
        formattedAuthors = `${remainingAuthors.join(", ")}, and ${lastAuthor}`
      }
    } else {
      // Limit to `limit` authors and add "et al."
      const limitedAuthors = authors.slice(0, limit)
      formattedAuthors = `${limitedAuthors.join(", ")}, et al.`
    }
  }
  return formattedAuthors
}
