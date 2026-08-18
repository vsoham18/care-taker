import { Booking } from "../models/bookings.models.js";
import { User } from "../models/users.models.js";
import { CaretakerProfile } from "../models/caretakerprofiles.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { findAuthorizedBooking } from "../utils/AuthorizeBooking.js";

const requestBooking = asyncHandler(async (req, res) => {  
    const caretakerId = req.params.caretakerId

       const {
        servicePeriod,
        preferredTime,
        message,
    } = req.body;

    const caretakerProfile = await CaretakerProfile.findById(caretakerId);

    if (!caretakerProfile) {
        throw new ApiError(404, "Caretaker not found.");
    }

   
    if (!caretakerProfile.isCurrentlyAvailable) {
        throw new ApiError(
            400,
            "This caretaker is currently unavailable."
     )}

    if( caretakerProfile.user.toString() === req.user._id.toString() ){
    throw new ApiError(
        400,
        "You cannot book your own caretaker profile."
    )}

    const existingBooking = await Booking.findOne({
        user: req.user._id,
        caretakerId,
        status: {
             $in: ["pending", "accepted"],
        },
    });

    if (existingBooking) {
        throw new ApiError(
            409,
            "You already made a request for this caretaker."
        );
    }

    const booking = await Booking.create({
        user: req.user._id,
        caretaker: caretakerId,
        servicePeriod,
        preferredTime,
        message,
    });

    return res.status(201).json(
        new ApiResponse(
            201,
            booking,
            "Booking request sent successfully."
        )
    );

})

const getMyBookings = asyncHandler(async (req, res) => {

   const bookings = await Booking.aggregate([
      { 
        $match:{
        user : req.user._id,
        status : { $ne : "cancelled" }
      }
      },
      {
           $sort:{
           createdAt:-1
         }
      },
      {
       $lookup: {
             from : "caretakerprofiles",
             localField : "caretaker",
             foreignField : "_id",
             as : "careTakerName",
             pipeline : [
             {
               $lookup:{
                 from : "users",
                    localField : "user",
                    foreignField : "_id",
                    as : "userDetails",
                    pipeline : [
                        {
                            $project : {
                                name : 1
                            }
                        }
                    ]
               },
             },
             {
                $unwind : "$userDetails"
             },
             {
              $project: {
               userDetails: 1
               }
             }
          ]
         }
      },
      {
        $unwind : "$careTakerName"
      },
      {
        $project:{
            user : 1,
            caretaker : 1,
            "careTakerName.userDetails":1,
            status : 1,
            hasBeenRated: 1,
            servicePeriod : 1,
            preferredSlot : 1,
            acceptedAt : 1,
            completedAt : 1
        }
      }
   ])

   return res.status(200).json(
    new ApiResponse(
        200,
        bookings,
        "Bookings retrieved successfully."
    )
   )
})

const getRequestedBookings = asyncHandler(async (req, res) => {
   const caretaker = await CaretakerProfile.findOne({
    user : req.user._id
   })

   if(!caretaker){
    throw new ApiError(404, "Caretaker profile not found.");
   } 

    const requestedBookings = await Booking.aggregate([
        {
           $match: {
            caretaker : caretaker._id,
              } 
        },
        {
          $sort: {
           createdAt: -1
          }
        },
        {
           $lookup: {
            from : "users",
            localField : "user",
            foreignField : "_id",
            as: "requestedBy",
            pipeline : [
                {
                    $project : {
                        name : 1,
                        email : 1,
                        phone : 1
                    }
                }
            ]
          }
        } ,
        {
           $unwind : "$requestedBy"
        },
        {
            $project : {
                user : 1,
                requestedBy : 1,
                status : 1,
                servicePeriod : 1,
                preferredSlot : 1,
                message : 1,
                acceptedAt : 1,
                completedAt : 1,
            }
        }
    ])

    return res.status(200).json(
    new ApiResponse(
        200,
        requestedBookings,
        "Requested Bookings retrieved successfully."
    )
   )
})

const acceptBooking = asyncHandler(async (req, res) => {
    const booking = await findAuthorizedBooking(
      req.params.bookingId,
      req.user._id
    )
   
   if (booking.status !== "pending") {
     throw new ApiError(400, "Only pending bookings can be accepted.");
    }

    booking.status = "accepted";
    booking.acceptedAt = new Date();

    await booking.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            booking,
            "Booking accepted successfully."
        )
    );
});

const rejectBooking = asyncHandler(async (req, res) => {        
     const booking = await findAuthorizedBooking(
      req.params.bookingId,
      req.user._id
    )
   
     if (booking.status !== "pending") {
     throw new ApiError(400, "Only pending bookings can be rejected.");
    }

    booking.status = "rejected";
    await booking.save();

     return res.status(200).json(
        new ApiResponse(
            200,
            booking,
            "Booking rejected successfully."
        )
    );
})

const cancelBooking = asyncHandler(async (req, res) => {   

   const booking = await Booking.findOne({
        _id: req.params.bookingId,
    });
    if(booking.user.toString()!==req.user._id.toString()){
         throw new ApiError(404, "Can't cancel without booking");
    }
   
    if (!booking) {
        throw new ApiError(404, "Booking not found.");
    }

    if (!["pending", "accepted"].includes(booking.status)) {
        throw new ApiError(
            400,
            "This booking cannot be cancelled."
        );
    }

    booking.status = "cancelled";

    await booking.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            booking,
            "Booking cancelled successfully."
        )
    )
})

const completeBooking = asyncHandler ( async (req,res) => {
    
     const booking = await findAuthorizedBooking(
      req.params.bookingId,
      req.user._id
    )

    if (!booking) {
        throw new ApiError(404, "Booking not found.");
    }

    if (booking.status !== "accepted") {
        throw new ApiError(
            400,
            "Only accepted bookings can be completed."
        );
    }

    booking.status = "completed"
    booking.completedAt = Date.now()
    booking.isRatable = true


    await booking.save()

    return res.status(200).json(
        new ApiResponse(200, booking,
             "Booking completed succesfully")
    )
})

export { requestBooking, acceptBooking, rejectBooking, getMyBookings, getRequestedBookings, cancelBooking, completeBooking }