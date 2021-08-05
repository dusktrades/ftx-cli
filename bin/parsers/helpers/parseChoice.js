import { InvalidOptionArgumentError } from 'commander';

function findParsedChoice(choice, choices) {
  const choiceEntry = choices.find((entry) => entry.options.includes(choice));

  return choiceEntry?.parsed;
}

function parseChoice(choice, choices, errorMessage) {
  const parsedChoice = findParsedChoice(choice, choices);

  if (parsedChoice == null) {
    throw new InvalidOptionArgumentError(errorMessage);
  }

  return parsedChoice;
}

export { parseChoice };
