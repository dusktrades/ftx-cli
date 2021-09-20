import {
  composeCommand,
  expectChildProcessToSucceed,
  expectChildProcessToError,
} from '../helpers/index.js';

const baseOptions = '--secret secret';

describe('[COMMAND] Wallet', () => {
  test('SUCCEEDS: Main account with subaccounts', async () => {
    const options = `${baseOptions} --key account-with-subaccounts`;
    const command = composeCommand('wallet', options);

    await expectChildProcessToSucceed(command);
  });

  test('SUCCEEDS: Main account without subaccount', async () => {
    const options = `${baseOptions} --key account-without-subaccounts`;
    const command = composeCommand('wallet', options);

    await expectChildProcessToSucceed(command);
  });

  test('SUCCEEDS: Main account without balances', async () => {
    const options = `${baseOptions} --key account-without-balances`;
    const command = composeCommand('wallet', options);

    await expectChildProcessToSucceed(command);
  });

  test('SUCCEEDS: Subaccount with balances', async () => {
    const options = `${baseOptions} --key key --subaccount subaccount-with-balances`;
    const command = composeCommand('wallet', options);

    await expectChildProcessToSucceed(command);
  });

  test('SUCCEEDS: Subaccount without balances', async () => {
    const options = `${baseOptions} --key key --subaccount subaccount-without-balances`;
    const command = composeCommand('wallet', options);

    await expectChildProcessToSucceed(command);
  });

  test('FAILS: Invalid subaccount', async () => {
    const options = `${baseOptions} --key key --subaccount invalid`;
    const command = composeCommand('wallet', options);

    await expectChildProcessToError(command);
  });
});
