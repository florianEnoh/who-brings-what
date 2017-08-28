const Mongoose = require('mongoose'),
    Schema = Mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: { type: String, validate: [/\S+@\S+\.\S/] },
    password: { type: String },
    createdAt: { type: Date, default: Date.now }
});

module.exports = Mongoose.models.User || Mongoose.model('User', UserSchema);