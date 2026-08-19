import mongoose from "mongoose";
import { Booking } from "../models/bookings.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Review } from "../models/review.models.js";
import { CaretakerProfile } from "../models/caretakerprofiles.models.js";

const updateCaretaker = async(caretakerId) =>{
      //  check for careTaker existing ---->
    const caretaker = await CaretakerProfile.findById(caretakerId )

    if (!caretaker) {
    throw new ApiError(404, "Caretaker profile not found.");
   }
     
    //  RatingStats counts ---> 
   const ratingStats = await Review.aggregate([
        {
          $match : {
            caretaker : caretaker._id 
          }
        },
        {
          $group: {
            _id: null,
            ratingCount: { $sum: 1 },
            ratingAvg: { $avg: "$rating" },
           },
        },
   ])
    
    const stats = ratingStats[0] || {
    ratingCount: 0,
    ratingAvg: 0,
   }
     
  //   update careTakerProfile ---> 
    await CaretakerProfile.findByIdAndUpdate(
        caretakerId,
        {
        $set: {
            ratingCount: stats.ratingCount,
            ratingAvg: Number(stats.ratingAvg.toFixed(1)),
             },
        }
    );
}

const createReview = asyncHandler( async (req,res) =>{
     const bookingId = req.params.bookingId;

    const { rating, comment } = req.body;

    const booking = await Booking.findOne({
        _id: bookingId,
        user: req.user._id,
    });

    if (!booking) {
        throw new ApiError(404, "Booking not found.");
    }
     
     if (!booking.isRatable) {
        throw new ApiError(
            400,
            "This booking cannot be reviewed."
        );
    }
    
    if (booking.hasBeenRated){
         throw new ApiError(
            400,
            "You have already reviewed this booking."
        );
    }
     
    //  create review ----->
    const review = await Review.create({
        booking : bookingId ,
        user : req.user._id ,
        caretaker : booking.caretaker ,
        rating ,
        comment
    })
     
    booking.hasBeenRated = true;
     await booking.save();
    
   await updateCaretaker(booking.caretaker)

    return res.status(201).json(
        new ApiResponse(
            201,
            review,
            "Review submit successfully."
        )
    );

})

const getReview =  asyncHandler( async (req,res) =>{
     const review = await Review.aggregate([
         {
            $match: {
                caretaker: new mongoose.Types.ObjectId(
                    req.params.caretakerId
                )
            }
        },
        {
          $sort: {
          createdAt: -1
           }
        },
        {
            $lookup : {
                from : "users",
                localField : "user",
                foreignField : "_id",
                as : "reviewer",
                pipeline : [ 
                  {  
                    $project : {
                      name : 1 ,
                    }
                  }
                ]
            }
        },
        {
            $unwind : "$reviewer"
        },
        {
            $project: {
                   "reviewer.name": 1,
                    user : 1,
                    booking : 1,
                    comment: 1,
                    rating: 1,
                    createdAt: 1,
                    updatedAt:1
             }
         }
     ])
    
      return res.status(200).json(
        new ApiResponse(
            201,
            review,
            "Review fetched successfully."
        )
    );

})

const updateReview = asyncHandler( async(req, res) =>{
     const reviewId = req.params.reviewId 

     const { rating, comment } = req.body 
        
     const review = await Review.findById(reviewId)

    if (!review) {
        throw new ApiError(404, "Review not found.");
    }
    
    if (!review.user.equals(req.user._id)) {
        throw new ApiError(
            403,
            "You can't delete another user's review."
        );
    }

    const age = Date.now() - review.createdAt.getTime();

    const FIFTEEN_MINUTES = 15 * 60 * 1000;

    if (age > FIFTEEN_MINUTES) {
    throw new ApiError(
        403,
        "Reviews can only be edited within 15 minutes."
    );
    }
    
    const updatedReview = await Review.findByIdAndUpdate(
        reviewId,
        {
            $set:{
                rating ,
                comment  
            },
        },
        {
           returnDocument: "after",
            runValidators: true,
        }
     )
   
     await updateCaretaker(review.caretaker)
     
     return res.status(200).json(
         new ApiResponse (
             200, 
            {
                 review:updatedReview
            } ,
             "Review updated successfully."
        ))
})

const deleteReview = asyncHandler(async (req, res) => {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);

    if (!review) {
        throw new ApiError(404, "Review not found.");
    }

    if (!review.user.equals(req.user._id)) {
        throw new ApiError(
            403,
            "You can't delete another user's review."
        );
    }

    const caretakerId = review.caretaker;

    await Review.findByIdAndDelete(reviewId);

    await updateCaretaker(caretakerId);

    return res.status(200).json(
        new ApiResponse(
            200,
            null,
            "Review deleted successfully."
        )
    );
});

export { createReview , getReview, updateReview, deleteReview }
