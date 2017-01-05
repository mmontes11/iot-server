import mongoose from 'mongoose';
import app from './config/express';
import config from './config/env'

mongoose.connect(config.db, { server: { socketOptions: { keepAlive: 1 } } });
mongoose.connection.on('error', () => {
  throw new Error(`Unable to connect to database: ${config.db}`);
});

app.listen(config.port, () => {
  console.log(`Server started on port ${config.port}`);
});

export default app;
