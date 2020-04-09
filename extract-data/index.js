const babelParser = require('@babel/parser');
const fs = require('fs');

const reduceAstNode = (oldNode, currentNode) => {
  let element = {};
  if (currentNode.type === 'JSXElement') {
    element = {
      name: currentNode.openingElement.name.name,
      children: [],
    };
    oldNode.push(element);
  }
  if ('children' in currentNode) {
    currentNode.children.forEach((node) => (oldNode.length > 0
      ? reduceAstNode(element.children, node)
      : reduceAstNode(oldNode, node)));
  }
  return oldNode;
};

const parse = (file) => {
  const content = fs.readFileSync(file, 'utf8');
  const ast = babelParser.parse(content, {
    sourceType: 'module',
    plugins: ['jsx'],
  });
  const initialAst = ast.program.body.find((astNode) => astNode.type === 'ExportNamedDeclaration').declaration.declarations[0].init.body.body[0].argument;
  fs.writeFileSync('./src/static/app-data.json', JSON.stringify(reduceAstNode([], initialAst)[0]));
};

const getRootComponent = (path) => {
  const pathTree = path.split('/');
  let files = [];
  let fileName = '';
  // root component is at root level
  if(pathTree.length === 1) {
    files = fs.readdirSync('.');
    fileName = pathTree[0];
  // else path contains folders
  } else {
    const pathToRootComponent = pathTree.slice(0, pathTree.length - 1).join('/');
    files = fs.readdirSync(`./${pathToRootComponent}`);
    fileName = pathTree[pathTree.length - 1];
  }
  // check if input file type is valid
  const fileIsValid = files.some((name) => 
    fileName.includes('js') || 
    fileName.includes('jsx') && 
    name === fileName);
  if (fileIsValid) {
    parse(path);
  } else {
    throw new Error('ERROR: Root component not found. Are you sure you are in the right folder?');
  }
};

getRootComponent(process.argv[2]);
