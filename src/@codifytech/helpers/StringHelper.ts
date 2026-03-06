const DEFAULT_SEPARATOR: string = '-'
const DEFAULT_LANGUAGE: string = 'pt-BR'
const DEFAULT_DICTIONARY: Record<string, string> = { '@': 'at' }

export const slug = (
  title: string,
  separator: string = DEFAULT_SEPARATOR,
  language: string = DEFAULT_LANGUAGE,
  dictionary: Record<string, string> = DEFAULT_DICTIONARY,
) => {
  if (!title)
    return

  title = language ? ascii(title, language) : title

  // Convert all dashes/underscores into separator
  const flip: string = separator === DEFAULT_SEPARATOR ? '_' : '-'
  const flipRegex: RegExp = new RegExp(`[${escapeRegExp(flip)}]+`, 'gu')

  title = title.replace(flipRegex, separator)

  // Replace dictionary words
  for (const key in dictionary) {
    if (Object.prototype.hasOwnProperty.call(dictionary, key))
      dictionary[key] = `${separator}${dictionary[key]}${separator}`
  }

  for (const key in dictionary) {
    if (Object.prototype.hasOwnProperty.call(dictionary, key)) {
      const value = dictionary[key]

      title = title.replace(new RegExp(escapeRegExp(key), 'g'), value)
    }
  }

  // Remove all characters that are not the separator, letters, numbers, or whitespace
  const invalidCharsRegex: RegExp = new RegExp(`[^${escapeRegExp(separator)}\\p{L}\\p{N}\\s]+`, 'gu')

  title = toLowerCase(title).replace(invalidCharsRegex, '')

  // Replace all separator characters and whitespace by a single separator
  const separatorWhitespaceRegex: RegExp = new RegExp(`[${escapeRegExp(separator)}\\s]+`, 'gu')

  title = title.replace(separatorWhitespaceRegex, separator)

  return title.trim().replace(new RegExp(`^${separator}|${separator}$`, 'g'), '')
}

function ascii(title: string, language: string): string {
  // Implementation of ASCII conversion based on language will vary
  // Placeholder implementation for illustration
  return title.normalize('NFD').replace(/[\u0300-\u036F]/g, '')
}

function escapeRegExp(string: string): string {
  return string.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')
}

export const toLowerCase = (string: string) => {
  return string.toLocaleLowerCase()
}

export const toCamelCase = (title: string) => {
  if (!title)
    return

  // Convert the string to use a default separator to normalize different cases
  title = slug(title, ' ')

  // Split by whitespace, convert to camelCase
  const words = title.split(' ')
  const result = words[0].toLowerCase()
  const capitalized = words.slice(1).map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())

  return result + capitalized.join('')
}
