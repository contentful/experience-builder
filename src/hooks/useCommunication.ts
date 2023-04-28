import { useCallback } from 'react'

export const useCommunication = () => {
  const sendMessage = useCallback((eventType: string, data: any) => {
    console.log('data sent', {
      source: 'customer-app',
      eventType,
      payload: data,
    })
    window.parent?.postMessage(
      {
        source: 'customer-app',
        eventType,
        payload: data,
      },
      '*'
    )
  }, [])

  return {
    sendMessage,
  }
}
