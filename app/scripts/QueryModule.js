var QueryModule = (function () {
    var queryModule = {};

    queryModule.findAll = function (Model) {
        return Model.find({}, function (err, docs) {
            if (err) {
                throw err;
            }
            return docs;
        });
    }

    return queryModule;
}());
var queryModule = QueryModule;

module.exports = queryModule;
