const express = require('express');
const router = express.Router();

const app = express();
const mongoose = require('mongoose');
const expressEjsLayout = require('express-ejs-layouts'); //layout support for ejs in Express
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('./config/passport')(passport);

//Connection to mongoose
mongoose.connect('mongodb+srv://auzziemozi:iTa4i90uk8ss@cluster0.sgenm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('connected'))
.catch((err) => console.log(err));

//EJS settings
app.set('view engine', 'ejs'); //tell express to use ejs
app.use(expressEjsLayout);

//BodyParser & CSS
app.use(express.urlencoded({extended: false}));
app.use(express.static(__dirname + "/public"));

//Flash-message setting
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
//Passport setting
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error-msg');
    res.locals.error = req.flash('error');

    next();
})

//Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

app.listen(4555)