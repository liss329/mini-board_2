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
  user: function () {
    return this.belongsTo(User);
  },
});

/* GET home page. */
router.get("/", function (req, res, next) {
  if (req.session.login !== undefined) {
    res.redirect("/1");
  } else {
    res.redirect("/users");
  }
});

router.post("/", (req, res, next) => {
  const record = {
    message: req.body.message,
    user_id: req.session.login.id,
  };
  new Message(record).save().then((collection) => {
    res.redirect("/");
  });
});

router.get("/:page", (req, res, next) => {
  const page = req.params.page >= 1 ? req.params.page : 1;
  new Message()
    .fetchPage({ page: page, pageSize: 5, withRelated: ["user"] })
    .then((collection) => {
      const data = {
        title: "Express",
        content: collection.toArray(),
        pagination: collection.pagination,
      };
      res.render("index", data);
    });
});

module.exports = router;
