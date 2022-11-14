const app = require("./app");
const PORT = process.env.PORT || 8080;

app.listen(PORT, (err) => {
  if (err) console.error(err.message);
  console.log(`Listening on port ${PORT}...`);
});
