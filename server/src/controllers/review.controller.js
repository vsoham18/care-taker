import mongoose from "mongoose";
import { Booking } from "../models/bookings.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Review } from "../models/review.models.js";
import { CaretakerProfile } from "../models/careTakerProfiles.models.js";

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
    
    const review = await Review.create({
        booking : bookingId ,
        user : req.user._id ,
        caretaker : booking.caretaker ,
        rating ,
        comment
    })
     
    booking.hasBeenRated = true;
   
    await booking.save();

    const caretaker = await CaretakerProfile.findById(
        booking.caretaker
    );

    caretaker.ratingCount += 1;

    caretaker.ratingAvg = Number(
           (
                (
                caretaker.ratingAvg * (caretaker.ratingCount - 1) +
                rating
                ) / caretaker.ratingCount

          ).toFixed(1)
        );

    await caretaker.save();


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
                    comment: 1,
                    rating: 1,
                    createdAt: 1
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

export { createReview , getReview }
