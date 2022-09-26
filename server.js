// @ts-check

const express = require("express");
const mountRoutes = require('./routes');
const app = express();
mountRoutes(app);

const port = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));


(async () => {
  app.listen(port, () => {
    console.log(`listening at http://localhost:${port}`);
  });
})();

