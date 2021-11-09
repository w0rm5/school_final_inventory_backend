import mongoose from "mongoose";

const AutoNumberSchema = mongoose.Schema(
  {
    prefix: {
      type: String,
      required: true,
    },
    seq: {
      type: Number,
      default: 0,
    },
  },
  {
    versionKey: false,
  }
);

export default mongoose.model("auto_number", AutoNumberSchema);
