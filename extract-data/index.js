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

const getRootComponent = (name) => {
  const files = fs.readdirSync('.');
  const rootComponent = files.find((fileName) => fileName === name || fileName === `${name}.js` || fileName === `${name}.jsx`);
  if (rootComponent) {
    parse(rootComponent);
  } else {
    throw new Error('ERROR: Root component not found. Are you sure you are in the right folder?');
  }
};

getRootComponent(process.argv[2]);
