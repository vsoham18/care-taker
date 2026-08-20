import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    reportedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    caretakerProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CaretakerProfile",
      default: null,
    },

    review: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
      default: null,
    },

    reason: {
      type: String,
      required: true,
      enum: [
        "inappropriate-content",
        "misleading-information",
        "fraud",
        "harassment",
        "escort-sexual-services",
        "spam",
        "other",
      ],
    },

    description: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },

    status: {
      type: String,
      enum: [
        "pending",
        "under-review",
        "dismissed",
        "action-taken",
      ],
      default: "pending",
    },
    isActive: {
        type: Boolean,
        default: true,
    }
  },
  {
    timestamps: true,
  }
);

reportSchema.index(
    { reporter: 1, review: 1 },
    {
        unique: true,
        partialFilterExpression: {
            review: { $type: "objectId" },
            isActive: true,
        },
    }
);

reportSchema.index(
    { reporter: 1, caretakerProfile: 1 },
    {
        unique: true,
        partialFilterExpression: {
            caretakerProfile: { $type: "objectId" },
            isActive: true,
        },
    }
);

export const Report = mongoose.model("Report", reportSchema);