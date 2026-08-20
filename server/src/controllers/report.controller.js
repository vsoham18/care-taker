import { CaretakerProfile } from "../models/caretakerprofiles.models.js";
import { Report } from "../models/report.models.js";
import { Review } from "../models/review.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

const reportCaretakerProfile = asyncHandler(async (req, res) => {
    const { caretakerId } = req.params;
    const { reason, description } = req.body;

    // find caretaker profile
    const caretaker = await CaretakerProfile.findById(caretakerId);

    if (!caretaker) {
        throw new ApiError(
            404,
            "Caretaker profile not found."
        );
    }

    // user cannot report themselves
    if (caretaker.user.equals(req.user._id)) {
        throw new ApiError(
            400,
            "You cannot report your own profile."
        );
    }

  
        const existingReport = await Report.findOne({
            reporter: req.user._id,
            caretakerProfile: caretaker._id,
            status: {
                $in: ["pending", "under-review"],
            },
        });

        if (existingReport) {
            throw new ApiError(
                409,
                "You already have an active report for this profile."
            );
        }

    const report = await Report.create({
        reporter: req.user._id,
        reportedUser: caretaker.user,
        caretakerProfile: caretaker._id,
        reason,
        description,
    });

    return res.status(201).json(
        new ApiResponse(
            201,
            {
                report,
            },
            "Profile reported successfully."
        )
    );
});

const reportReview = asyncHandler(async (req, res) => {
    const { reviewId } = req.params;
    const { reason, description } = req.body;

    // find review
    const review = await Review.findById(reviewId);

    if (!review) {
        throw new ApiError(
            404,
            "Review not found."
        );
    }

    if (review.user.equals(req.user._id)) {
        throw new ApiError(
            400,
            "You cannot report your own review."
        );
    }

    // prevent duplicate report
    const existingReport = await Report.findOne({
        reporter: req.user._id,
        review: review._id,
        status: {
            $in: ["pending", "under-review"],
         },
    });

    if (existingReport) {
        throw new ApiError(
            409,
            "You have already reported this review."
        );
    }

    const report = await Report.create({
        reporter: req.user._id,
        reportedUser: review.user,
        review: review._id,
        reason,
        description,
    });

    return res.status(201).json(
        new ApiResponse(
            201,
            {
                report,
            },
            "Review reported successfully."
        )
    );
});

export { reportCaretakerProfile, reportReview}