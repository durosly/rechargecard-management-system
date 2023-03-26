import { useState } from "react";
import { DateTime } from "luxon";
import { toast } from "react-hot-toast";
import axios from "axios";

function ExpenseRow({ e, i, exp, setExpenses }) {
	const [isLoading, setIsLoading] = useState(false);
	async function deleteExpense({ id }) {
		if (isLoading) return;
		setIsLoading(true);

		const toastId = toast.loading("removing expense");

		try {
			const response = await axios.delete(`/api/expense/delete/${id}`);

			const { ok } = response.data;

			if (ok) {
				toast.success("Expense removed", {
					id: toastId,
				});

				const filterExpense = exp.filter((j) => j._id !== e._id);

				setExpenses(filterExpense);
			} else {
				throw new Error("Something went wrong");
			}
		} catch (error) {
			let errMsg = "";
			if (error?.response) {
				errMsg = error.response.data.message;
			} else {
				errMsg = error.message;
			}

			toast.error(errMsg, {
				id: toastId,
			});
		} finally {
			setIsLoading(false);
		}
	}
	return (
		<tr key={e._id}>
			<th>{i + 1}</th>
			<td>{e.desc}</td>
			<td>{e.amount}</td>
			<td>{e.user}</td>
			<td>{DateTime.fromISO(e.created_at).toFormat("dd/MM/kkkk")}</td>
			<td>
				<button
					onClick={() => deleteExpense({ id: e._id })}
					className={`btn ${isLoading ? "loading" : "btn-error"} `}
				>
					Delete
				</button>
			</td>
		</tr>
	);
}

export default ExpenseRow;
