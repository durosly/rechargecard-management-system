import mongoose from "mongoose";

const networkSchema = new mongoose.Schema(
	{
		name: String,
		denominations: [Number],
	},
	{
		timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
	}
);

const NetworkModel =
	mongoose.models.Network || mongoose.model("Network", networkSchema);

export default NetworkModel;
