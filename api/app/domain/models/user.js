const Mongoose = require('mongoose'),
    Schema = Mongoose.Schema;

const UserSchema = new Schema({
    username: { type: String, required: true },
    email: { type: String },
    password: { type: String }
});

module.exports = Mongoose.models.users || Mongoose.model('users', UserSchema);