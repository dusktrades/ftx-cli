import {
  composeCommand,
  expectChildProcessToError,
  expectChildProcessToSucceed,
} from '../helpers/index.js';

const baseOptions = '--market btc/usd --side buy --type market --size 1';

async function testValidArguments(validArguments) {
  for (const argument of validArguments) {
    test(`SUCCEEDS: --price ${argument}`, async () => {
      const options = `${baseOptions} --price ${argument}`;
      const command = composeCommand('trade', options);

      await expectChildProcessToSucceed(command);
    });
  }
}

describe('[OPTION] Price', () => {
  describe('SUCCEEDS: Long flag (--price); valid number argument', () => {
    const validArguments = [
      '0.1',
      '1',
      '1.0',
      '1.1',
      '123.123456789',
      '123456789.123456789',
      '123456789123456789.123456789123456789',

      // Weird formatting that probably won't be used (parsing by-product).
      '00.1',
      '1.',
      '.1',
      '0b11111111',
      '0xff',
    ].flatMap((argument) => [argument, `${argument}k`, `${argument}m`]);

    testValidArguments(validArguments);
  });

  describe('SUCCEEDS: Long flag (--price); valid range argument', () => {
    const validArguments = [
      '0.1:0.1',
      '1.0:1.0',
      '1:10',
      '10:1',
      '123.123456789:123.123456789',
      '123456789.123456789:123456789.123456789',
      '123456789123456789.123456789123456789:123456789123456789.123456789123456789',

      // Weird formatting that probably won't be used (parsing by-product).
      '00.1:00.2',
      '1.:.1',
      '.1:1.',
      '0b11111111:0b11111111',
      '0xff:0xff',
    ].flatMap((argument) => {
      const [firstNumber, secondNumber] = argument.split(':');

      return [
        argument,
        `${firstNumber}k:${secondNumber}k`,
        `${firstNumber}m:${secondNumber}m`,
      ];
    });

    testValidArguments(validArguments);
  });

  describe('SUCCEEDS: Long flag (--price); valid relative argument', () => {
    const validArguments = [
      '0.1',
      '1',
      '1.0',
      '1.1',
      '123.123456789',
      '123456789.123456789',
      '123456789123456789.123456789123456789',

      // Weird formatting that probably won't be used (parsing by-product).
      '00.1',
      '1.',
      '.1',
      '0b11111111',
      '0xff',
    ]
      .flatMap((argument) => [`+${argument}`, `-${argument}`])
      .flatMap((argument) => [argument, `${argument}k`, `${argument}m`])
      .flatMap((argument) => [argument, `${argument}%`]);

    testValidArguments(validArguments);
  });

  test('SUCCEEDS: Short flag (-p); valid argument', async () => {
    const options = `${baseOptions} -p 1`;
    const command = composeCommand('trade', options);

    await expectChildProcessToSucceed(command);
  });

  test('FAILS: Missing argument', async () => {
    const options = `${baseOptions} --price`;
    const command = composeCommand('trade', options);

    await expectChildProcessToError(command);
  });

  describe('FAILS: Invalid argument', () => {
    const invalidArguments = [
      'invalid',
      '0',
      '0k',
      '0m',
      '0%',
      '0k%',
      '0m%',
      '00',
      '0.',
      '.0',
      '0.0',
      '+0',
      '+00',
      '+0.0',
      '--0',
      '-0',
      '-00',
      '-0.0',
      'invalid:invalid',
      '1:',
      ':1',
      '0:1',
      '1:0',
      '-1:1',
      '1:-1',
      '1:1:1',
    ];

    for (const argument of invalidArguments) {
      test(`FAILS: --price ${argument}`, async () => {
        const options = `${baseOptions} --price ${argument}`;
        const command = composeCommand('trade', options);

        await expectChildProcessToError(command);
      });
    }
  });
});
