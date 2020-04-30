var Campground    = require("../models/campground");
var Comment       = require("../models/comment");
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function( req , res , next) {
	//if the user logged in
	if(req.isAuthenticated()){
		Campground.findById(req.params.id , function(err , foundCampground){
			if(err || !foundCampground){
				req.flash("error" , "Sorry , Campground not found");
				res.redirect("back");
			}else{
				//does user own the campground?
				if(foundCampground.author.id.equals(req.user._id)){
					next();
				}else{
					req.flash("error" , "You don't have permission to do that");
					res.redirect("back");
				}
			}
		});
	//else redirect
	}else{
		req.flash("error" , "You need to be logged in do to that");
		res.redirect("back");
	}
}

middlewareObj.checkCommentOwnership = function(req , res , next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id , function(err , foundComment){
			if(err || !foundComment){
				req.flash("error" , "Sorry , Comment not found");
				res.redirect("back");
			}else{
				if(foundComment.author.id.equals(req.user._id)){
					next();
				}else{
					req.flash("error" , "You don't have permission to do that");
					res.redirect("back");
				}
			}
		});
	}else{
		req.flash("error" , "You need to be logged in do to that");
		res.redirect("back");
	}
}

middlewareObj.isLoggedIn = function(req , res , next){
	if(req.isAuthenticated()){
		return next();
	}else{
		req.flash("error" , "You need to be logged in do to that");
		res.redirect("/login");
	}
}


module.exports = middlewareObj;