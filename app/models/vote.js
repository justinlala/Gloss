'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var VoteSchema = new Schema({
  user: {
    type: String
  },
  choice: {
    type: String
  },
  tile: {
    type: String
  },
  upVotes: {
    type: Number
  },
  downVotes: {
    type: Number
  },
});

VoteSchema.statics = {
  load: function(id, cb) {
    this.findOne({
      _id: id
    }).populate('user', 'displayName', 'tile').exec(cb);
  }
};

mongoose.model('Vote', VoteSchema);