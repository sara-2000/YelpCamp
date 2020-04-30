var express    = require("express"),
	router     = express.Router({mergeParams : true}),
	Campground = require("../models/campground"),
	Comment    = require("../models/comment"),
	middleware = require("../middleware");

//comments new
router.get("/new" , middleware.isLoggedIn , function(req , res){
	Campground.findById(req.params.id , function(err , foundCampground){
		if(err){
			res.redirect("/campgrounds/" + req.params.id );
		}else{
			res.render("comments/new" , {campground : foundCampground});
		}
	});
});

//comments create
router.post("/" , middleware.isLoggedIn , function(req , res){
	Campground.findById(req.params.id , function(err , campground){
		if(err){
			res.redirect("/campgrounds/"+req.params.id+"/comments/new");
		}else{
			Comment.create(req.body.comment , function(err , comment){
				if(err){
					console.log(err);
				}else{
					//add username and id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					// save the comment
					comment.save();
					campground.comments.push(comment);
					campground.save();
					req.flash("success" , "Successfully added comment");
					res.redirect("/campgrounds/"+campground._id);
				}
			});
		}
	});
});
//Edit comment
router.get("/:comment_id/edit" , middleware.checkCommentOwnership , function(req , res){
	Comment.findById(req.params.comment_id , function(err , foundComment){
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		}else{
			res.render("comments/edit" , {campground_id:req.params.id , comment : foundComment});
		}
	});
});
//Update comment
router.put("/:comment_id" , middleware.checkCommentOwnership , function(req , res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment ,function(err , updated){
		if(err){
			res.redirect("back");
		}else{
			req.flash("success" , "Successfully edited comment");
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});
//delete comment
router.delete("/:comment_id" , middleware.checkCommentOwnership ,function(req , res){
	Comment.findByIdAndRemove(req.params.comment_id , function(err , deleted){
		if(err){
			res.redirect("back");
		}else{
			req.flash("success" , "Comment deleted");
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

module.exports = router;