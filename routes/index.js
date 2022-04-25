const { response } = require('express');
var express = require('express');
var router = express.Router();
const knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: 'board_data.sqlite3',
  },
  useNullAsDefault: true
});
const Bookshelf = require('bookshelf')(knex);

const Message = Bookshelf.Model.extend({
  tableName: 'messages',
  hasTimestamps: true,
});

/* GET home page. */
router.get('/', function(req, res, next) {
  new Message().fetchAll().then((collection) => {
    const data = {
      title: 'Express',
      content: collection.toArray(),      
    };
    res.render('index', data);
  });
});

router.post('/', (req, res, next) => {
  console.log(req.body);
  new Message(req.body).save().then((collection) => {
    res.redirect('/');
  });
});

module.exports = router;
