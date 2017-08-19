const Mongoose = require('mongoose'),
    Schema = Mongoose.Schema;

const contributionSchema = new Schema({
    eventId: { type: Schema.Types.ObjectId, required: true },
    userId: { type: Schema.Types.ObjectId, required: true },
    involvements: [{ name: String, quantity: Number }]
});

module.exports = Mongoose.models.contributions || Mongoose.model('contributions', contributionSchema);