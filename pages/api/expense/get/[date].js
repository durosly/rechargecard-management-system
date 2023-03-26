import { DateTime } from "luxon";
import { withSessionRoute } from "../../../../lib/withSession";
import ExpenseModel from "../../../../models/expense";
import UserModel from "../../../../models/user";

export default withSessionRoute(addRoute);

async function addRoute(req, res) {
	try {
		const { user } = req.session;
		const { date } = req.query;

		if (!user) {
			throw new Error("Unathorized");
		}

		const dt = new Date(date).toISOString();
		const dateHandler = DateTime.fromISO(dt);
		const start = dateHandler.startOf("day");
		const end = dateHandler.endOf("day");

		const query = {
			created_at: { $gte: start, $lte: end },
		};

		if (user.type !== "admin") {
			query._userId = user.id;
		}

		const expensesDB = await ExpenseModel.find(query);

		const expenses = [];

		for (const e of expensesDB) {
			const eUser = await UserModel.findById(e._userId);

			expenses.push({
				_id: e.id,
				desc: e.desc,
				amount: e.amount,
				created_at: e.created_at,
				user:
					user.type === "admin"
						? `${eUser.firstname} ${eUser.lastname}`
						: "You",
			});
		}

		res.send({ ok: true, expenses });
	} catch (error) {
		console.log("Error: ", error.message);
		res.status(400).send({ ok: false, message: error.message });
	}
}
