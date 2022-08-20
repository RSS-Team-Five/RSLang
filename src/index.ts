import 'normalize.css';
import App from './controllers/App';
import state from './models/State';
import './scss/index.scss';
import createBookPage from './views/pages/bookPage';

const app = new App(state);

app.start();

const book = createBookPage();
document.querySelector('body')?.append(book);
