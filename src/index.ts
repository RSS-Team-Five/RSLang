import 'normalize.css';
import { oneWordFromAPI, wordsFromAPI } from './api/words/wordsApi';
import App from './controllers/App';
import state from './models/State';
import './scss/index.scss';

const app = new App(state);

app.start();
console.log(wordsFromAPI());
console.log(oneWordFromAPI('5e9f5ee35eb9e72bc21b005a'));
