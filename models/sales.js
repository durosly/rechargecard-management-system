import mongoose from "mongoose";

const salesSchema = new mongoose.Schema(
	{
		_userId: String,
		custormer: String,
		custormer_type: { type: String, enum: ["bulk", "wholesale"] },
		items: [
			{
				_networkId: String,
				_networkDenomination: Number,
				quantity: Number,
				amount: Number,
			},
		],
		total: Number,

		payment_type: { type: String, enum: ["POS", "Cash", "Bank Transfer"] },
	},
	{
		timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
	}
);

const SalesModel =
	mongoose.models.Sales || mongoose.model("Sales", salesSchema);

export default SalesModel;
