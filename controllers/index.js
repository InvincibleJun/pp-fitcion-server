const puppeteer = require('puppeteer');
const request = require('request-promise');
const fs = require('fs-extra');
const iconv = require('iconv-lite');
const cheerio = require('cheerio');
/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function searchBooks(req, res, next) {
  const { keyword } = req.params;

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(`https://www.biqubao.com/search.php?keyword=${keyword}`);

  const list = await page.evaluate(() => {
    const items = [...document.querySelectorAll('.result-item')];
    const result = items.map(dom => {
      const tags = dom.querySelectorAll('.result-game-item-info-tag');
      const link = dom.querySelector('.result-game-item-title-link');
      const url = link.getAttribute('href');
      const match = url.match(/(\d+)\/$/i);
      const id = match && match[1] ? match[1] : '';
      return {
        id,
        pirture: dom
          .querySelector('.result-game-item-pic-link-img')
          .getAttribute('src'),
        title: link.getAttribute('title'),
        desc: dom.querySelector('.result-game-item-desc').innerHTML,
        auth: tags[0]
          .querySelectorAll('span')[1]
          .innerHTML.replace(/\n| /g, ''),
        category: tags[1].querySelectorAll('span')[1].innerHTML,
        updateTime: tags[2].querySelectorAll('span')[1].innerHTML,
        newArtilce: tags[3].querySelector('a').innerHTML
      };
    });
    return result;
  });

  await browser.close();
  res.send(list);
}

/**
 * 打开一本书
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function openBook(req, res, next) {
  const { id } = req.params;
  const { title } = req.query;

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const hasSave = await mdb.fiction.findOne({ title });
  console.log(hasSave);
  if (!hasSave) {
    await page.goto(`https://www.biqubao.com/book/${id}/`);

    const data = await page.evaluate(() => {
      const title = document.querySelector('#info h1').innerHTML;
      const picture = document.querySelector('#fmimg img').getAttribute('src');
      const info = document.querySelector('#info');
      const authInner = info.querySelector('p').innerHTML;
      const auth = authInner.match(
        /作&nbsp;&nbsp;&nbsp;&nbsp;者：([\s\S]+)/
      )[1];
      const list = [...document.querySelectorAll('#list dl dd a')].map(val => {
        return {
          name: val.innerHTML,
          href: val.getAttribute('href')
        };
      });

      const desc = document.querySelector('#intro').innerHTML;

      return {
        desc,
        auth,
        title,
        picture,
        list
      };
    });

    await browser.close();
    let result = await mdb.fiction.create({
      desc: data.desc,
      title: data.title,
      auth: data.auth,
      content: data.list.map(v => v.name),
      count: data.list.length,
      picture: data.picture
    });

    await fs.mkdir(`./books/${result._id}`);
    await Promise.all(
      data.list.map((val, i) => {
        return new Promise(async (resolve, reject) => {
          try {
            const { name, href } = val;

            const resposne = await request({
              encoding: null,
              url: `https://www.biqubao.com${href}`
            });

            const html = iconv.decode(resposne, 'gb2312');
            const $ = cheerio.load(html, { decodeEntities: false });
            const content = $('#content')
              .html()
              .toString()
              .replace(/(&nbsp;)+/g, '　　')
              .replace(/<br>/g, '\r\n');

            await fs.writeFile(`./books/${result._id}/${i}`, content, 'utf-8');
          } catch (e) {
            reject(e);
          }
          resolve();
        });
      })
    );

    res.send(result);
  } else {
    res.send(hasSave);
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
  const { index } = req.params;
  const { content, count, title } = await mdb.fiction.findById(_id);

  let article = await fs.readFile(`./books/${_id}/${index}`, 'utf-8');

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

module.exports = {
  searchBooks,
  openBook,
  openArticle
};
