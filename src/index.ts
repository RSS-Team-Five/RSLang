import 'normalize.css';
import { wordsFromAPI } from './api/words/wordsApi';
import App from './controllers/App';
import state from './models/State';
import './scss/index.scss';

const app = new App(state);

app.start();
console.log(wordsFromAPI());
