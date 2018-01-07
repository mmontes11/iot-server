import path from 'path';

const config = require(`./${process.env.NODE_ENV}`);
const privateConfig = require(`./${process.env.NODE_ENV}Private`);

const defaults = {
    root: path.join(__dirname, '/..')
};

export default Object.assign(defaults, config, privateConfig);