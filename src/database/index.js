const mongoose = require('mongoose');

// connection to DB mongo using mongoose
mongoose.connect('mongodb://localhost/projects', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});
mongoose.Promise = global.Promise;

module.exports = mongoose;