const { MessageConsumerPact } = require('@pact-foundation/pact');

const PACT_CONSUMER = 'ExperiencesSDKConsumer';
const PACT_PROVIDER = 'UserInterfaceProvider';

export const PactConsumer = new MessageConsumerPact({
  consumer: PACT_CONSUMER,
  provider: PACT_PROVIDER,
  // Silence warning about older spec version of existing pact files -> always overwrite existing pact files
  pactfileWriteMode: 'overwrite',
  dir: '../../pacts',
});
