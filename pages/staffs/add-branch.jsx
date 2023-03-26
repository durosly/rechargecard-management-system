import { useContext, useState } from "react";
import { withSessionSsr } from "../../lib/withSession";
import AdminWrapper from "../../components/layout/admin/layout/adminWrapper";
import AppContext from "../../store/AppContext";
import NetworkModel from "../../models/network";
import axios from "axios";
import { stringifyDoc } from "../../lib";

function AddBranch({ networks }) {
	const [branch, setBranch] = useState({ name: "", address: "" });
	const [isLoading, setIsLoading] = useState(false);

	const [rates, setRates] = useState({
		bulk: [...networks.map((n) => ({ _id: n._id, count: "" }))],
		wholesale: [...networks.map((n) => ({ _id: n._id, count: "" }))],
	});

	function handleChangeBulk(e, i) {
		const newRates = rates;
		// console.log(newRates);
		newRates.bulk[i].count = e.target.value;
		setRates({ ...newRates });
	}
	function handleChangeWholesale(e, i) {
		const newRates = rates;
		// console.log(newRates);
		newRates.wholesale[i].count = e.target.value;
		setRates({ ...newRates });
	}

	const {
		toast: { showToast },
	} = useContext(AppContext);

	async function addBranch(e) {
		e.preventDefault();
		if (isLoading) return;
		setIsLoading(true);

		try {
			const status = await axios.post("/api/branch/add", {
				branch,
				rates,
			});

			if (status.data.ok) {
				showToast({
					alert_type: "success",
					message: "Branch added successfully",
				});
				setBranch({ name: "", address: "" });
				setIsLoading(false);
				setRates({
					bulk: [...networks.map((n) => ({ _id: n._id, count: "" }))],
					wholesale: [
						...networks.map((n) => ({ _id: n._id, count: "" })),
					],
				});
				// toggler(false);
			} else {
				throw new Error(response.data.message);
			}
		} catch (error) {
			let errorMsg = "";

			if (error?.response) {
				errorMsg = error.response.data.message;
			} else {
				errorMsg = error.message;
			}

			// console.log(error);
			setIsLoading(false);
			showToast({
				alert_type: "danger",
				message: errorMsg,
			});
		}
	}
	return (
		<AdminWrapper>
			<form
				onSubmit={addBranch}
				className="space-y-4"
				action="/add-staff"
			>
				<h2>Branch</h2>
				<div className="form-control w-full max-w-xs">
					<label className="label">Name</label>
					<input
						type="text"
						placeholder="Type here"
						className="input input-bordered w-full max-w-xs"
						value={branch.name}
						onChange={(e) =>
							setBranch({ ...branch, name: e.target.value })
						}
					/>
				</div>
				<div className="form-control w-full max-w-xs">
					<label className="label">Address</label>
					<input
						type="text"
						placeholder="Type here"
						className="input input-bordered w-full max-w-xs"
						value={branch.address}
						onChange={(e) =>
							setBranch({ ...branch, address: e.target.value })
						}
					/>
				</div>
				<div className="divider">Rates</div>
				<div className="flex gap-5 mb-5">
					<div className="space-y-4 flex-1">
						<h2 className="text-2xl">Bulk</h2>
						{networks.map((n, i) => (
							<div
								key={n._id}
								className="form-control"
							>
								<label className="input-group">
									<span className="w-24">{n.name}</span>
									<input
										type="number"
										placeholder="rate..."
										className="input input-bordered"
										value={rates.bulk[i].count}
										onChange={(e) => handleChangeBulk(e, i)}
									/>
								</label>
							</div>
						))}
					</div>
					<div className="space-y-4 flex-1">
						<h2 className="text-2xl">WholeSales</h2>
						{networks.map((n, i) => (
							<div
								key={n._id}
								className="form-control"
							>
								<label className="input-group">
									<span className="w-24">{n.name}</span>
									<input
										type="number"
										placeholder="rate..."
										className="input input-bordered"
										value={rates.wholesale[i].count}
										onChange={(e) =>
											handleChangeWholesale(e, i)
										}
									/>
								</label>
							</div>
						))}
					</div>
				</div>

				<button className="btn btn-primary">Add</button>
			</form>
		</AdminWrapper>
	);
}

export default AddBranch;

export const getServerSideProps = withSessionSsr(
	async function getServerSideProps({ req }) {
		const user = req.session.user;

		if (!user && user.type !== "admin") {
			return {
				redirect: {
					destination: "/",
					permanent: false,
				},
			};
		}

		const networks = await NetworkModel.find({});

		return {
			props: {
				user,
				networks: stringifyDoc(networks),
			},
		};
	}
);
