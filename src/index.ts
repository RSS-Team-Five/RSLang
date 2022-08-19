import 'normalize.css';
import App from './controllers/App';
import state from './models/State';
import './scss/index.scss';

const app = new App(state);
console.log('🚀 ~ app', app);

app.start();
