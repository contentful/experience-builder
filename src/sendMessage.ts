// TODO: Clean this up since it's not used anymore
export const sendMessage = (eventType: string, data: any) => {
  console.debug('data sent', {
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
}
