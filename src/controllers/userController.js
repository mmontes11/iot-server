import httpStatus from 'http-status';
import User from '../models/userModel';

function save(req, res) {
    const user = new User({
        userName: req.body.userName,
        password: req.body.password
    });

    user.save()
        .then( savedUser => res.json(savedUser))
        .catch( e => {
            res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
        });
}

export default { save };