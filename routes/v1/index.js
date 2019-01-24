const IndexController = require('../../controllers/index');
const UserController = require('../../controllers/user');

module.exports = router => {
  router.get('/search/:keyword', IndexController.searchBooks);

  router.get('/book/status/:id', IndexController.checkIsDownLoad);

  router.get('/open/:id', IndexController.openBook);

  // router.get('/test', IndexController.test);

  router.get('/article/:index', IndexController.openArticle);

  router.get('/check/:id', IndexController.checkIsDownLoad);

  router.post('/user', UserController.addUser);

  router.put('/user', UserController.updateUser);

  router.get('/user', UserController.getUser);

  router.get('/user/book', UserController.getUserBooks);

  router.get('/update', IndexController.update);
};
