import { parseChoice } from './parseChoice.js';

function parseChoiceList(choiceList, choices, errorMessage) {
  const choiceArray = choiceList.split(',');
  const parsedChoices = [];

  for (const choice of choiceArray) {
    const parsedChoice = parseChoice(choice, choices, errorMessage);

    if (!parsedChoices.includes(parsedChoice)) {
      parsedChoices.push(parsedChoice);
    }
  }

  return parsedChoices;
}

export { parseChoiceList };
