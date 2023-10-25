require('@testing-library/jest-dom')
const { configure } = require('@testing-library/react')

configure({ testIdAttribute: 'data-test-id' })

// Monkey-patch the console debug function to not pollute the console with intended logs
const origConsoleDebug = console.debug
const debugMessage = 'data sent'
console.debug = (message, ...args) => {
  if (`${message}`.includes(debugMessage)) {
    return
  }
  origConsoleDebug.apply(console, [message, ...args])
}
