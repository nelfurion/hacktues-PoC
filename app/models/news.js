var mongoose = require('mongoose');

var newsSchema = mongoose.Schema({
    name: String,
    content: String,
    published: Date
});

module.exports = mongoose.model('News', newsSchema);
