import Utils from '@codifytech/utils'
import { regexCNPJ } from '@codifytech/utils/constants'
import { isEmpty, isEmptyArray, isNullOrUndefined } from './helpers'

/**
 * Valida se o valor está presente e não é vazio.
 * @param value Valor a ser validado.
 * @returns true se válido, mensagem de erro caso contrário.
 */
export const requiredValidator = (value: unknown) => {
  if (isNullOrUndefined(value) || isEmptyArray(value) || value === false)
    return 'Este campo é obrigatório.'
  if (typeof value === 'string' && !value.trim().length)
    return 'Este campo é obrigatório.'

  return true
}

/**
 * Valida se o valor é um e-mail válido.
 * @param value Valor a ser validado (string ou array de strings).
 * @returns true se válido, mensagem de erro caso contrário.
 */
export const emailValidator = (value: unknown) => {
  if (isEmpty(value))
    return true
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\])|(([a-z\-\d]+\.)+[a-z]{2,}))$/i
  if (Array.isArray(value))
    return value.every(val => re.test(String(val))) ? true : 'Todos os e-mails precisam ser válidos.'

  return re.test(String(value)) ? true : 'O e-mail precisa ser válido.'
}

/**
 * Valida se a senha atende aos requisitos de segurança.
 * @param password Senha a ser validada.
 * @returns true se válido, mensagem de erro caso contrário.
 */
export const passwordValidator = (password: string) => {
  const regExp = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%&*()]).{8,}$/

  return regExp.test(password)
    ? true
    : 'A senha deve conter ao menos 8 caracteres, incluindo maiúscula, minúscula, número e caractere especial.'
}

/**
 * Valida se dois campos possuem o mesmo valor.
 * @param value Valor do campo.
 * @param target Valor de comparação.
 * @returns true se iguais, mensagem de erro caso contrário.
 */
export const confirmedValidator = (value: string, target: string) =>
  value === target ? true : 'Os campos não conferem.'

/**
 * Valida se o valor está entre um mínimo e máximo.
 * @param value Valor a ser validado.
 * @param min Valor mínimo.
 * @param max Valor máximo.
 * @returns true se válido, mensagem de erro caso contrário.
 */
export const betweenValidator = (value: unknown, min: number, max: number) => {
  const valueAsNumber = Number(value)
  if (isNaN(valueAsNumber))
    return `O valor deve ser um número entre ${min} e ${max}.`

  return valueAsNumber >= min && valueAsNumber <= max
    ? true
    : `O valor deve ser entre ${min} e ${max}.`
}

/**
 * Valida se o valor é um número inteiro.
 * @param value Valor a ser validado (string, number ou array).
 * @returns true se válido, mensagem de erro caso contrário.
 */
export const integerValidator = (value: unknown) => {
  if (isEmpty(value))
    return true
  const isInt = (val: unknown) => /^-?\d+$/.test(String(val))
  if (Array.isArray(value))
    return value.every(isInt) ? true : 'Todos os valores devem ser inteiros.'

  return isInt(value) ? true : 'O valor deve ser um número inteiro.'
}

/**
 * Valida se o valor corresponde a um padrão regex.
 * @param value Valor a ser validado.
 * @param regex Expressão regular ou string.
 * @returns true se válido, mensagem de erro caso contrário.
 */
export const regexValidator = (value: unknown, regex: RegExp | string): string | boolean => {
  if (isEmpty(value))
    return true
  let regeX = regex
  if (typeof regeX === 'string')
    regeX = new RegExp(regeX)
  if (Array.isArray(value))
    return value.every(val => regexValidator(val, regeX) === true) ? true : 'Valor inválido pelo padrão.'

  return regeX.test(String(value)) ? true : 'Valor inválido pelo padrão.'
}

/**
 * Valida se o valor contém apenas letras.
 * @param value Valor a ser validado.
 * @returns true se válido, mensagem de erro caso contrário.
 */
export const alphaValidator = (value: unknown) => {
  if (isEmpty(value))
    return true

  return /^[A-Za-zÀ-ÿ\s]+$/.test(String(value)) ? true : 'O campo deve conter apenas letras.'
}

/**
 * Valida se o valor é uma URL válida.
 * @param value Valor a ser validado.
 * @returns true se válido, mensagem de erro caso contrário.
 */
export const urlValidator = (value: unknown) => {
  if (isEmpty(value))
    return true
  const re = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/\S*)?$/i

  return re.test(String(value)) ? true : 'A URL informada é inválida.'
}

