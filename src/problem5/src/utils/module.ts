export async function loadModule<T>(path: string): Promise<T> {
  return (await import(path)) as T
}
