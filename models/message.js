var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = require('./user');

var schema = new Schema({
	content: {type: String, required: true},
	user: {type: Schema.Types.ObjectId, ref: 'User'}
});

schema.post('remove', function(message){
	User.findById(message.user, function(err, result){
		result.messages.pull(message);
		result.save();
	});
});

module.exports = mongoose.model('Message', schema);