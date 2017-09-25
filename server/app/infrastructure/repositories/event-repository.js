const Event = require('../../domain/models/event');

module.exports = {
    save(event) {
        return new Event(event).save();
    },

    addGuest(code, guestId) {
        return Event.findOneAndUpdate({ code }, {
            $push: { guestsIds: guestId }
        });
    },

    findByCode(code) {
        return Event.findOne({ code });
    },

    getEventAggregateByCode(eventCode) {
        return Event.aggregate([{
                $match: {
                    "code": eventCode
                }
            },

            {
                $lookup: {
                    "from": "users",
                    "localField": "hostId",
                    "foreignField": "_id",
                    "as": "host"
                }
            },

            {
                $unwind: {
                    path: "$host"
                }
            },

            {
                $unwind: {
                    path: "$guestsIds",
                    preserveNullAndEmptyArrays: true
                }
            },

            {
                $lookup: {
                    "from": "users",
                    "localField": "guestsIds",
                    "foreignField": "_id",
                    "as": "guests"
                }
            },

            {
                $unwind: {
                    path: "$guests",
                    preserveNullAndEmptyArrays: true
                }
            },

            {
                $lookup: {
                    "from": "contributions",
                    "localField": "guests._id",
                    "foreignField": "userId",
                    "as": "guests.participations"
                }
            },

            {
                $unwind: {
                    path: "$guests.participations",
                    preserveNullAndEmptyArrays: true
                }
            },

            {
                $group: {
                    _id: "$_id",
                    title: { "$first": "$title" },
                    date: { "$first": "$date" },
                    location: { "$first": "$location" },
                    host: { "$first": "$host.username" },
                    code: { "$first": "$code" },
                    needs: { "$first": "$needs" },
                    guests: { "$push": { username: "$guests.username", participations: "$guests.participations.involvements" } },
                    comments: { "$first": "$comments" }
                }
            },

            // Stage 10
            {
                $project: {
                    _id: "$_id",
                    title: 1,
                    date: 1,
                    location: 1,
                    host: 1,
                    code: 1,
                    needs: 1,
                    guests: { $cond: { if: { $eq: ["$guests", [{}]] }, then: [], else: "$guests" } },
                    comments: 1
                }
            }
        ]);
    }


};