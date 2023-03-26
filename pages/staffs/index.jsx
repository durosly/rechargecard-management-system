import axios from "axios";
import Link from "next/link";
import { useContext, useState } from "react";
import AdminWrapper from "../../components/layout/admin/layout/adminWrapper";
import { stringifyDoc } from "../../lib";
import { withSessionSsr } from "../../lib/withSession";
import BranchModel from "../../models/branch";
import UserModel from "../../models/user";
import AppContext from "../../store/AppContext";

function Staffs({ staffs, branches }) {
	const [staffsData, setStaffData] = useState(staffs);
	const [showModal, setShowModal] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [newStaffEdit, setNewStaffEdit] = useState({ branch: "", staff: "" });

	function handleEdit({ staffId, branchId }) {
		setNewStaffEdit({ branch: branchId, staff: staffId });
		setShowModal(true);
	}

	const {
		toast: { showToast },
	} = useContext(AppContext);

	async function updateStaffBranch(e) {
		e.preventDefault();
		if (isLoading) return;
		setIsLoading(true);

		try {
			const status = await axios.post(
				"/api/staff/update-branch",
				newStaffEdit
			);
			if (status.data.ok) {
				showToast({
					alert_type: "success",
					message: "Staff Branch updated successfully",
				});

				const branch = status.data.branch;
				const staff = status.data.staff;

				const newStaffData = staffsData.map((s) => {
					if (s._id === staff) {
						s.branch = branch.name;
						s._branchId = branch._id;
					}
					return s;
				});

				setStaffData([...newStaffData]);
				setIsLoading(false);
				setShowModal(false);
				setNewStaffEdit({ branch: "", staff: "" });
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
	async function deleteStaff({ id }) {
		if (isDeleting) return;
		setIsDeleting(true);

		try {
			const status = await axios.delete(`/api/staff/delete?id=${id}`);
			if (status.data.ok) {
				showToast({
					alert_type: "success",
					message: "Staff deleted successfully",
				});

				const newStaffData = staffsData.filter((s) => s._id !== id);

				setStaffData([...newStaffData]);
				setIsDeleting(false);
				setShowModal(false);
				setNewStaffEdit({ branch: "", staff: "" });
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
			setIsDeleting(false);
			showToast({
				alert_type: "danger",
				message: errorMsg,
			});
		}
	}
	return (
		<>
			<AdminWrapper>
				<div className="space-x-4">
					<Link
						className="btn btn-primary"
						href="/staffs/new"
					>
						Add new staff
					</Link>
				</div>
				<div className="overflow-x-auto">
					<table className="table w-full">
						<thead>
							<tr>
								<th></th>
								<th>Fullname</th>
								<th>Branch</th>
								<th></th>
							</tr>
						</thead>
						<tbody>
							{staffsData &&
								staffsData.map((s, i) => (
									<tr key={s._id}>
										<th>{i + 1}</th>
										<td>{s.name}</td>
										<td>{s.branch}</td>
										<td className="flex justify-end gap-2">
											<button
												className="btn btn-secondary"
												onClick={() =>
													handleEdit({
														staffId: s._id,
														branchId: s._branchId,
													})
												}
											>
												Change Branch
											</button>

											<button
												onClick={() =>
													deleteStaff({ id: s._id })
												}
												className="btn btn-error"
											>
												Delete
											</button>
										</td>
									</tr>
								))}
						</tbody>
					</table>
				</div>
			</AdminWrapper>
			{/* The button to open modal */}

			{/* Put this part before </body> tag */}
			<input
				type="checkbox"
				id="my-modal"
				className="modal-toggle"
				checked={showModal}
			/>
			<div className="modal">
				<div className="modal-box">
					<h3 className="font-bold text-lg">
						Assign branch to staff
					</h3>
					<form
						action="/edit-staff"
						className="space-y-3"
						onSubmit={updateStaffBranch}
					>
						<div className="form-control w-full max-w-xs">
							<label className="label">Branches</label>
							<select
								value={newStaffEdit}
								onChange={(e) =>
									setNewStaffEdit({
										...newStaffEdit,
										branch: e.target.value,
									})
								}
								className="select select-bordered"
							>
								<option
									disabled
									value=""
								>
									-- select branch --
								</option>
								{branches &&
									branches.map((b) => (
										<option value={b._id}>{b.name}</option>
									))}
							</select>
						</div>
						<button
							disabled={isLoading}
							className="btn btn-primary"
						>
							Submit
						</button>
					</form>
					<div className="modal-action">
						<button
							className="btn"
							onClick={() => setShowModal(false)}
						>
							Close
						</button>
					</div>
				</div>
			</div>
		</>
	);
}

export default Staffs;

export const getServerSideProps = withSessionSsr(
	async function getServerSideProps({ req }) {
		const user = req.session.user;

		if (!user || user.type !== "admin") {
			return {
				redirect: {
					destination: "/",
					permanent: false,
				},
			};
		}

		const branches = await BranchModel.find({});
		const staffsDB = await UserModel.find({ type: "staff" });

		const staffs = [];

		for (const s of staffsDB) {
			const branch = await BranchModel.findById(s._branchId);

			staffs.push({
				_id: s.id,
				name: `${s.firstname} ${s.lastname}`,
				branch: branch.name,
				_branchId: branch.id,
			});
		}

		return {
			props: {
				user,
				branches: stringifyDoc(branches),
				staffs,
			},
		};
	}
);
