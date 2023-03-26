import { withSessionRoute } from "../../../../lib/withSession";
import ExpenseModel from "../../../../models/expense";

export default withSessionRoute(addRoute);

async function addRoute(req, res) {
	try {
		const { user } = req.session;
		const { id } = req.query;

		if (!user) {
			throw new Error("Unathorized");
		}

		await ExpenseModel.findByIdAndDelete(id);

		res.send({ ok: true });
	} catch (error) {
		console.log("Error: ", error.message);
		res.status(400).send({ ok: false, message: error.message });
	}
}
