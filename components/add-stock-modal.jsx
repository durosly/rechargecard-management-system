import axios from "axios";
import { useContext, useState } from "react";
import AppContext from "../store/AppContext";

function AddStockModal({ networks, state, toggler, data, setData }) {
	const {
		toast: { showToast },
	} = useContext(AppContext);
	const [entries, setEntries] = useState([
		{ network: "", denomination: "", quantity: "" },
	]);
	const [isLoading, setIsLoading] = useState(false);

	function handleSelection({ value, i }) {
		const split = value.split("--");
		const entry = entries[i];
		entry.network = split[0];
		entry.denomination = split[1];

		const newEntries = entries.map((e, j) => {
			if (i === j) {
				return entry;
			}

			return e;
		});

		setEntries(newEntries);
	}

	function addNewField() {
		setEntries([
			...entries,
			{ network: "", denomination: "", quantity: "" },
		]);
	}

	function removeField(i) {
		const newEntries = entries.filter((e, j) => i !== j);
		setEntries(newEntries);
	}

	function handleQuantityUpdate({ value, i }) {
		const newEntries = entries.map((e, j) => {
			if (i === j) {
				e.quantity = value;
			}

			return e;
		});

		setEntries(newEntries);
	}

	async function handleSubmit(e) {
		e.preventDefault();
		try {
			const status = await axios.post("/api/stocks/add", {
				entries,
			});

			if (status.data.ok) {
				showToast({
					alert_type: "success",
					message: "Stocks added successfully",
				});

				// updateList(response.data.records)
				toggler(false);
				setIsLoading(false);
			} else {
				throw new Error(state.data.message);
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
			{/* Put this part before </body> tag */}
			<input
				type="checkbox"
				id="add-stock-modal"
				className="modal-toggle"
				value={state}
				onChange={() => toggler(!state)}
			/>
			<label
				htmlFor="add-stock-modal"
				className="modal cursor-pointer"
			>
				<label
					className="modal-box relative"
					htmlFor=""
				>
					<form
						className="space-y-4"
						action="/add-to-stock"
						onSubmit={handleSubmit}
					>
						<h3 className="text-lg font-bold">Add to stock</h3>

						{entries.map((entry, i) => (
							<div
								key={i}
								className="form-control"
							>
								<label className="input-group">
									<span>
										<select
											className="select select-ghost w-full max-w-xs"
											value={`${entry.network}--${entry.denomination}`}
											onChange={(e) =>
												handleSelection({
													value: e.target.value,
													i,
												})
											}
											required
										>
											<option
												value="--"
												disabled
											>
												--select network--
											</option>
											{networks.map((n) =>
												n.denominations.map((d) => (
													<option
														value={`${n._id}--${d}`}
													>
														{n.name} {d}
													</option>
												))
											)}
										</select>
									</span>
									<input
										type="number"
										placeholder="Quantity"
										className="input input-bordered"
										value={entry.quantity}
										step="0.1"
										required
										onChange={(e) =>
											handleQuantityUpdate({
												value: e.target.value,
												i,
											})
										}
									/>
									<span>
										<button
											type="button"
											onClick={(e) => {
												e.preventDefault();
												removeField(i);
											}}
											className="btn btn-sm btn-ghost"
										>
											<svg
												className="w-4 h-4 fill-current"
												xmlns="http://www.w3.org/2000/svg"
												viewBox="0 0 320 512"
											>
												{/*! Font Awesome Pro 6.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. */}
												<path d="M310.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L160 210.7 54.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L114.7 256 9.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 301.3 265.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L205.3 256 310.6 150.6z" />
											</svg>
										</button>
									</span>
								</label>
							</div>
						))}

						<button
							type="button"
							className="btn btn-sm btn-accent"
							onClick={addNewField}
							disabled={isLoading}
						>
							<svg
								className="w-5 h-5 fill-current"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 448 512"
							>
								{/*! Font Awesome Pro 6.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. */}
								<path d="M240 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H176V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H384c17.7 0 32-14.3 32-32s-14.3-32-32-32H240V80z" />
							</svg>
						</button>
						<button className="btn btn-primary mt-10 block">
							Submit
						</button>
					</form>
				</label>
			</label>
		</>
	);
}

export default AddStockModal;
