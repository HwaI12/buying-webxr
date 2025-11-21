// server.js
const express = require("express");
const path = require("path");
const app = express();

app.use(express.static(path.join(__dirname, "public"))); // index.html, models/ など

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT} で起動中`);
});
