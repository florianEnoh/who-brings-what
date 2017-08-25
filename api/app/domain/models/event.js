const Mongoose = require('mongoose'),
    Schema = Mongoose.Schema;

const eventSchema = new Schema({
    title: { type: String, required: [true, 'A title is required'] },
    location: String,
    date: String,
    url: String,
    hostId: { type: Schema.Types.ObjectId, required: [true, 'A host is required'] },
    guestsIds: [{ type: Schema.Types.ObjectId }],
    needs: [{ name: String, quantity: Number }],
    comments: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = Mongoose.models.events || Mongoose.model('events', eventSchema);