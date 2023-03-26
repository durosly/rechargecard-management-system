import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { DateTime } from "luxon";
import AdminWrapper from "../../components/layout/admin/layout/adminWrapper";
import { withSessionSsr } from "../../lib/withSession";
import ExpenseRow from "../../components/expense/expense-row";

function Expenses() {
	const [showModal, setShowModal] = useState(false);
	const [entry, setEntry] = useState({ desc: "", amount: "" });
	const [isLoading, setIsLoading] = useState(false);
	const [expenses, setExpenses] = useState([]);
	const [date, setDate] = useState(DateTime.now().toFormat("kkkk-MM-dd"));

	async function addExpense(e) {
		e.preventDefault();

		if (isLoading) return;
		setIsLoading(true);

		const toastId = toast.loading("adding expense");

		try {
			const response = await axios.post("/api/expense/create", entry);

			const { ok, expense } = response.data;

			if (ok) {
				toast.success("Expense added", {
					id: toastId,
				});
				setEntry({ desc: "", amount: "" });
				setExpenses([...expenses, expense]);
			} else {
				throw new Error("Somethin went wrong");
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

	useEffect(() => {
		async function loadExpense() {
			try {
				const response = await axios(`/api/expense/get/${date}`);

				const { ok, expenses: data } = response.data;

				if (ok) {
					setExpenses(data);
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

				toast.error(errMsg);
			}
		}

		loadExpense();
	}, [date]);

	return (
		<>
			<AdminWrapper>
				<div>
					<label
						htmlFor="my-modal-3"
						className="btn btn-primary"
					>
						Add new Expense
					</label>
				</div>
				<div className="form-control w-full max-w-xs">
					<label className="label">Date</label>

					<input
						type="date"
						placeholder="Type here"
						className="input input-bordered w-full max-w-xs"
						value={date}
						onChange={(e) => setDate(e.target.value)}
					/>
				</div>
				<div className="overflow-x-auto">
					<table className="table w-full">
						<thead>
							<tr>
								<th></th>
								<th>Description</th>
								<th>Amount</th>
								<th>By who</th>
								<th>Date time</th>
								<th></th>
							</tr>
						</thead>
						<tbody>
							{expenses && expenses.length > 0 ? (
								expenses.map((e, i) => (
									<ExpenseRow
										key={e._id}
										exp={expenses}
										setExpenses={setExpenses}
										e={e}
										i={i}
									/>
								))
							) : (
								<tr>
									<td>No expense found</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</AdminWrapper>
			{/* modal */}
			{/* The button to open modal */}

			{/* Put this part before </body> tag */}
			<input
				type="checkbox"
				id="my-modal-3"
				className="modal-toggle"
				checked={showModal}
				onChange={() => setShowModal((curr) => !curr)}
			/>
			<div className="modal">
				<div className="modal-box relative">
					<label
						htmlFor="my-modal-3"
						className="btn btn-sm btn-circle absolute right-2 top-2"
					>
						✕
					</label>
					<h3 className="text-lg font-bold">Expense</h3>
					<form
						onSubmit={addExpense}
						className="flex flex-col py-4 gap-y-4"
					>
						<input
							className="input input-bordered"
							type="text"
							name="desc"
							id="desc"
							placeholder="Description..."
							value={entry.desc}
							onChange={(e) =>
								setEntry({
									...entry,
									[e.target.name]: e.target.value,
								})
							}
						/>
						<input
							className="input input-bordered"
							type="number"
							name="amount"
							id="amount"
							placeholder="Amount..."
							value={entry.amount}
							onChange={(e) =>
								setEntry({
									...entry,
									[e.target.name]: e.target.value,
								})
							}
						/>
						<button
							className={`btn ${
								isLoading
									? "loading cursor-not-allowed"
									: "btn-primary "
							} btn-block`}
						>
							Add
						</button>
					</form>
				</div>
			</div>
		</>
	);
}

export default Expenses;

export const getServerSideProps = withSessionSsr(
	async function getServerSideProps({ req }) {
		const user = req.session.user;

		if (!user) {
			return {
				redirect: {
					destination: "/",
					permanent: false,
				},
			};
		}

		return {
			props: {
				user,
			},
		};
	}
);
