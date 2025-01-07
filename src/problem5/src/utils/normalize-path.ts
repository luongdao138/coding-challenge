import os from 'node:os'

// to normalize path (for window OS)
export const normalizePath = (path: string) => {
  if (os.platform() === 'win32') {
    return path.replace(/\\/g, '/')
  }

  return path
}
