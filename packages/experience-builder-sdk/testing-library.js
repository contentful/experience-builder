require('@testing-library/jest-dom');
const { configure } = require('@testing-library/react');

configure({ testIdAttribute: 'data-test-id' });

// Monkey-patch the console debug function to not pollute the console with intended logs
const origConsoleDebug = console.debug;
const debugMessage = '[experiences-sdk-react';
console.debug = (message, ...args) => {
  if (`${message}`.includes(debugMessage)) {
    return;
  }
  origConsoleDebug.apply(console, [message, ...args]);
};

global.CSS = {
  supports: (k, v) => true,
};

global.structuredClone = (val) => JSON.parse(JSON.stringify(val));

// Monkey patch errors thrown by Jest trying to parse CSS.
// Src: https://stackoverflow.com/questions/69906136/console-error-error-could-not-parse-css-stylesheet
const originalConsoleError = console.error;
console.error = function (...data) {
  if (
    typeof data[0]?.toString === 'function' &&
    data[0].toString().includes('Error: Could not parse CSS stylesheet')
  )
    return;
  originalConsoleError(...data);
};
