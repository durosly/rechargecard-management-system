import { useState } from "react";
import { DateTime } from "luxon";

function EmployeeStats() {
	const [date, setDate] = useState(DateTime.now().toFormat("kkkk-MM-dd"));
	return (
		<>
			<input
				type="date"
				placeholder="Type here"
				className="input input-bordered w-full max-w-xs"
				value={date}
				onChange={(e) => setDate(e.target.value)}
			/>
			<div className="overflow-x-auto">
				<table className="table table-zebra w-full">
					<thead>
						<tr>
							<th></th>
							<th>Branch</th>
							<th>Staff</th>
							<th>Sales</th>
							<th>Expenses</th>
							<th>Income</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<th>1</th>
							<td>Effurun</td>
							<td>Mr Paker</td>
							<td>2,000,000</td>
							<td>5,000</td>
							<td>5,000</td>
						</tr>
						<tr>
							<th>2</th>
							<td>Expan</td>
							<td>Jane</td>
							<td>1,500,000</td>
							<td>6,500</td>
							<td>6,500</td>
						</tr>
						<tr>
							<th>3</th>
							<td>Airport Road</td>
							<td>Mike</td>
							<td>800,000</td>
							<td>2,000</td>
							<td>2,000</td>
						</tr>
					</tbody>
				</table>
			</div>
		</>
	);
}

export default EmployeeStats;
