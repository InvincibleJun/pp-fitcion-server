module.exports = {
  name: 'fiction',
  schema: {
    title: {
      type: String,
      unique: true
    },
    download: {
      type: Boolean,
      default: false
    },
    desc: {
      type: String
    },
    content: {
      type: Array,
      default: []
    },
    updateTime: {
      type: Date,
      default: Date.now
    },
    createTime: {
      type: Date,
      default: Date.now
    },
    auth: {
      type: String,
      default: ''
    },
    count: {
      type: Number,
      default: 0
    },
    picture: {
      type: String,
      default: ''
    }
  }
};