import path from 'path';

const config = require(`./${process.env.NODE_ENV}`);
const privateConfig = require(`./${process.env.NODE_ENV}Private`);

export default Object.assign({}, config, privateConfig);