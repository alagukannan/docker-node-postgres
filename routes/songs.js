const Router = require('express-promise-router')
const db = require('../db')
const multer = require('multer');
const csvtojson = require('csvtojson');
const uuid = require("uuid");
const _ = require("lodash");
const path = require("path");

// create a new express-promise-router
// this has the same API as the normal express router except
// it allows you to use async functions as route handlers
const router = new Router()
// export our router to be mounted by the parent application
module.exports = router


// multer
const storage = multer.memoryStorage()
const upload = multer({
  //storage: storage,
  fileFilter: function name(req, file, cb) {
    var ext = path.extname(file.originalname);
    switch (_.toLower(file.mimetype)) {
      case "text/csv":
        if (_.toLower(ext) == ".csv")
          return cb(null, true);
        break;
      default:
        return cb(new Error('Only CSV are allowed'));
        break;
    }
  },
  limits: {
    files: 1,
    fileSize: 5 * 1024 * 1024
  }
}
);

// 
router.post("/upload_files", upload.single('file'), async (req, res, next) => {
  // console.log(req.body);
  // console.log(req.file);
  try {
    const jsonArray = await csvtojson().fromString(req.file?.buffer.toString());
    const id = uuid.v4();
    console.log(id);
    await db.query('BEGIN');
    const results = await db.query({
      text: 'insert into songs(id, data) values($1, $2)',
      values: [id, JSON.stringify(jsonArray)]
    });
    await db.query('COMMIT');
    res.setHeader("Content-Type", "application/json");
    res.status(201);
    res.json({ message: "Successfully uploaded files", id: id, _self: `/songs/${id}` });
  }
  catch (err) {
    console.log(err.stack);
    res.sendStatus(500);
  }
});

router.get("/:Id", async (req, res, next) => {
  try {
    const results = await db.query({
      text: 'select * from songs where id = $1',
      values: [req.params.Id]
    });
    if (_.isEmpty(results.rows)) {
      res.sendStatus(404);
    }else{
      res.setHeader("Content-Type", "application/json");
      res.status(200);
      res.send(JSON.stringify(results.rows[0]));
    }

  }
  catch (err) {
    console.log(err.stack);
    res.sendStatus(500);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const results = await db.query({
      text: 'select * from songs limit 50'
    });
    res.setHeader("Content-Type", "application/json");
    res.status(200);
    res.send(JSON.stringify(results.rows));
  }
  catch (err) {
    console.log(err.stack);
    res.sendStatus(500);
  }
});