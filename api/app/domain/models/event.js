const Mongoose = require('mongoose'),
    Schema = Mongoose.Schema;

const eventSchema = new Schema({
    title: { type: String, required: true },
    location: String,
    date: String,
    url: String,
    hostId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    guestsIds: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    needs: [{ name: String, quantity: Number, category: String, status: Number }],
    comments: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = Mongoose.models.Event || Mongoose.model('Event', eventSchema);