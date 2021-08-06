import { composeOption } from './composeOption.js';

function composeSortOption(choices) {
  return composeOption({
    FLAGS: '--sort <sorting method>',
    DESCRIPTION: 'sorting method',
    CHOICES: choices,
  });
}

export { composeSortOption };
