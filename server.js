var express = require('express');


const app = express();
const router = express.Router()
const port = process.env.PORT || 5000;
app.use(express.static(`${__dirname}/dist`));

app.engine('.html', require('ejs').renderFile)

router.get("/*", (req, res, next) => {
  res.sendFile(`${__dirname}/dist/index.html`)
})

app.use('/', router)

// app.listen(port);
console.log('server started '+ port);

module.exports = app;
