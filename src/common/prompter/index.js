/* eslint-disable unicorn/no-process-exit */

import prompts from 'prompts';

function onState(state) {
  if (state.aborted) {
    process.nextTick(() => {
      process.exit(1);
    });
  }
}

function normaliseQuestions(questions) {
  return questions.map((question) => ({ ...question, onState }));
}

async function prompt(questions) {
  const normalisedQuestions = normaliseQuestions(questions);

  return prompts(normalisedQuestions);
}

const Prompter = { prompt };

export { Prompter };
