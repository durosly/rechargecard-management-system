import { getDatesInMonth } from "dates-in-month";
import { withSessionRoute } from "../../../../lib/withSession";
import SalesModel from "../../../../models/sales";
import ExpenseModel from "../../../../models/expense";

export default withSessionRoute(addRoute);

async function addRoute(req, res) {
	try {
		const { user } = req.session;
		const { date } = req.query;

		if (!user) {
			throw new Error("Unathorized");
		}

		let data = {
			totalSales: 0,
			totalExpense: 0,
			totalIncome: 0,
		};

		const dateArr = date.split("-");

		const days = getDatesInMonth({
			month: Number(dateArr[1]),
			year: Number(dateArr[0]),
			format: -1,
		});

		const firstDate = days[0];
		const lastDate = days[days.length - 1];

		const query = {
			created_at: { $gte: firstDate, $lte: lastDate },
		};

		if (user.type !== "admin") {
			query._userId = user.id;
		}

		const sales = await SalesModel.find(query);
		const expenses = await ExpenseModel.find(query);

		for (const s of sales) {
			data.totalSales += Number(s.total);
		}

		for (const e of expenses) {
			data.totalExpense += Number(e.amount);
		}

		data.totalIncome = data.totalSales - data.totalExpense;

		res.send({ ok: true, stat: data });
	} catch (error) {
		console.log("Error: ", error.message);
		res.status(400).send({ ok: false, message: error.message });
	}
}
