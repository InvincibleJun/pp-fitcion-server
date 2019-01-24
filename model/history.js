module.exports = {
  name: 'history',
  schema: {
    bookId: {
      type: String,
      ref: 'fiction'
    },
    articleIndex: {
      type: String
    },
    userId: {
      type: String,
      ref: 'user'
    },
    articleName: {
      type: String
    },
    title: {
      type: String
    },
    createTime: {
      type: Date,
      default: Date.now
    }
  }
};
