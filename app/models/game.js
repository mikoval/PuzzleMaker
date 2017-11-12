// load the things we need
var mongoose = require('mongoose');


// define the schema for our user model
var gameSchema = mongoose.Schema({
    id: String,
    created_by: String,
    game: String,


});

// methods ======================

// create the model for users and expose it to our app
module.exports = mongoose.model('Game', gameSchema);
