import mongoose from 'mongoose';
import app from './config/express';

const db = 'mongodb://localhost/node_template';
const port = 8080;

mongoose.connect(db, { server: { socketOptions: { keepAlive: 1 } } });
mongoose.connection.on('error', () => {
  throw new Error(`unable to connect to database: ${db}`);
});

app.listen(port, () => {
  console.log(`server started on port ${port}`);
});

export default app;
