var mongoose = require('mongoose');

var teamSchema = mongoose.Schema({
    name: String,
    players: Array
});

module.exports = mongoose.model('Team', teamSchema);
