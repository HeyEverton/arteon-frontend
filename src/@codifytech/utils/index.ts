import axios from 'axios'

class Utils {
  static copyToClipboard(text: string): boolean {
    const textField = document.createElement('textarea')

    textField.innerText = text
    document.body.appendChild(textField)
    textField.select()

    const success = document.execCommand('copy')

    textField.remove()

    return success
  }

  static cleanEmptyFieldsPayload(payload: any): Record<string, any> {
    if (payload === null || payload === undefined)
      return {}

    const cleanPayload: Record<string, any> = {}

    Object.entries(payload).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        const cleanedArray = value
          .map(item => (typeof item === 'object' && item !== null && !(item instanceof File) ? Utils.cleanEmptyFieldsPayload(item) : item))
          .filter(item =>
            item !== null
            && item !== undefined
            && item !== ''
            && item !== 'null'
            && item !== 'undefined'
            && item !== '""'
            && (!(typeof item === 'object' && !Array.isArray(item)) || Object.keys(item).length > 0),
          )

        if (cleanedArray.length > 0)
          cleanPayload[key] = cleanedArray
      }
      else if (value && typeof value === 'object' && !(value instanceof File)) {
        const nestedCleaned = Utils.cleanEmptyFieldsPayload(value)
        if (Object.keys(nestedCleaned).length > 0)
          cleanPayload[key] = nestedCleaned
      }
      else if (
        value !== null
        && value !== undefined
        && value !== ''
        && value !== 'null'
        && value !== 'undefined'
        && value !== '""'
      ) {
        cleanPayload[key] = value
      }
    })

    return cleanPayload
  }

  static async searchCEP(cep: string): Promise<{ logradouro: string, cidade: string, bairro: string, estado: string }> {
    if (!cep || cep.length < 9)
      throw new Error('CEP inválido')

    return await axios
      .get(`https://viacep.com.br/ws/${cep}/json/`)
      .then((response: any) => {
        return {
          logradouro: response.data.logradouro,
          cidade: response.data.localidade,
          bairro: response.data.bairro,
          estado: response.data.uf,
        }
      })
  }

  static formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  static downloadBase64Pdf(base64: string, filename: string) {
    const byteCharacters = atob(base64)
    const byteNumbers = Array.from({ length: byteCharacters.length })
    for (let i = 0; i < byteCharacters.length; i++)
      byteNumbers[i] = byteCharacters.charCodeAt(i)

    const byteArray = new Uint8Array(byteNumbers)
    const blob = new Blob([byteArray], { type: 'application/pdf' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  static paginationMeta = <T extends { page: number, itemsPerPage: number }>(options: T, total: number) => {
    const start = (options.page - 1) * options.itemsPerPage + 1
    const end = Math.min(options.page * options.itemsPerPage, total)

    return `Showing ${total === 0 ? 0 : start} to ${end} of ${total} entries`
  }

  static avatarTwoText = (value: string) => {
    if (!value)
      return ''
    const nameArray = value.split(' ')

    return nameArray.slice(0, 2).map(word => word.charAt(0).toUpperCase()).join('')
  }

  static matchNumbers(value: string | number | number[] = '') {
    const match = value
      .toString()
      .replace(/\D+/g, '')
      .match(/\d/g)

    return Array.isArray(match) ? match.map(Number) : []
  }

  static validCalc(x: number, numbers: number[]) {
    let factor = x - 7
    let sum = 0
    for (let i = 0; i < x; i++) {
      sum += numbers[i] * factor--
      if (factor < 2)
        factor = 9
    }
    const result = 11 - (sum % 11)

    return result > 9 ? 0 : result
  }

  /**
   * Determines if the provided data contains any File or Blob objects.
   *
   * @param {any} data - The data object to inspect for File or Blob instances.
   * @return {boolean} - Returns true if any value in the data is a File or Blob, otherwise false.
   */
  static hasFiles(data: any): boolean {
    if (!data || typeof data !== 'object')
      return false

    // Verifica se algum valor do payload é um tipo File ou Blob
    return Object.values(data).some(value => value instanceof File || value instanceof Blob)
  }
}

export default Utils
