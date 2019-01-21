const puppeteer = require('puppeteer');
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

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(`https://www.biqubao.com/book/${id}/`);

  const data = await page.evaluate(() => {
    const title = document.querySelector('#info h1').innerHTML;
    const picture = document.querySelector('#fmimg img').getAttribute('src');
    const list = [...document.querySelectorAll('#list dl dd a')].map(val => {
      return {
        name: val.innerHTML,
        href: val.getAttribute('href')
      };
    });

    return {
      title,
      picture,
      list
    };
  });

  await browser.close();
  res.send(data);
}

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function openArticle(req, res, next) {
  const { url } = req.params;
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(`https://www.biqubao.com/${url}`);

  const data = await page.evaluate(() => {
    const name = document.querySelector('.bookname h1').innerHTML;
    const content = document
      .querySelector('#content')
      .innerHTML.replace(/(&nbsp;)+/g, '　　')
      .replace(/<br>/g, '\r\n');
    const achor = document.querySelectorAll('.bottem1 a');

    return {
      name,
      content,
      prev: `${achor[0].getAttribute('href')}`,
      next: `${achor[2].getAttribute('href')}`
    };
  });

  await browser.close();

  res.send(data);
}

module.exports = {
  searchBooks,
  openBook,
  openArticle
};
