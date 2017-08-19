const Mongoose = require('mongoose'),
    Schema = Mongoose.Schema;

const eventSchema = new Schema({
    title: { type: String, required: true },
    location: String,
    date: String,
    url: String,
    hostId: { type: Schema.Types.ObjectId, required: true },
    guestsIds: [{ type: Schema.Types.ObjectId }],
    needs: [{ name: String, quantity: Number }],
    comments: String
});

module.exports = Mongoose.models.event || Mongoose.model('event', eventSchema);