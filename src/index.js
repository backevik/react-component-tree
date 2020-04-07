import './styles/styles.scss';
import initTree from './graph';

console.log(`Running in ${process.env.NODE_ENV} mode`);

const isDev = process.env.NODE_ENV === 'development';

if(isDev) {
  import('./static/mock-data.json')
    .then((data) => initTree(data));
} else {
  import('./static/app-data.json')
    .then((data) => initTree(data));
}