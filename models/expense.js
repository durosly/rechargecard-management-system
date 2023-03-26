import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
	{
		_userId: String,
		amount: Number,
		desc: String,
	},
	{
		timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
	}
);

const ExpenseModel =
	mongoose.models.Expense || mongoose.model("Expense", expenseSchema);

export default ExpenseModel;
