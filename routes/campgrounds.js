
var express    = require("express"),
	router     = express.Router(),
	Campground = require("../models/campground"),
	middleware = require("../middleware");


// INDEX ROUTE - displays list of campgrounds
router.get("/" , function(req , res){
	//get all camprounds from the db
	Campground.find({} , function(err , allCampgrounds){
		if(err){
			console.log(err);
		}else{
			res.render("campgrounds/index" , {campground: allCampgrounds });
		}
	});
});

// CREATE ROUTE - adds new campground to db
router.post("/" , middleware.isLoggedIn , function(req , res){
	//get data from form 
	var name = req.body.name;
	var price = req.body.price;
	var img = req.body.image;
	var description = req.body.description;
	var author = {
		id : req.user._id,
		username : req.user.username
	};
	var newCampground = {name:name , price:price , image:img , description:description, author:author} ;
	//create a new campground and add to database
	Campground.create(newCampground , function(err , newlyCreated){
		if(err){
			console.log(err);
		}else{
			//redirect back to campgrounds page
			req.flash("success" , "Successfully created campground");
			res.redirect("/campgrounds");
		}
	});
});

//NEW ROUTE - displays form to make new campground
router.get("/new" , middleware.isLoggedIn , function(req , res){
	res.render("campgrounds/new");
});

//SHOW ROUTE - shows info about one campground
router.get("/:id" , function(req , res){
	//find the campground with the provided id
	Campground.findById(req.params.id).populate("comments").exec(function(err , foundCampground){
		if(err || !foundCampground){
			console.log(err);
			req.flash("error" , "Sorry , Campground not found");
			res.redirect("/campgrounds");
		}else{
			//render show template with that campground
			res.render("campgrounds/show" , {campground:foundCampground});
		}
	});
});

//EDIT CAMPGROUND ROUTE
router.get("/:id/edit" , middleware.checkCampgroundOwnership , function(req , res){
	Campground.findById(req.params.id , function(err , foundCampground){
			res.render("campgrounds/edit" , {campground : foundCampground});
	});
});

//UPDATE CAMPGROUND ROUTE
router.put("/:id" , middleware.checkCampgroundOwnership , function(req , res){
	Campground.findByIdAndUpdate(req.params.id , req.body.campground , function(err , updated){
		if(err){
			res.redirect("/campgrounds");
		}else{
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

//DESTROY ROUTE
router.delete("/:id" , middleware.checkCampgroundOwnership , function(req , res){
	Campground.findByIdAndRemove(req.params.id , function(err , deleted){
		if(err){
			res.redirect("/campgrounds");
		}else{
			req.flash("success" , "Successfully deleted campground");
			res.redirect("/campgrounds");
		}
	});
});

module.exports = router;