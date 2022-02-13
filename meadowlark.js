const express = require("express");
const Sentry = require('@sentry/node')
const Tracing = require("@sentry/tracing");
const bodyParser = require("body-parser");
const expressHandlebars = require("express-handlebars");
const multiparty = require("multiparty");

const cookieParser = require("cookie-parser");
const cluster = require("cluster")
// 配置文件
const { credentials } = require("./config");
const expressSession = require("express-session");
const RedisStore = require("connect-redis")(expressSession)

require('./db')
const app = express();
Sentry.init({ 
  dsn: 'https://abc69f5da118469bad96dab401f92989@o1137646.ingest.sentry.io/6190669',
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Tracing.Integrations.Express({ app }),
  ], 
  tracesSampleRate: 1.0,
})
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());
app.use(
  expressSession({
    resave: false,
    saveUninitialized: false,
    secret: credentials.cookieSecret,
    store:new RedisStore({
      url:credentials.redis.url,
      logErrors:true
    })
  })
);
app.use((req, res, next) => {
  if(cluster.isWorker)
  console.log(`Worker ${cluster.worker.id} received request`)
  next()
  })

// flash中间件
const flashMiddleware = require("./lib/middleware/flash");
const autoViewsMiddleware = require("./lib/middleware/auto-views")

app.use(flashMiddleware);
const handlers = require("./lib/handlers");
const weatherMiddlware = require("./lib/middleware/weather");


app.use(cookieParser(credentials.cookieSecret));
app.engine(
  "handlebars",
  expressHandlebars.engine({
    defaultLayout: "main",
    helpers: {
      section: function (name, options) {
        if (!this._sections) {
          this._sections = {};
        }
        this._sections[name] = options.fn(this);
        return null;
      },
    },
  })
);

app.disable("x-powered-by");

app.set("view engine", "handlebars");

const port = process.env.PORT || 3000;

app.use(express.static(__dirname + "/public"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(weatherMiddlware);

app.get("/", handlers.home);

app.get("/about", handlers.about);

app.get("/section", handlers.section);
//fetch
app.get("/newsletter", handlers.newsletter);
app.post("/api/newsletter-signup", handlers.api.newsletterSignup);
app.get("/newsletter-signup", handlers.newsletterSignup);
app.post("/newsletter-signup/process", handlers.newsletterSignupProcess);
app.get("/newsletter-signup/thank-you", handlers.newsletterSignupThankYou);

app.get("/contest/vacation-photo", handlers.vacationPhoto);
// 上传文件
app.post("/contest/vacation-photo/:year/:month", (req, res) => {
  const form = new multiparty.Form();
  form.parse(req, (err, fields, files) => {
    if (err) return res.status(500).send({ error: err.message });
    handlers.vacationPhotoContestProccess(req, res, fields, files);
  });
});
app.get("/contest/vacation-photo-contest", handlers.vacationPhotoContest);
app.post(
  "/api/vacation-photo-contest/:year/:month",
  handlers.api.newsletterSignup
);
app.get("/contest/vacation-photo-thank-you", handlers.vacationPhotoThankYou);
// 获取archive
app.get("/newsletter/archive",handlers.newsletterArchive)
app.get("/cart",handlers.cartCheckout)
app.get('/fail',handlers.handlerError)

app.get('/vacations', handlers.listVacations)

app.get('/set-currency/:currency', handlers.setCurrency)
app.use(autoViewsMiddleware)
// 自动化渲染视图
app.use(Sentry.Handlers.errorHandler());
// 定制404页
app.use(handlers.notFound);
// 定制500页
app.use(handlers.serverError);

process.on('uncaughtException', err => {
  // 在这里做一些必要的清理工作，例如关闭数据库连接
  Sentry.captureException(err)
  process.exit(1)
})
function startServer(port){
  app.listen(port, () => {
    console.log(
      `Express started on http://localhost:${port}; ` +
        "press Ctrl+C to terminate."
    );
  });
}
if (require.main == module) {
  startServer(port)
} else {
  // 这里导出创建服务器的函数
  module.exports = startServer;
}
