const { execSync } = require('child_process');
const path = require('path');

const getArg = () => {
  const args = process.argv.slice(2);
  if (args.length) {
    return args[0];
  }
  throw new Error('Invalid argument provided');
};

const getOutputPath = () => {
  const args = process.argv.slice(2);
  const outputIndex = args.findIndex((arg) => arg === '-o');
  // user provided output
  if(outputIndex > -1) {
    const folder = args[outputIndex + 1];
    // did not provide any value
    if(!folder) {
      throw new Error('No argument provided to output.');
    }
    return path.resolve(process.cwd(), folder);
  }
  // default output folder

  // TODO: IF FOLDER DOES NOT EXIST CREATE IT!
  return path.resolve(process.cwd(), 'dist');
}

execSync(`yarn parse ${getArg()}`, { stdio: [0, 1, 2] });
execSync(`yarn build --output-path ${getOutputPath()}`, { stdio: [0, 1, 2] });
