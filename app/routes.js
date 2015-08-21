var User = require('./models/user.js');
var Page = require('./models/page.js');

module.exports = function (app, passport) {
    app.get('/', function(req, res) {
        res.render('index.ejs', {
            message: req.flash('privilegesMessage')
        });
    });

    app.get('/index2', function(req, res) {
        var navPages = Page.find({nav: 'true'}, function (err, pages) {
            if (err) {
                throw err;
            }

            console.log(pages);
            res.render('index2.ejs', {
                navPages: pages
            });
        })
    });

    app.post('/epic/createPage', function(req, res) {
        console.log(req.body);
        Page.collection.insert(req.body, function (err, docs) {
            if (err) {
                throw err;
            }

            console.log('Pages were inserted: ' + docs.length);
            res.send('{}');
        });
    });

    app.get('/pages/:pageURL', function(req, res) {
        var navPages = Page.findOne({href: req.params.pageURL}, function (err, page) {
            if (err) {
                throw err;
            }

            if (!page) {
                console.log('NO SUCH PAGE?');
                res.render('Could not find such page.');
            }

            res.send(page.href);
        });
    });

    //show login form
    app.get('/login', function(req, res) {
        res.render('login.ejs', {
            message: req.flash('loginMessage')
        });
    });

    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/profile',
        failureRedirect: '/login',
        failureFlash: true
    }));

    //show signup form
    app.get('/signup', function(req, res) {
        res.render('signup.ejs', {
            message: req.flash('signupMessage')
        });
    });

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/profile',
        failureRedirect: '/signup',
        failureFlash: true //allow flash messages
    }));

    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user: req.user // get the user out of session and pass it to template
        });
    });

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    app.get('/admin',isLoggedIn, isAdmin, function (req, res) {
        res.render('admin/index.ejs');
    });

    app.get('/getAllUsers', function(req, res) {
        var users = User.find({}, function (err, users) {
            if (err) {
                throw err;
            }

            res.render('admin/users-partial.ejs', {
                users: users
            });
        })
    });

    app.post('/updateUserInfo', function(req, res) {
        User.update(req.body.query, req.body.options, function (err, numAffected) {
            if (err) {
                throw err;
            }

            console.log('Updated user: ' + req.params.id);
            //jquery data is set to json
            res.send('{}');
        });
    });



    //middleware to make sure user is logged in
    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        req.flash('privilegesMessage', 'You don\'t have the required privileges to visit this page!');
        res.redirect('/');
    }

    function isAdmin(req, res, next) {
        /*TODO: probably should be changed to use external admins collection*/
        if (req.user.userType === 'admin') {
            return next();
        }
        req.flash('privilegesMessage', 'You don\'t have the required privileges to visit this page!');
        res.redirect('/');
    }
}
