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

const Users = Bookshelf.Model.extend({
  tableName: "users",
});

/* GET users listing. */
router.get("/", function (req, res, next) {
});

router.get("/add", (req, res, next) => {
  const data = {
    title: "users/login",
  };
  res.render("users/add", data);
});

router.post("/add", (req, res, next) => {
  console.log(`保存されるパラメータ：${JSON.stringify(req.body)}`);
  new Users(req.body).save().then((collection) => {
    res.redirect("/users");
  });
});

module.exports = router;
