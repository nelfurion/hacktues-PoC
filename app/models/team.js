var mongoose = require('mongoose');

var teamSchema = mongoose.Schema({
    name: String,
    members: Array,
    projectName: String,
    projectDescription: String,
    technologies: []
});

module.exports = mongoose.model('Team', teamSchema);
