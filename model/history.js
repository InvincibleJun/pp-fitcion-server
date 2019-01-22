module.exports = {
  name: 'history',
  schema: {
    bookId: {
      type: String,
      ref: 'fiction'
    },
    contentIndex: {
      type: String
    },
    userId: {
      type: String,
      ref: 'user'
    }
  }
};
