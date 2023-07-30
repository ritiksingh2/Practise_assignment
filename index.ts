import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import connectiondb from './config/db.config';
import { notFound, errorHandler } from './services/errorHandling';
import UserRoutes from './routes/routes';

const app: Application = express();

dotenv.config();

connectiondb();

app.use(express.json());

// Default
app.get('/api', (req: Request, res: Response) => {
  res.status(201).json({ message: 'Welcome to Auth ts' });
});


//  Route
app.use('/api/ritik_assignment', UserRoutes);

// services used and logical middleware
app.use(notFound);
app.use(errorHandler);
const PORT = process.env.PORT || 3000;

app.listen(PORT, (): void => console.log(`Server is running on ${PORT}`));