/**
 * Valida se o valor possui um tamanho exato.
 * @param value Valor a ser validado.
 * @param length Tamanho esperado.
 * @returns true se válido, mensagem de erro caso contrário.
 */
export const lengthValidator = (value: unknown, length: number) => {
  if (isEmpty(value))
    return true

  return String(value).length === length
    ? true
    : `O campo deve ter exatamente ${length} caracteres.`
}

export const minLengthValidator = (value: unknown, length: number) => {
  if (isEmpty(value))
    return true
  const strValue = String(value)

  return strValue.length >= length
    ? true
    : `O campo deve ter pelo menos ${length} caracteres.`
}
export const maxLengthValidator = (value: unknown, length: number) => {
  if (isEmpty(value))
    return true
  const strValue = String(value)

  return strValue.length <= length
    ? true
    : `O campo deve ter no máximo ${length} caracteres.`
}

/**
 * Valida se o valor contém apenas letras, números, hífens ou underlines.
 * @param value Valor a ser validado.
 * @returns true se válido, mensagem de erro caso contrário.
 */
export const alphaDashValidator = (value: unknown) => {
  if (isEmpty(value))
    return true

  return /^[\w-]+$/.test(String(value)) ? true : 'O campo deve conter apenas letras, números, hífens ou underlines.'
}

/**
 * Valida se a data informada é maior que a data atual.
 * @param data Data a ser validada (string).
 * @returns true se válido, mensagem de erro caso contrário.
 */
export const greaterDateThanToday = (data: string) => {
  if (!data)
    return 'A data é obrigatória.'
  const dataSelecionada = new Date(data)
  const hoje = new Date()

  hoje.setHours(0, 0, 0, 0)

  return dataSelecionada > hoje ? true : 'A data inserida precisa ser maior que hoje.'
}

/**
 * Valida se o valor é um CNPJ válido.
 * @param value Valor a ser validado (string, number ou array).
 * @returns true se válido, mensagem de erro caso contrário.
 */
export const cnpjValidator = (value: string | number | number[] = '') => {
  if (!value)
    return 'O CNPJ é obrigatório.'
  const isString = typeof value === 'string'
  if (isString && !regexCNPJ.test(value))
    return 'O CNPJ deve estar no formato 00.000.000/0000-00.'
  const numbers = Utils.matchNumbers(value)
  if (numbers.length !== 14)
    return 'O CNPJ deve conter 14 dígitos.'
  const items = [...new Set(numbers)]
  if (items.length === 1)
    return 'CNPJ inválido.'
  const digit0 = Utils.validCalc(12, numbers)
  const digit1 = Utils.validCalc(13, numbers)

  return (digit0 === numbers[12] && digit1 === numbers[13])
    ? true
    : 'Você precisa informar um CNPJ válido.'
}

/**
 * Valida se o valor é um CPF válido.
 * @param cpf CPF a ser validado (string).
 * @returns true se válido, mensagem de erro caso contrário.
 */
export const cpfValidator = (cpf: string) => {
  if (isEmpty(cpf))
    return true

  cpf = cpf.replace(/\D+/g, '')
  if (cpf.length !== 11)
    return 'O CPF deve conter 11 dígitos.'
  if (/^(\d)\1{10}$/.test(cpf))
    return 'CPF inválido.'
  let sum = 0
  let rest
  for (let i = 1; i <= 9; i++)
    sum += Number.parseInt(cpf.substring(i - 1, i)) * (11 - i)
  rest = (sum * 10) % 11
  if (rest === 10 || rest === 11)
    rest = 0
  if (rest !== Number.parseInt(cpf.substring(9, 10)))
    return 'Você precisa informar um CPF válido.'
  sum = 0
  for (let i = 1; i <= 10; i++)
    sum += Number.parseInt(cpf.substring(i - 1, i)) * (12 - i)
  rest = (sum * 10) % 11
  if (rest === 10 || rest === 11)
    rest = 0
  if (rest !== Number.parseInt(cpf.substring(10, 11)))
    return 'Você precisa informar um CPF válido.'

  return true
}

/**
 * Valida se o valor é um CEP válido.
 * @param cep CEP a ser validado (string).
 * @returns true se válido, mensagem de erro caso contrário.
 */
export const cepValidator = (cep: string) => {
  const cepLimpo = cep.replace(/\D/g, '')
  if (cepLimpo.length !== 8)
    return 'O CEP deve conter 8 dígitos.'
  if (/^(\d)\1+$/.test(cepLimpo))
    return 'CEP inválido.'

  return true
}
