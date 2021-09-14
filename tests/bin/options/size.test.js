import {
  composeCommand,
  expectChildProcessToError,
  expectChildProcessToSucceed,
} from '../helpers/index.js';

const baseOptions = '--market btc/usd --side buy --type market';

async function testValidArguments(validArguments) {
  for (const argument of validArguments) {
    test(`SUCCEEDS: --size ${argument}`, async () => {
      const options = `${baseOptions} --size ${argument}`;
      const command = composeCommand('trade', options);

      await expectChildProcessToSucceed(command);
    });
  }
}

describe('[OPTION] Size', () => {
  describe('SUCCEEDS: Long flag (--size); valid number argument', () => {
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

  describe('SUCCEEDS: Long flag (--size); valid relative argument', () => {
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
    ].flatMap((argument) => [`${argument}%`, `${argument}k%`, `${argument}m%`]);

    testValidArguments(validArguments);
  });

  test('SUCCEEDS: Short flag (-s); valid argument', async () => {
    const options = `${baseOptions} -s 1`;
    const command = composeCommand('trade', options);

    await expectChildProcessToSucceed(command);
  });

  test('FAILS: Missing option (always required)', async () => {
    const command = composeCommand('trade', baseOptions);

    await expectChildProcessToError(command);
  });

  test('FAILS: Missing argument', async () => {
    const options = `${baseOptions} --size`;
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
    ];

    for (const argument of invalidArguments) {
      test(`FAILS: --size ${argument}`, async () => {
        const options = `${baseOptions} --size ${argument}`;
        const command = composeCommand('trade', options);

        await expectChildProcessToError(command);
      });
    }
  });
});
