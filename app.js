var express        = require("express"),
    app            = express(),
    bodyParser     = require("body-parser"),
    mongoose       = require("mongoose"),
    flash          = require("connect-flash"),
    passport       = require("passport"),
    LocalStrategy  = require("passport-local"),
    methodOverride = require("method-override"),
    Campground     = require("./models/campground"),
    Comment        = require("./models/comment"),
    User           = require("./models/user"),
    seedDB         = require("./seeds");

//requiring routes
var campgroundRoutes = require("./routes/campgrounds"),
	commentRoutes    = require("./routes/comments"),
	indexRoutes		 = require("./routes/index");

var url = process.env.DATABASEURL || "mongodb://localhost:27017/yelp_camp;"

mongoose.connect(url , { 
    useNewUrlParser: true, 
    useCreateIndex:true , 
    useUnifiedTopology: true, 
    useFindAndModify: false 
}).then(()=>{
    console.log("connected to DB");
}).catch(err => { 
    console.log("ERROR: " , err.message);
}); 

//wrote export DATABASEURL=mongodb://localhost:27017/yelp_camp in cli
//mongoose.connect("mongodb://localhost:27017/yelp_camp" , { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

// mongoose.connect("mongodb+srv://Mongod:Sara%402003@cluster0-rrz9x.mongodb.net/test?retryWrites=true&w=majority" , { 
//     useNewUrlParser: true, 
//     useCreateIndex:true , 
//     useUnifiedTopology: true, 
//     useFindAndModify: false 
// }).then(()=>{
//     console.log("connected to DB");
// }).catch(err => { 
//     console.log("ERROR: " , err.message);
// });

app.use(bodyParser.urlencoded({extended : true}));
app.set("view engine" , "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB();


//PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret : "This is to encode and decode",
	resave : false,
	saveUninitialized : false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req , res , next){
	res.locals.currentUser = req.user;
    res.locals.error       = req.flash("error");
    res.locals.success     = req.flash("success");
	next();
});

app.use("/" , indexRoutes);
app.use("/campgrounds" , campgroundRoutes);
app.use("/campgrounds/:id/comments" , commentRoutes);

app.listen(process.env.PORT, process.env.IP , function(){
	console.log("YelpCamp server has started");
});