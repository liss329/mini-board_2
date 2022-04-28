const express = require("express");
// eslint-disable-next-line new-cap
const router = express.Router();
const knex = require("knex")({
  client: "sqlite3",
  connection: {
    filename: "board_data.sqlite3",
  },
  useNullAsDefault: true,
});
const Bookshelf = require("bookshelf")(knex);
Bookshelf.plugin("pagination");

const User = Bookshelf.Model.extend({
    tableName: "users",
});

const Message = Bookshelf.Model.extend({
  tableName: "messages",
  hasTimestamps: true,
  user: function() {
      return this.belongsTo(User);
  },
});

/* GET home page. */
router.get("/", function (req, res, next) {
  if (req.session.login === true) {
    res.redirect("/board/1");
  } else {
    res.redirect("/users");
  }
});

router.post("/", (req, res, next) => {
  console.log(req.body);
  new Message(req.body).save().then((collection) => {
    res.redirect("/");
  });
});

router.get("/:id/:page", (req, res, next) => {
    const page = req.params.page >= 1 ? req.params.page : 1;
//    nameは一意ではないので、とりあえずuser_idで
//    const name = req.params.name;
  const id = req.params.id;
    new Message()
  .orderBy('created_at', 'DESC')
  .where("user_id", "=", id)
  .fetchPage({ page: page, pageSize: 5, withRelated: ['user']})
  .then((collection) => {
    const data = {
      title: "home",
      content: collection.toArray(),
      pagination: collection.pagination,
    };
    res.render("index", data);
  }).catch((err) => {
      res.status(500).json({error: true, data: {message: err.message}});
  });
});

module.exports = router;
