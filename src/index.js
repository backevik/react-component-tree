import './styles/styles.scss';
import initTree from './graph';
import data from '../data.json';

console.log(`Running in ${process.env.NODE_ENV} mode`);

initTree(data);
