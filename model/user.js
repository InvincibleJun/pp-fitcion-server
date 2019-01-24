const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = {
  name: 'user',
  schema: {
    openid: {
      type: String,
      unique: true
    },
    name: {
      type: String
    },
    url: {
      type: String
    },
    books: {
      type: [
        {
          index: {
            type: Number
          },
          bookId: {
            type: Schema.Types.ObjectId,
            ref: 'fiction'
          }
        }
      ],
      default: []
    }
  }
};
