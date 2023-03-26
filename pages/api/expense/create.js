import { withSessionRoute } from "../../../lib/withSession";
import ExpenseModel from "../../../models/expense";

export default withSessionRoute(addRoute);

async function addRoute(req, res) {
	try {
		const { user } = req.session;
		const { desc, amount } = req.body;

		if (!user) {
			throw new Error("Unathorized");
		}

		if (!desc) throw new Error("Enter description");
		if (!amount) throw new Error("Enter amount");
		if (!Number(amount)) throw new Error("Amount must be a number");

		const expense = await ExpenseModel.create({
			desc,
			amount,
			_userId: user.id,
		});

		res.send({ ok: true, expense });
	} catch (error) {
		res.status(400).send({ ok: false, message: error.message });
	}
}
