import {
  composeCommand,
  expectChildToMatch,
  expectToAcceptShorthandNumberArguments,
  expectToPlaceOrders,
  spawnTestChild,
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

  test('SUCCEEDS: Shorthand number arguments', async () => {
    await expectToAcceptShorthandNumberArguments(
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

  test('SUCCEEDS: Price range argument (shorthand numbers)', async () => {
    const options =
      '--market btc-perp --side buy --type limit --size 1 --price 10k:20k';

    await expectToPlaceOrders(options, 1);
  });

  test('FAILS: Missing argument', async () => {
    const options =
      '--market btc-perp --side buy --type limit --size 1 --price';

    const command = composeCommand(options);

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

    const command = composeCommand(options);

    const expectedChild = {
      stdoutArray: [],
      stderrArray: [
        /error: option '-p, --price <price>' argument 'invalid-price' is invalid\. Price must be a number, or range of numbers \(format: X:Y\), greater than zero\./,
      ],
      exitCode: 1,
    };

    const child = spawnTestChild(command);

    await expectChildToMatch(child, expectedChild);
  });

  test('FAILS: Invalid argument (negative)', async () => {
    const options =
      '--market btc-perp --side buy --type limit --size 1 --price -1';

    const command = composeCommand(options);

    const expectedChild = {
      stdoutArray: [],
      stderrArray: [
        /error: option '-p, --price <price>' argument '-1' is invalid\. Price must be a number, or range of numbers \(format: X:Y\), greater than zero\./,
      ],
      exitCode: 1,
    };

    const child = spawnTestChild(command);

    await expectChildToMatch(child, expectedChild);
  });

  test('FAILS: Invalid argument (zero)', async () => {
    const options =
      '--market btc-perp --side buy --type limit --size 1 --price 0';

    const command = composeCommand(options);

    const expectedChild = {
      stdoutArray: [],
      stderrArray: [
        /error: option '-p, --price <price>' argument '0' is invalid\. Price must be a number, or range of numbers \(format: X:Y\), greater than zero\./,
      ],
      exitCode: 1,
    };

    const child = spawnTestChild(command);

    await expectChildToMatch(child, expectedChild);
  });

  test('FAILS: Invalid argument (negative zero)', async () => {
    const options =
      '--market btc-perp --side buy --type limit --size 1 --price -0';

    const command = composeCommand(options);

    const expectedChild = {
      stdoutArray: [],
      stderrArray: [
        /error: option '-p, --price <price>' argument '-0' is invalid\. Price must be a number, or range of numbers \(format: X:Y\), greater than zero\./,
      ],
      exitCode: 1,
    };

    const child = spawnTestChild(command);

    await expectChildToMatch(child, expectedChild);
  });

  test('FAILS: Invalid argument (shorthand zero)', async () => {
    const options =
      '--market btc-perp --side buy --type limit --size 1 --price 0k';

    const command = composeCommand(options);

    const expectedChild = {
      stdoutArray: [],
      stderrArray: [
        /error: option '-p, --price <price>' argument '0k' is invalid\. Price must be a number, or range of numbers \(format: X:Y\), greater than zero\./,
      ],
      exitCode: 1,
    };

    const child = spawnTestChild(command);

    await expectChildToMatch(child, expectedChild);
  });

  test('FAILS: Invalid argument (price range missing first price)', async () => {
    const options =
      '--market btc-perp --side buy --type limit --size 1 --price :10';

    const command = composeCommand(options);

    const expectedChild = {
      stdoutArray: [],
      stderrArray: [
        /error: option '-p, --price <price>' argument ':10' is invalid\. Price must be a number, or range of numbers \(format: X:Y\), greater than zero\./,
      ],
      exitCode: 1,
    };

    const child = spawnTestChild(command);

    await expectChildToMatch(child, expectedChild);
  });

  test('FAILS: Invalid argument (price range missing second price)', async () => {
    const options =
      '--market btc-perp --side buy --type limit --size 1 --price 10:';

    const command = composeCommand(options);

    const expectedChild = {
      stdoutArray: [],
      stderrArray: [
        /error: option '-p, --price <price>' argument '10:' is invalid\. Price must be a number, or range of numbers \(format: X:Y\), greater than zero\./,
      ],
      exitCode: 1,
    };

    const child = spawnTestChild(command);

    await expectChildToMatch(child, expectedChild);
  });

  test('FAILS: Invalid argument (price range extra price)', async () => {
    const options =
      '--market btc-perp --side buy --type limit --size 1 --price 10:20:30';

    const command = composeCommand(options);

    const expectedChild = {
      stdoutArray: [],
      stderrArray: [
        /error: option '-p, --price <price>' argument '10:20:30' is invalid\. Price must be a number, or range of numbers \(format: X:Y\), greater than zero\./,
      ],
      exitCode: 1,
    };

    const child = spawnTestChild(command);

    await expectChildToMatch(child, expectedChild);
  });

  test('FAILS: Invalid argument (price range invalid prices)', async () => {
    const options =
      '--market btc-perp --side buy --type limit --size 1 --price invalid-price:invalid-price';

    const command = composeCommand(options);

    const expectedChild = {
      stdoutArray: [],
      stderrArray: [
        /error: option '-p, --price <price>' argument 'invalid-price:invalid-price' is invalid\. Price must be a number, or range of numbers \(format: X:Y\), greater than zero\./,
      ],
      exitCode: 1,
    };

    const child = spawnTestChild(command);

    await expectChildToMatch(child, expectedChild);
  });
});
