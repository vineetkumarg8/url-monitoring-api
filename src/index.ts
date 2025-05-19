import { Hono } from 'hono';
// import { serve } from '@hono/node-server';

import auth from './routes/auth';
import urlRoutes from './routes/urls';
import resultRoutes from './routes/result';
import { authMiddleware } from './middleware/auth';

import 'dotenv/config';
import { schedule } from './jobs/healthCheck';
// import "./jobs/healthCheck"; // or './jobs/healthCheck' based on path
// import { schedule } from 'node-cron';


const app = new Hono();

app.get('/', (c) => c.text('Server is walking!'));
app.route('/auth', auth);
app.use('/results', authMiddleware);


// Protected routes
app.route('/urls', urlRoutes);
app.route('/results', resultRoutes);

// serve(app);
app.fire();

(app as any).scheduled= async()=>{
    schedule();
}

export default app;

