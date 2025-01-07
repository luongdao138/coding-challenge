import { parse } from 'node:path'

function upperCaseWord(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1)
}

// root/models/delivery-request => deliveryRequestModel
// root/strategies/delivery-request => deliveryRequestStrategy

export default function (path: string) {
  const parsed = parse(path)
  const parsedDir = parse(parsed.dir)

  const fileName = parsed.name
  let namespace = parsedDir.name

  const registrationFileName = fileName
    .split('-')
    .reduce((acc, current, index) => (index === 0 ? acc + current : acc + upperCaseWord(current)), '')

  if (namespace.endsWith('ies')) {
    namespace = namespace.slice(0, namespace.length - 3) + 'ys'
  }
  namespace = namespace.slice(0, -1)
  const registrationNamespace = upperCaseWord(namespace)

  return registrationFileName + registrationNamespace
}
