const iconv = require('iconv-lite');
const cheerio = require('cheerio');
const request = require('request-promise');
const fs = require('fs-extra');

/**
 * 下载书籍到本地
 * @param {*} id
 * @param {*} content
 */
async function downloadBook(id, content) {
  await fs.mkdir(`./books/${id}`);
  await Promise.all(
    content.map((val, i) => {
      return new Promise(async (resolve, reject) => {
        try {
          const { name, href } = val;
          // url 修正
          let url = href.replace(/(\/book)+/, '/book');

          const resposne = await request({
            encoding: null,
            url
          });

          const html = iconv.decode(resposne, 'gb2312');
          const $ = cheerio.load(html, { decodeEntities: false });
          const content = $('#content')
            .html()
            .toString()
            .replace(/(&nbsp;)+/g, '　　')
            .replace(/<br>/g, '\r\n');

          await fs.writeFile(`./books/${id}/${i}`, content, 'utf-8');
        } catch (e) {
          reject(e);
        }
        resolve();
      });
    })
  );
  await mdb.fiction.updateOne({ _id: id }, { download: true });
}

/**
 * 读取本地文件
 * @param {*} _id
 * @param {*} index
 */
async function readArticle(_id, index) {
  return await fs.readFile(`./books/${_id}/${index}`, 'utf-8');
}

async function readHistory(userId, bookId, index) {
  console.log(userId, bookId, index)
  await mdb.user.updateOne(
    { openid: userId, books: { $elemMatch: { bookId } } },
    { $set: { 'books.$.index': index } }
  );
}

module.exports = {
  readArticle,
  downloadBook,
  readHistory
};
