const express = require("express");
const session = require("express-session");
const path = require("path");
const exphbs = require("express-handlebars");
const routers = require("./controllers");
const sequelize = require("./config/connection")
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const helpers = require('./utils/helpers');
const hbs = exphbs.create({ helpers });

const PORT = process.env.PORT || 3001;
const app = express();

const sess = {
    secret: "secert",
    cookie: {},
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
    db: sequelize
})
};

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.use(session(sess));
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(express.static(path.join(__dirname, "public")));
app.use(routers)

sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log('Now listening'));
});