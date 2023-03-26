import axios from "axios";
import { useContext, useState } from "react";
import AppContext from "../../../store/AppContext";
function AddNetworkModal({ state, toggler }) {
	const [data, setData] = useState({ name: "", denomination: "" });
	const [isLoading, setIsLoading] = useState(false);

	const {
		toast: { showToast },
	} = useContext(AppContext);

	async function addNewNetwork(e) {
		e.preventDefault();
		if (isLoading) return;
		setIsLoading(true);

		try {
			const status = await axios.post("/api/network/add", {
				...data,
			});

			if (status.data.ok) {
				showToast({
					alert_type: "success",
					message: "Network added successfully",
				});
				setIsLoading(false);
				toggler(false);
			} else {
				throw new Error("Invalid credentials");
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
		<>
			<input
				type="checkbox"
				id="add-network-modal"
				className="modal-toggle"
				checked={state}
				onChange={() => toggler(!state)}
			/>
			<label
				htmlFor="add-network-modal"
				className="modal cursor-pointer"
			>
				<label
					className="modal-box relative"
					htmlFor=""
				>
					<form
						onSubmit={addNewNetwork}
						action="/add-to-network"
					>
						<h3 className="text-lg font-bold">Add Network</h3>
						<div className="form-control w-full max-w-xs">
							<label className="label">
								<span className="label-text">Network name</span>
							</label>
							<input
								type="text"
								placeholder="Network name..."
								className="input input-bordered w-full max-w-xs"
								value={data.name}
								onChange={(e) =>
									setData({ ...data, name: e.target.value })
								}
							/>
						</div>
						<div className="form-control w-full max-w-xs">
							<label className="label">
								<span className="label-text">
									Network denominations(seperate each with a
									comma)
								</span>
							</label>
							<input
								type="text"
								placeholder="Network denominations..."
								className="input input-bordered w-full max-w-xs"
								value={data.denomination}
								onChange={(e) =>
									setData({
										...data,
										denomination: e.target.value,
									})
								}
							/>
						</div>
						<button
							disabled={isLoading}
							className="btn btn-primary mt-10"
						>
							Submit
						</button>
					</form>
				</label>
			</label>
		</>
	);
}

export default AddNetworkModal;
