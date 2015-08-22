var mongoose = require('mongoose');

var teamSchema = mongoose.Schema({
    name: String,
    members: Array,
    creator: String,
    captain: String,
    projectName: String,
    projectDescription: String,
    technologies: Array,
    memberInvites: Array
});

module.exports = mongoose.model('Team', teamSchema);
