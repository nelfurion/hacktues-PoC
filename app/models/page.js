var mongoose = require('mongoose');

var pageSchema = mongoose.Schema({
    name: String,
    href: String,
    nav: String
});

module.exports = mongoose.model('Page', pageSchema);
