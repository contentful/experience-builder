require('@testing-library/jest-dom/extend-expect')
const { configure } = require('@testing-library/react')

configure({ testIdAttribute: 'data-test-id' })
