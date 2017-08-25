const Mongoose = require('mongoose'),
    Schema = Mongoose.Schema;

const UserSchema = new Schema({
    username: { type: String, required: [true, 'Username is not valid'] },
    email: { type: String, validate: [/\S+@\S+\.\S/, 'Email is not valid'] },
    password: { type: String },
    createdAt: { type: Date, default: Date.now }
});

module.exports = Mongoose.models.users || Mongoose.model('users', UserSchema);