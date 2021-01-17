const mongoose = require('mongoose');

// connection to DB mongo using mongoose
mongoose.connect('mongodb://localhost/noderest', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.Promise = global.Promise;

module.exports = mongoose;