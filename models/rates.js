import mongoose from "mongoose";

const rateSchema = new mongoose.Schema(
	{
		_branchId: String,
		_networkId: String,
		type: { type: String, enum: ["bulk", "wholesale"] },
		amount: Number,
	},
	{
		timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
	}
);

const RateModel = mongoose?.models?.Rate || mongoose.model("Rate", rateSchema);

export default RateModel;
