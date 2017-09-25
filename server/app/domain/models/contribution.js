const Mongoose = require('mongoose'),
    Schema = Mongoose.Schema;

const contributionSchema = new Schema({
    eventId: { type: Schema.Types.ObjectId, ref: 'Event', require: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    involvements: [{ name: String, quantity: Number, category: String }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = Mongoose.models.Contribution || Mongoose.model('Contribution', contributionSchema);