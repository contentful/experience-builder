import { useEffect, useState } from 'react'
import { emotions } from '../emotionStub'

type UseDynamicStyleRetval = {
  isStyleReady: boolean
}

export function useDynamicStyles({ classNames }: { classNames: string[] }): UseDynamicStyleRetval {
  // i have access to all of the registered styles already
  const [isStyleLoaded, setIsStyleLoaded] = useState(false)
  const isRegistered = (className: string) => Boolean(emotions[className])
  const allClassNamesRegistered = classNames.every(isRegistered)
  if (!allClassNamesRegistered) {
    throw new Error(
      `Some of the classnames are not registered [${classNames.join(
        ', '
      )}]. Available: [${Object.keys(emotions).join(', ')}]`
    )
  }

  const styleRules = Object.entries(emotions)
    .filter(([k, v]) => classNames.includes(k))
    .map(([_, rule]) => rule)

  useEffect(() => {
    const mountedStyleElements: HTMLStyleElement[] = []
    for (let rule of styleRules) {
      const styleElement = document.createElement('style')
      styleElement.innerHTML = rule
      styleElement.setAttribute('data-style', 'fake-emotion')
      document.head.appendChild(styleElement)
      mountedStyleElements.push(styleElement)
    }
    setIsStyleLoaded(true)
    return () => {
      mountedStyleElements.forEach((el) => document.head.removeChild(el))
    }
    // }, [className]);
  }, [])

  return { isStyleReady: isStyleLoaded }
}

export default function useDynamicStyle({
  className,
}: {
  className: string
}): UseDynamicStyleRetval {
  // i have access to all of the registered styles already
  const [isStyleLoaded, setIsStyleLoaded] = useState(false)
  if (!emotions[className]) {
    throw new Error(
      `Cannot find registerd className by id ['${className}']. Available: [${Object.keys(
        emotions
      ).join(', ')}]`
    )
  }

  const styleRules = emotions[className]

  useEffect(() => {
    const styleElement = document.createElement('style')
    styleElement.innerHTML = styleRules
    styleElement.setAttribute('data-style', 'fake-emotion')
    document.head.appendChild(styleElement)
    setIsStyleLoaded(true)
    return () => {
      document.head.removeChild(styleElement)
    }
    // }, [className]);
  }, [])

  return { isStyleReady: isStyleLoaded }
}
