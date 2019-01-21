const IndexController = require('../../controllers/index');

module.exports = router => {
  router.get('/search/:keyword', IndexController.searchBooks);

  router.get('/open/:id', IndexController.openBook);

  router.get('/article/:url', IndexController.openArticle);
};
