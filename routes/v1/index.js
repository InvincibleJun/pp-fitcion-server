const IndexController = require('../../controllers/index');
const UserController = require('../../controllers/user');

module.exports = router => {
  router.get('/search/:keyword', IndexController.searchBooks);

  router.get('/open/:id', IndexController.openBook);

  router.get('/article/:index', IndexController.openArticle);

  router.get('/check/:id', IndexController.checkIsDownLoad)

  router.post('/user', UserController.addUser)
  
  router.put('/user', UserController.updateUser)
  
  router.get('/user/:openid', UserController.getUser)
  router.get('/update', IndexController.update)
};
