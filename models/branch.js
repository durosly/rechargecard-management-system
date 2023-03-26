import mongoose from "mongoose";

const branchSchema = new mongoose.Schema(
	{
		name: String,
		address: String,
	},
	{
		timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
	}
);

const BranchModel =
	mongoose?.models?.Branch || mongoose.model("Branch", branchSchema);

export default BranchModel;
