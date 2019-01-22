/**
 * 添加用户
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function addUser(req, res, next) {
  console.log(req.body);
  const { openid, nickName: name, avatarUrl: url } = req.body;
  const exitsUser = await mdb.user
    .findOne({ openid })
    .populate({ path: 'books.bookId', select: ['auth', 'title', 'picture'] });
  // .populate({
  // path: 'books.$.bookId',
  // { $elemMatch: { bookId: _id } }
  // });

  if (exitsUser) {
    return res.send(exitsUser);
  }

  const result = await mdb.user.create({
    openid,
    name,
    url
  });

  res.send(result);
}

/**
 * 查询用户
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function getUser(req, res, next) {
  const { id } = req.params;

  const result = await mdb.user.findById(id).populate('books');

  res.send(result);
}

/**
 * 更新用户
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function updateUser(req, res, next) {
  const { openid, _id } = req.body;

  const has = await mdb.user.findOne({
    openid,
    books: { $elemMatch: { bookId: _id } }
  });

  if (has) {
    return res.send(200);
  }

  await mdb.user.update(
    { openid },
    { $push: { books: { bookId: _id, index: -1 } } }
  );

  res.send(200);
}

module.exports = {
  updateUser,
  addUser,
  getUser
};
