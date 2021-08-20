import { createInterface } from 'readline';

function createReaders(child) {
  return {
    stdout: {
      reader: createInterface({ input: child.stdout }),
      matchedLineCount: 0,
    },
    stderr: {
      reader: createInterface({ input: child.stderr }),
      matchedLineCount: 0,
    },
  };
}

/**
 * TODO: These util assertion functions should extend Jest so we can use them
 * directly with `expect` and tighten the Jest linting rules.
 */

// Matches a child process' exit code and ordered stdout/stderr.
async function expectChildToMatch(child, expectedChild) {
  const { stdout, stderr } = createReaders(child);

  stdout.reader.on('line', (line) => {
    const expectedLine = expectedChild.stdoutArray[stdout.matchedLineCount];

    expect(line).toMatch(expectedLine);
    stdout.matchedLineCount += 1;
  });

  stderr.reader.on('line', (line) => {
    const expectedLine = expectedChild.stderrArray[stderr.matchedLineCount];

    expect(line).toMatch(expectedLine);
    stderr.matchedLineCount += 1;
  });

  return new Promise((resolve, reject) => {
    child.on('close', (exitCode) => {
      const expectedStdoutLineCount = expectedChild.stdoutArray.length;
      const expectedStderrLineCount = expectedChild.stderrArray.length;

      try {
        expect(stdout.matchedLineCount).toBe(expectedStdoutLineCount);
        expect(stderr.matchedLineCount).toBe(expectedStderrLineCount);
        expect(exitCode).toBe(expectedChild.exitCode);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  });
}

export { expectChildToMatch };
