// the jshashes library does not have typings so we have to ignore it
// and export typed hashMD5() function
// @ts-ignore
import Hashes from 'jshashes'
export function hashMD5(target: string): string {
  return new Hashes.MD5().hex(target)
}
