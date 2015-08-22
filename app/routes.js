var User = require('./models/user.js');
var Page = require('./models/page.js');
var Team = require('./models/team.js');
var SystemMessage = require('./models/systemMessage.js');
var serverError = 500; //for ajax

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

            res.render('index.ejs', {
                message: req.flash('privilegesMessage'),
                dbPages: pages,
                navPages: navPages
            });
        });
    });

    app.post('/getUserSystemMessages', function(req, res) {
        var userId = req.body.userId;

        User.findOne({_id: userId}, function (err, user) {
            if (err) {
                throw err;
            }

            var userMessages = user.systemMessages;

            res.send(userMessages);
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
                    res.send(serverError);
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
                        res.send('lorem');
                        console.log('Updated: ' + numAffected + ' users...');
                    });

                    res.send(docs[0]);
                });

            });
        }
    });

    app.post('/respondToTeamInvite', function(req, res) {
        var userId = req.body.userId,
            messageId = req.body.messageId,
            answer = req.body.answer;

        User.findOne({_id: userId}, function (err, user) {
            if (err) {
                throw err;
            }

            if (!user) {
                console.log(userId);
                throw 'Can\'t find user with such id: ' + userId;
            }

            var team = user.systemMessages[messageId].teamSender;
            user.systemMessages.splice(messageId, 1);
            if (answer) {
                user.team = team;
                Team.findOne({name: team}, function (err, team) {
                    if (err) {
                        throw err;
                    }

                    if (!team) {
                        throw 'Trying to add user to no existing team!';
                    }

                    team.members.push(user);
                })
            }

            user.save(function (err) {
                if (err) {
                    throw err;
                }

                res.send('lorem');
                console.log('Updated user: ' + user._id + '...');
            });
        });
    });

    app.post('/sendTeamInvite', function(req, res) {
        var receiverEmail = req.body.receiverEmail,
            teamName = req.body.teamName;

        User.findOne({email: receiverEmail}, function (err, user) {
            if (err) {
                throw err;
            }

            if (!user) {
                res.send('Няма потребител с такъв email.');
                return;
            }

            console.log('team name: ' + teamName);

            var messagesLength = user.systemMessages.length;
            var lastSystemMessage = user.systemMessages[messagesLength - 1];
            var newMessageId = 0;
            if (lastSystemMessage) {
                newMessageId = lastSystemMessage.id + 1;
            }

            var message = SystemMessage.InviteMessage(newMessageId, 'Invite from team: ' + teamName, teamName, receiverEmail);
            console.log(message);
            user.systemMessages.push(message);

            user.save(function (err) {
                if (err) {
                    throw err;
                    res.send('Възникна грешка.');
                }

                console.log('Added new System Message to user: ' + user._id);
                res.send('Поканата е изпратена.');
            });
        });
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
        //TODO FIX THIS BULLSHIT
        var teamName = req.body.options.team;
        console.log(teamName);
        User.findOne(req.body.query, function (err, user) {
            if (err) {
                throw err;
            }

            if (!user) {
                console.log('Can\'t find user...');
            }

            if (teamName) {
                Team.update({name: user.team}, {name: teamName}, function (err, numAffected) {
                    if (err) {
                        throw err;
                    }

                    console.log('Change team name...');
                });
            }
        })

        User.update(req.body.query, req.body.options, function (err, numAffected) {


            console.log('Updated user: ' + req.body.query._id);
            //jquery data is set to json
            res.send('{}');
        });
    }
}
