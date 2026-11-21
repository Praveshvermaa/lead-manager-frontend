
import { Trash2 } from "lucide-react";

const statuses = ["New", "Contacted", "Qualified", "Lost"];

const statusStyles = {
    New: "bg-blue-50 text-blue-700",
    Contacted: "bg-yellow-50 text-yellow-700",
    Qualified: "bg-green-50 text-green-700",
    Lost: "bg-red-50 text-red-700",
};

const LeadTable = ({ leads, onStatusChange, onDelete }) => {
    if (leads.length === 0) {
        return (
            <div className="rounded-xl border border-gray-200 bg-white py-12 text-center">
                <p className="font-medium text-gray-700">
                    No leads found
                </p>
                <p className="mt-1 text-sm text-gray-500">
                    Try changing your search or add a new lead.
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
            <table className="w-full min-w-[850px] text-left text-sm">
                <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase text-gray-500">
                    <tr>
                        <th className="px-5 py-4 font-semibold">Name</th>
                        <th className="px-5 py-4 font-semibold">Email</th>
                        <th className="px-5 py-4 font-semibold">Phone</th>
                        <th className="px-5 py-4 font-semibold">Company</th>
                        <th className="px-5 py-4 font-semibold">Source</th>
                        <th className="px-5 py-4 font-semibold">Status</th>
                        <th className="px-5 py-4 text-center font-semibold">Actions</th>
                    </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                    {leads.map((lead) => (
                        <tr key={lead._id} className="hover:bg-gray-50">
                            <td className="px-5 py-4 font-medium text-gray-900">
                                {lead.name}
                            </td>

                            <td className="px-5 py-4 text-gray-600">
                                {lead.email}
                            </td>

                            <td className="px-5 py-4 text-gray-600">
                                {lead.phone}
                            </td>

                            <td className="px-5 py-4 text-gray-600">
                                {lead.company}
                            </td>

                            <td className="px-5 py-4 text-gray-600">
                                {lead.source}
                            </td>

                            <td className="px-5 py-4">
                                <select
                                    value={lead.status}
                                    onChange={(e) =>
                                        onStatusChange(lead._id, e.target.value)
                                    }
                                    className={`rounded-full border-0 px-3 py-1.5 text-xs font-semibold outline-none ${statusStyles[lead.status] || ""
                                        }`}
                                    aria-label={`Change status for ${lead.name}`}
                                >
                                    {statuses.map((status) => (
                                        <option key={status} value={status}>
                                            {status}
                                        </option>
                                    ))}
                                </select>
                            </td>

                            <td className="px-5 py-4 text-center">
                                <button
                                    onClick={() => onDelete(lead)}
                                    title={`Delete ${lead.name}`}
                                    aria-label={`Delete ${lead.name}`}
                                    className="rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600"
                                >
                                    <Trash2 size={17} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default LeadTable;
