import { interceptTestCase } from '../../helpers/index.js';

const testCases = [
  {
    additionalRequestHeaders: { 'ftx-key': 'key' },
    statusCode: 200,
    response: {
      success: true,
      result: {
        backstopProvider: false,
        collateral: 123_456_789.123_456_789,
        freeCollateral: 123_456.123_456_789,
        initialMarginRequirement: 0.1,
        leverage: 1,
        liquidating: false,
        maintenanceMarginRequirement: 0.1,
        makerFee: 0.0002,
        marginFraction: 0.5,
        openMarginFraction: 0.25,
        positions: [],
        takerFee: 0.0007,
        totalAccountValue: 123_456_789.123_456_789,
        totalPositionSize: 123.123_456_789,
        username: 'Dusk',
      },
    },
  },
];

function mockGetAccountInformation() {
  for (const testCase of testCases) {
    interceptTestCase({
      ...testCase,
      endpoint: 'account',
      method: 'get',
      requiresAuthentication: true,
    });
  }
}

export { mockGetAccountInformation };
