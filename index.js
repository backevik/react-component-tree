const { execSync } = require('child_process');

const getArg = () => {
  const args = process.argv.slice(2);
  if (args.length) {
    return args[0];
  }
  throw new Error('Invalid argument provided');
};

execSync(`yarn parse ${getArg()}`, { stdio: [0, 1, 2] });
execSync('yarn build', { stdio: [0, 1, 2] });
