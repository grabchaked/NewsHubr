// NewsHubr 2017 by Eduard Grabchak

var express = require("express");
var path = require('path');
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var mongoose = require('mongoose');
var pug = require('pug');
var bcrypt = require('bcryptjs');
var config = require('./back/config/db');
var shortid = require('shortid');

mongoose.Promise = global.Promise;
mongoose.connect(config.db);
var db = mongoose.connection;

db.once('open', function () {
    console.log('Connected to mongodb');
});

db.on('error', function (err) {
    console.log(err);
});

var app = express();

var Post = require('./back/models/post');
var User = require('./back/models/user');

app.use(express.static(__dirname+"/front"));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.set('views', path.join(__dirname, 'front/views'));
app.set('view engine', 'pug');

app.locals.moment = require('moment');

app.get('/', function (req,res) {
    Post.find({}, null, {sort: {created: -1}}, function (err,posts) {
        if(err) {
            console.log(err);
        } else {
        res.render('index', {
            title: 'NewsHubr',
            posts:posts,
            moment: require("moment")
        });
    }
    });
});

app.get('/post/:id', function (req,res) {
    Post.findById(req.params.id, function (err,post) {
        res.render('post', {
            post:post
        });
    });
});

app.get('/posts/add', function (req,res) {
    res.render('add', {
        title:'Add a new post'
    });
});

app.get('/about', function (req,res) {
    res.render('about', {
        title:'About author'
    });
});

app.post('/posts/add', function (req,res) {
    var post = new Post();
    var id = shortid.generate();
    post.title = req.body.title;
    post.img_url = req.body.img_url;
    post.created = new Date();
    post.author = req.body.author;
    post.author_id = id;

    post.save(function (err) {
        if(err){
            console.log(err);
            return;
        } else {
            if (req.cookies === undefined || !req.cookies.hash) res.cookie("hash", id);
            res.redirect('/');
        }
    });


});

app.get('/post/edit/:id', function (req,res) {
    Post.findById(req.params.id, function (err,post) {
        res.render('edit', {
            title:'Edit post',
            post:post
        });
    });
});

app.post('/posts/edit/:id', function (req,res) {
    var post = {};
    post.title = req.body.title;
    post.img_url = req.body.img_url;
    post.created = req.body.created;
    post.author = req.body.author;

    var query = {_id:req.params.id}

    Post.update(query, post, function (err) {
        if(err){
            console.log(err);
            return;
        } else {
            res.redirect('/');
        }
    });
});

app.post('/post/delete', function (req,res) {
    var hash = req.cookies.hash || "";
    var query = {_id:req.body.id, hash: req.cookies.hash};
    Post.remove(query, function (err) {
        if(err){
            console.log(err);
        }
        res.redirect(301, '/');
    });
});


app.get('/users/register', function (req,res) {
    res.render('register');
});

app.post('/users/register', function (req,res) {
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;

    var newUser = new User({
        username:username,
        email:email,
        password:password
    });

    bcrypt.genSalt(10, function (err,salt) {
        bcrypt.hash(newUser.password, salt, function (err,hash) {
            if(err) console.log(err);
            newUser.password = hash;
            newUser.save(function (err) {
                if(err) {
                    console.log(err);
                } else {
                    res.redirect('/users/login');
                }

            });
        });
    });
});

app.get('/users/login', function (req,res) {
    res.render('login');
});

app.listen(process.env.PORT || 3333, function () {
    console.log('! Server started on port 3333 !');
});
