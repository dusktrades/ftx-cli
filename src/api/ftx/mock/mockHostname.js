import nock from 'nock';

const MOCK_HOSTNAME = nock(/ftx\.[com|us]/).persist();

export { MOCK_HOSTNAME };
