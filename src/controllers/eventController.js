import httpStatus from 'http-status';
import event from '../models/event';
import requestUtils from '../utils/requestUtils'

function createEvent(req, res, next) {
    const userName = requestUtils.extractUserNameFromRequest(req);
    const newEvent = new event.EventModel({
        creator: {
            userName: userName,
            device: req.body.device
        },
        type: req.body.type,
        relatedEntities: req.body.relatedEntities,
        duration: req.body.duration,
    });

    newEvent.save()
        .then( savedEvent => res.json(savedEvent) )
        .catch( err => {
            res.status(httpStatus.BAD_REQUEST).json(err)
        })
}

export default { createEvent };