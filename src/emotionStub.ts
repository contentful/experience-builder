import kebabCase from 'lodash.kebabCase'
import { hashMD5 } from './hash'

export const emotions: Record<string, any> = {}

export function css(opt: any, selectorSuffix?: string): string {
  const styles = toStyles(opt)
  const stylesHash = hashMD5(JSON.stringify(styles))

  const className = `cfstyles-${stylesHash}`
  const selector = !selectorSuffix ? className : `${className}${selectorSuffix}`
  const styleLines = Object.entries(styles).map(
    ([cssProp, cssValue]) => ` ${cssProp}: ${cssValue};`
  )
  const styleRule =
    `` +
    `.${selector}{
${styleLines.join('\n')}
}`
  createStyleRuleTag(styleRule, className)
  return className
}

function toStyles(camelCaseStyles: Record<string, any>): Record<string, any> {
  const styles: Record<string, any> = {}
  for (const [k, v] of Object.entries(camelCaseStyles)) {
    styles[kebabCase(k)] = v
  }
  return styles
}

function uniqueClassName(prefix = '.fake-emotion') {
  return `${prefix}-${randInt()}`
}

function randInt() {
  return Math.round(Math.random() * 100000)
}

function createStyleRuleTag(styleRule: string, id: string) {
  console.log(`Creating tag (${Object.keys(emotions).length}): <style>\n${styleRule}</style>`)
  emotions[id] = styleRule

  // The stuff below breaks SSR builds (eg. Gatsby) as it accesses `document` global
  // const styleElement = document.createElement('style');
  // styleElement.id =
  // styleElement.innerHTML = styleRule;
  // document.head.appendChild(styleElement);
}

/**
 * Just concatenate the options
 */
export function cx(className?: string, ...styleOverrides: any): string {
  // console.log(`cx(${JSON.stringify(opt)}) arguments:`, arguments);
  // console.log(`cx() arguments:`, arguments)
  const result = [className, ...styleOverrides].join(' ')
  console.log(`cx(${JSON.stringify({ className, styleOverrides })}) = '${result}'`)
  return result
}
