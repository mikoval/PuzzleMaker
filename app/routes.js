var Game = require('./models/game');
module.exports = function(app, passport) {

// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/login', function(req, res) {
        res.render('login.ejs');
    });

    // PROFILE SECTION =========================
    
    app.get('/', function(req, res) {
    	res.redirect('/home');
   
        
    });
    app.get('/home', isLoggedIn, function(req, res) {

        console.log(req.user.id)

        Game.find({created_by: req.user.id}, function(err, levels){
            console.log(levels.length);
                res.render('home.ejs', {
                user : req.user,
                levels : levels

            })

        })

        
    });
    app.post('/home', isLoggedIn, function(req, res) {

        var param = req.body;
        var game = new Game();
        

        game.game = param.data;
        game.created_by = req.user.id

        
        game.save(function(){
            res.json(game._id);
        });
        
     
    });
     app.delete('/home', isLoggedIn, function(req, res) {

        var param = req.body.id;
      
        console.log(param);

        Game.findByIdAndRemove(param, function(){
            Game.find({created_by: req.user.id}, function(err, levels){
                res.json(levels);
            });
        });
        
     
    });

    app.get('/play/:id', isLoggedIn, function(req, res) {


        Game.findOne({_id: req.params.id}, function(err, game){
                res.render('play.ejs', {
                user : req.user,
                game : game

            })

        })

        
    });
   
    app.get('/create', isLoggedIn, function(req, res) {


        
        res.render('create.ejs', {
            user : req.user,

        })

        

        
    });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });


    app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect : '/home',
            failureRedirect : '/jalksd;fakdfja;slfjasdlfkja'
        }));


    app.get('/auth/twitter', passport.authenticate('twitter', { scope : 'email' }));

    // handle the callback after twitter has authenticated the user
    app.get('/auth/twitter/callback',
        passport.authenticate('twitter', {
            successRedirect : '/home',
            failureRedirect : '/'
        }));


    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

    // the callback after google has authenticated the user
    app.get('/auth/google/callback',
        passport.authenticate('google', {
            successRedirect : '/home',
            failureRedirect : '/'
        }));


};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    console.log('checking logged in');
    console.log(req.isAuthenticated());
    console.log(req.session);

    if (req.isAuthenticated())
        return next();

    res.redirect('/login');
}
function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    })
}