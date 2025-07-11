import express from 'express';
import cors from 'cors';
import routes from './routes';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/', routes);

app.listen(4000, () => {
console.log('Backend running on http://localhost:4000');
});