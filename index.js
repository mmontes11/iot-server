import mongoose from './config/mongoose';
import redis from './config/redis';
import app from './config/express';
import config from './config/env'

mongoose.connect(config.db, { server: { socketOptions: { keepAlive: 1 } } }, function(error) {
	if (error) {
		throw new Error(`Unable to connect to database ${config.db}`);
	} else {
		console.log(`Connected to database ${config.db}`);
	}
});

redis.on("connect", function(){
    console.log(`Connected to redis ${config.redis_host}:${config.redis_port}`);
    redis.set('test', 'test');
});
redis.on("error", function(){
    console.log(`Unable to connect to redis ${config.redis_host}:${config.redis_port}`);
});

app.listen(config.server_port, () => {
  console.log(`Server started on port ${config.server_port}`);
});

export default app;