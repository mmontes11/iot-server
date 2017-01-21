import httpStatus from 'http-status';
import User from '../models/userModel';

function createIfNotExists(req, res) {
    const userName = req.body.userName;
    const query = User.where({ userName: userName });
    query.findOne( (err, user) => {
        if (err) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
        } else {
            if (!user) {
                user = new User({
                    userName: userName,
                    password: req.body.password
                });
                user.save()
                    .then( savedUser => res.json(savedUser))
                    .catch( () => {
                        res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
                    });
            } else {
                res.sendStatus(httpStatus.BAD_REQUEST)
            }
        }
    });
}

export default { createIfNotExists };