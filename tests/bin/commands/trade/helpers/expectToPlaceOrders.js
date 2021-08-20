import { composeCommand } from './composeCommand.js';
import { expectChildToMatch } from './expectChildToMatch.js';
import { spawnTestChild } from './spawnTestChild.js';

function composeStdoutOrdersArray(count) {
  return Array.from({ length: count }).fill(/.{24} {2}INFO {5}Placed order/);
}

function composeStdoutArray(count) {
  return [
    /.{24} {2}INFO {3}Processing order\(s\)/,
    ...composeStdoutOrdersArray(count),
    /.{24} {2}INFO {3}Placed order\(s\)/,
  ];
}

function composeExpectedChild(count) {
  return {
    stdoutArray: composeStdoutArray(count),
    stderrArray: [],
    exitCode: 0,
  };
}

async function expectToPlaceOrders(options, count) {
  const command = composeCommand(options);
  const expectedChild = composeExpectedChild(count);
  const child = spawnTestChild(command);

  await expectChildToMatch(child, expectedChild);
}

export { expectToPlaceOrders };
