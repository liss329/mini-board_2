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
  const data = {
    title: "users/login",
  };
  console.log(req.session.login);
  res.render("users/login", data);
});

router.post("/", (req, res, next) => {
  // eslint-disable-next-line new-cap
  Users.query({
    where: { name: req.body.name },
    andWhere: { password: req.body.password },
  })
    .fetch()
    .then((model) => {
      if (model !== null) {
        console.log(model.attributes);
        req.session.userName = model.attributes.name;
        req.session.login = true;
        console.log(
          `ログイン状態：${req.session.login}、ユーザーネーム：${req.session.userName}`
        );
        res.redirect("/");
      }
    });
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
