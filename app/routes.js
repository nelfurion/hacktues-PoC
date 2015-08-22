var User = require('./models/user.js');
var Page = require('./models/page.js');
var Team = require('./models/team.js');

module.exports = function (app, passport) {
    /*NEW ROUTER */
    app.get('/', function(req, res) {
        Page.find({}, function(err, pages) {
            if (err) {
                throw err;
            }

            var navPages = [];

            for (var i = 0; i < pages.length; i++) {
                if (pages[i].nav === 'true') {
                    navPages.push(pages[i]);
                }
            }

            console.log(navPages);

            res.render('index.ejs', {
                message: req.flash('privilegesMessage'),
                dbPages: pages,
                navPages: navPages
            });
        });
    });

    app.get('/createTeam', function(req, res) {
        res.render('partials/create-team.ejs');
    });

    app.post('/createTeam', function(req, res) {
        console.log(req.body);
        var teamName = req.body.name,
            projectName = req.body.projectName,
            projectDescription = req.body.projectDescription,
            teamTechnologies = req.body.technologies,
            creator = req.body.creator;

        if (teamName && projectName && projectDescription &&
            teamTechnologies && creator) {
            Team.findOne({name: teamName}, function (err, team) {
                if (err) {
                    throw err;
                }

                //can't set this team name if such team already exists
                if (team) {
                    console.log('HERE');
                    res.send(500);
                    return;
                }

                Team.collection.insert({
                    name: teamName,
                    members: [{
                        id: creator._id,
                        name: creator.name
                    }],
                    creator: creator._id,
                    captain: null,
                    projectName:projectName,
                    projectDescription: projectDescription,
                    technologies: teamTechnologies,
                    memberInvites: []
                }, function (err, docs) {
                    if (err) {
                        throw err;
                    }

                    console.log('Created team:');
                    console.log('----Name: ' + docs[0].name);
                    console.log('----_id: ' + docs[0]._id);

                    User.update({_id: creator._id}, {
                        team: teamName
                    }, function (err, numAffected) {
                        if (err) {
                            throw err;
                        }

                        console.log('Updated: ' + numAffected + ' users...');
                    });

                    res.send(docs[0]);
                });

            });
        }
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

    app.get('/teams', function(req, res) {
        Team.find({}, function (err, teams) {
            if (err) {
                throw err;
            }
            res.render('teams.ejs',{
                teams: teams
            });
        })
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
        Team.findOne({name: req.user.team}, function (err, team) {
            if (err) {
                throw err;
            }
            //TODO change to send team object
            var teamMembers = [];
            if (team) {
                teamMembers = team.members;
            }

            res.render('profile.ejs', {
                user: req.user,
                teamMembers: teamMembers,
                //TODO user messages should be retrieved from db
                userMessages: []
                 // get the user out of session and pass it to template
            });
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
        /*Async, so not sure how to separate validation functions from update
            and call update after validation has finished.
            There existed validation functions once...*/
        updateUserInfo(req, res);
    });

    app.get('/*', function(req, res) {
        console.log('ORIGINAL URL: ' + req.originalUrl);
        Page.findOne({href: req.originalUrl}, function (err, page) {
            if (err) {
                throw err;
            }

            if (!page) {
                res.render('404.ejs');
                return;
            }

            res.send(page.body);
        })
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

    function updateUserInfo(req, res) {
        User.update(req.body.query, req.body.options, function (err, numAffected) {
            if (err) {
                throw err;
            }

            console.log('Updated user: ' + req.body.query._id);
            //jquery data is set to json
            res.send('{}');
        });
    }
}
