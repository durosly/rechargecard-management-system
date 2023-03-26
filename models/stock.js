import mongoose from "mongoose";

const stockSchema = new mongoose.Schema(
	{
		_accountingRecordsId: String,
		_networkdId: String,
		_networkdenomination: Number,
		_userId: String,
		quantity: Number,
	},
	{
		timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
	}
);

const StockModel =
	mongoose.models.Stock || mongoose.model("Stock", stockSchema);

export default StockModel;
