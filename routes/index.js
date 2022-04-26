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

const Message = Bookshelf.Model.extend({
  tableName: "messages",
  hasTimestamps: true,
});

/* GET home page. */
router.get("/", function (req, res, next) {
  new Message().fetchAll().then((collection) => {
    // const data = {
    //   title: "Express",
    //   content: collection.toArray(),
    //   pagination: collection.pagination,
    // };
    // res.render("index", data);
    res.redirect('/1');
  });
});

router.post("/", (req, res, next) => {
  console.log(req.body);
  new Message(req.body).save().then((collection) => {
    res.redirect("/");
  });
});

router.get("/:page", (req, res, next) => {
  const page = req.params.page >= 1 ? req.params.page : 1;
  new Message().fetchPage({ page: page, pageSize: 5 }).then((collection) => {
    const data = {
      title: "Express",
      content: collection.toArray(),
      pagination: collection.pagination,
    };
    console.log(collection.pagination);
    res.render("index", data);
  });
});

router.get("/login", (req, res, next) => {

});

module.exports = router;
