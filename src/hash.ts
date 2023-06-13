import Hashes from 'jshashes'

export function hashMD5(target: string): string {
  return new Hashes.MD5().hex(target)
}
