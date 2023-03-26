import mongoose from "mongoose";

// Define the schema for the accounting record
const accountingRecordSchema = new mongoose.Schema(
	{
		_networkId: String,
		// date: {
		// 	type: Date,
		// 	default: Date.now,
		// },
		_networkDenomination: Number,
		_userId: String,
		openingStock: {
			type: Number,

			min: 0,
			default: 0,
		},
		addedStock: {
			type: Number,
			required: true,
			min: 0,
		},
		soldStock: {
			type: Number,
			min: 0,
			default: 0,
		},
		closingStock: {
			type: Number,

			min: 0,
			default: 0,
		},
		is_closed: { type: Boolean, default: false },
	},
	{
		timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
	}
);

// Define a function to calculate the closing stock based on the opening stock, added stock, and sold stock
// accountingRecordSchema.pre("save", function (next) {
// 	if (!this.isNew) {
// 		this.closingStock =
// 			this.openingStock + this.addedStock - this.soldStock;
// 	}
// 	next();
// });

// Define the Mongoose model for the accounting record
const AccountingRecordModel =
	mongoose?.models?.AccountingRecord ||
	mongoose.model("AccountingRecord", accountingRecordSchema);

export default AccountingRecordModel;
