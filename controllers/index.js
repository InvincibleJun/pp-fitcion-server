const fs = require('fs-extra');
const {
  downloadBook,
  readArticle,
  readHistory
} = require('../services/fiction');

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function searchBooks(req, res, next) {
  const { keyword } = req.params;
  const result = await mdb.fiction
    .find({ title: new RegExp('^' + keyword) }, [
      'title',
      'count',
      'auth',
      'picture'
    ])
    .limit(10);

  res.send(result);
}

/**
 * 打开一本书
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function openBook(req, res, next) {
  const { id } = req.params;

  const result = await mdb.fiction.findById(id, [
    'title',
    'count',
    'auth',
    'picture',
    'desc',
    'updateTime',
    'download',
    'content'
  ]);

  res.send(result);

  if (!result.download) {
    await downloadBook(id, result.content);
  }
}

/**
 * 打开文件
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function openArticle(req, res, next) {
  const { _id } = req.query;
  const { index, userId } = req.params;
  const { openid } = req.headers;

  const { content, count, title } = await mdb.fiction.findById(_id);

  let article = await readArticle(_id, index);

  if (openid) {
    await readHistory(openid, _id, index, title, content[index].name);
  }

  res.send({
    title,
    index,
    _id,
    article,
    count,
    now: content[index],
    prev: content[+index - 1],
    next: content[+index + 1]
  });
}

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function checkIsDownLoad(req, res, next) {
  const { id } = req.params;
  const { download } = await mdb.fiction.findById(id, 'download');
  res.send({ download });
}

module.exports = {
  searchBooks,
  openBook,
  openArticle,
  update,
  // test,
  checkIsDownLoad
};

async function update(req, res) {
  var i = 0;

  setInterval(async () => {
    const t = +new Date();
    const d = await mdb.fiction
      .find({}, ['_id'])
      .limit(1)
      .skip(10000);
    // console.log(t - new Date());

    // d.forEach(async ({ _id }) => {
    //   const result = await mdb.fiction.findById(_id, ['content']);
    //   result.content = result.content.map(v => {
    //     return {
    //       ...v,
    //       href: v.href.replace(/(\/book)+/, '/book')
    //     };
    //   });
    //   console.log(_id)
    //   await mdb.fiction.updateOne({ _id }, { content: result.content });
    // });

    // i++;

    // res.send(d);
  }, 500);
}

// async function test(req, res) {
//   // const result = await mdb.fiction.update(
//   //   { _id: '5c486a8f45f60ea72cd68fc5' },
//   //   { $set: { download: false } }
//   // );

//   const result = await mdb.fiction.findById('5c48697545f60ea72cd66f98')

//   res.send(result);
// }
