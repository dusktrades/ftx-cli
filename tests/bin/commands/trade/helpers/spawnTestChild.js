import { spawn } from 'child_process';

function spawnTestChild(command) {
  return spawn(command, {
    shell: true,
    env: { ...process.env, NODE_ENV: 'test-child' },
  });
}

export { spawnTestChild };
