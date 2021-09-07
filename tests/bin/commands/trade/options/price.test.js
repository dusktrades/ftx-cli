import { expectChildToMatch, spawnTestChild } from '../../../helpers/index.js';

import {
  composeTradeCommand,
  expectToAcceptNumberShorthandArguments,
  expectToPlaceOrders,
} from '../helpers/index.js';

describe('[OPTION] Price', () => {
  test('SUCCEEDS: Long flag (--price)', async () => {
    const options =
      '--market btc-perp --side buy --type limit --size 1 --price 10';

    await expectToPlaceOrders(options, 1);
  });

  test('SUCCEEDS: Short flag (-p)', async () => {
    const options = '--market btc-perp --side buy --type limit --size 1 -p 10';

    await expectToPlaceOrders(options, 1);
  });

  test('SUCCEEDS: Number shorthand arguments', async () => {
    await expectToAcceptNumberShorthandArguments(
      (shorthand) =>
        `--market btc-perp --side buy --type limit --size 1 --price 1${shorthand}`
    );
  });

  test('SUCCEEDS: Price range argument', async () => {
    const options =
      '--market btc-perp --side buy --type limit --size 1 --price 10:20';

    await expectToPlaceOrders(options, 1);
  });

  test('SUCCEEDS: Price range argument (reversed)', async () => {
    const options =
      '--market btc-perp --side buy --type limit --size 1 --price 20:10';

    await expectToPlaceOrders(options, 1);
  });

  test('SUCCEEDS: Price range argument (number shorthands)', async () => {
    const options =
      '--market btc-perp --side buy --type limit --size 1 --price 10k:20k';

    await expectToPlaceOrders(options, 1);
  });

  test('FAILS: Missing argument', async () => {
    const options =
      '--market btc-perp --side buy --type limit --size 1 --price';

    const command = composeTradeCommand(options);

    const expectedChild = {
      stdoutArray: [],
      stderrArray: [/error/],
      exitCode: 1,
    };

    const child = spawnTestChild(command);

    await expectChildToMatch(child, expectedChild);
  });

  test('FAILS: Invalid argument (NaN)', async () => {
    const options =
      '--market btc-perp --side buy --type limit --size 1 --price invalid-price';

    const command = composeTradeCommand(options);

    const expectedChild = {
      stdoutArray: [],
      stderrArray: [
        /error: option '-p, --price <price>' argument 'invalid-price' is invalid\. Price must be one of: number greater than zero, range of numbers greater than zero, non-zero additive relative number, non-zero additive relative percentage\./,
      ],
      exitCode: 1,
    };

    const child = spawnTestChild(command);

    await expectChildToMatch(child, expectedChild);
  });

  test('FAILS: Invalid argument (zero)', async () => {
    const options =
      '--market btc-perp --side buy --type limit --size 1 --price 0';

    const command = composeTradeCommand(options);

    const expectedChild = {
      stdoutArray: [],
      stderrArray: [
        /error: option '-p, --price <price>' argument '0' is invalid\. Price must be one of: number greater than zero, range of numbers greater than zero, non-zero additive relative number, non-zero additive relative percentage\./,
      ],
      exitCode: 1,
    };

    const child = spawnTestChild(command);

    await expectChildToMatch(child, expectedChild);
  });

  test('FAILS: Invalid argument (negative zero)', async () => {
    const options =
      '--market btc-perp --side buy --type limit --size 1 --price -0';

    const command = composeTradeCommand(options);

    const expectedChild = {
      stdoutArray: [],
      stderrArray: [
        /error: option '-p, --price <price>' argument '-0' is invalid\. Price must be one of: number greater than zero, range of numbers greater than zero, non-zero additive relative number, non-zero additive relative percentage\./,
      ],
      exitCode: 1,
    };

    const child = spawnTestChild(command);

    await expectChildToMatch(child, expectedChild);
  });

  test('FAILS: Invalid argument (shorthand zero)', async () => {
    const options =
      '--market btc-perp --side buy --type limit --size 1 --price 0k';

    const command = composeTradeCommand(options);

    const expectedChild = {
      stdoutArray: [],
      stderrArray: [
        /error: option '-p, --price <price>' argument '0k' is invalid\. Price must be one of: number greater than zero, range of numbers greater than zero, non-zero additive relative number, non-zero additive relative percentage\./,
      ],
      exitCode: 1,
    };

    const child = spawnTestChild(command);

    await expectChildToMatch(child, expectedChild);
  });

  test('FAILS: Invalid argument (price range missing first price)', async () => {
    const options =
      '--market btc-perp --side buy --type limit --size 1 --price :10';

    const command = composeTradeCommand(options);

    const expectedChild = {
      stdoutArray: [],
      stderrArray: [
        /error: option '-p, --price <price>' argument ':10' is invalid\. Price must be one of: number greater than zero, range of numbers greater than zero, non-zero additive relative number, non-zero additive relative percentage\./,
      ],
      exitCode: 1,
    };

    const child = spawnTestChild(command);

    await expectChildToMatch(child, expectedChild);
  });

  test('FAILS: Invalid argument (price range missing second price)', async () => {
    const options =
      '--market btc-perp --side buy --type limit --size 1 --price 10:';

    const command = composeTradeCommand(options);

    const expectedChild = {
      stdoutArray: [],
      stderrArray: [
        /error: option '-p, --price <price>' argument '10:' is invalid\. Price must be one of: number greater than zero, range of numbers greater than zero, non-zero additive relative number, non-zero additive relative percentage\./,
      ],
      exitCode: 1,
    };

    const child = spawnTestChild(command);

    await expectChildToMatch(child, expectedChild);
  });

  test('FAILS: Invalid argument (price range extra price)', async () => {
    const options =
      '--market btc-perp --side buy --type limit --size 1 --price 10:20:30';

    const command = composeTradeCommand(options);

    const expectedChild = {
      stdoutArray: [],
      stderrArray: [
        /error: option '-p, --price <price>' argument '10:20:30' is invalid\. Price must be one of: number greater than zero, range of numbers greater than zero, non-zero additive relative number, non-zero additive relative percentage\./,
      ],
      exitCode: 1,
    };

    const child = spawnTestChild(command);

    await expectChildToMatch(child, expectedChild);
  });

  test('FAILS: Invalid argument (price range invalid prices)', async () => {
    const options =
      '--market btc-perp --side buy --type limit --size 1 --price invalid-price:invalid-price';

    const command = composeTradeCommand(options);

    const expectedChild = {
      stdoutArray: [],
      stderrArray: [
        /error: option '-p, --price <price>' argument 'invalid-price:invalid-price' is invalid\. Price must be one of: number greater than zero, range of numbers greater than zero, non-zero additive relative number, non-zero additive relative percentage\./,
      ],
      exitCode: 1,
    };

    const child = spawnTestChild(command);

    await expectChildToMatch(child, expectedChild);
  });
});
