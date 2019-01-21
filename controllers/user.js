/**
 * 添加用户
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function addUser(req, res, next) {
  const { openid, nickName: name, avatarUrl: url } = req.body;
  const exitsUser = await mdb.user.findOne({ openid });

  if (exitsUser) {
    return res.send(200);
  }

  await mdb.user.create({
    openid,
    name,
    url
  });

  res.send(200);
}

/**
 * 查询用户
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function getUser(req, res, next) {
  const { openid } = req.params;

  const result = await mdb.user.findOne({ openid }).populate('books');

  res.send(result);
}

/**
 * 更新用户
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function updateUser(req, res, next) {
  const { _id, openid } = req.body;
  // if (_id) {
  const has = await mdb.user.findOne({
    openid,
    books: {
      $in: [_id]
    }
  });

  if (has) {
    return res.send(200);
  }

  await mdb.user.update({ openid }, { $push: { books: _id } });

  res.send(200);
}

module.exports = {
  updateUser,
  addUser,
  getUser
};
