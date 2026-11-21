
import { useEffect, useState } from "react";
import { Plus, Search, Users } from "lucide-react";

import api from "../api/axios";
import Navbar from "../components/Navbar";
import LeadForm from "../components/LeadForm";
import LeadTable from "../components/LeadTable";
import ConfirmDialog from "../components/ConfirmDialog";

const Dashboard = () => {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [creating, setCreating] = useState(false);

    const [selectedLead, setSelectedLead] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const [refreshKey, setRefreshKey] = useState(0);

    // Fetch leads whenever filters change or data needs refreshing.
    useEffect(() => {
        let isActive = true;

        const fetchLeads = async () => {
            try {
                setLoading(true);
                setError("");

                const params = {};

                if (search.trim()) params.search = search.trim();
                if (status) params.status = status;

                const response = await api.get("/leads", { params });

                if (isActive) {
                    setLeads(response.data.data.leads);
                }
            } catch (err) {
                if (isActive) {
                    setError(
                        err.response?.data?.message || "Failed to fetch leads."
                    );
                }
            } finally {
                if (isActive) setLoading(false);
            }
        };

        const delay = search.trim() ? 300 : 0;
        const timer = setTimeout(fetchLeads, delay);

        return () => {
            isActive = false;
            clearTimeout(timer);
        };
    }, [search, status, refreshKey]);

    // Create a new lead.
    const handleCreateLead = async (formData) => {
        setCreating(true);

        try {
            await api.post("/leads", formData);

            setShowForm(false);
            setSearch("");
            setStatus("");
            setRefreshKey((prev) => prev + 1);
        } catch (err) {
            // LeadForm displays this error.
            throw err;
        } finally {
            setCreating(false);
        }
    };

    // Update only the lead's status.
    const handleStatusChange = async (leadId, newStatus) => {
        try {
            setError("");

            await api.put(`/leads/${leadId}`, {
                status: newStatus,
            });

            setRefreshKey((prev) => prev + 1);
        } catch (err) {
            setError(
                err.response?.data?.message || "Failed to update lead status."
            );
        }
    };

    // Delete the selected lead after confirmation.
    const handleDeleteLead = async () => {
        if (!selectedLead) return;

        setDeleting(true);

        try {
            await api.delete(`/leads/${selectedLead._id}`);

            setSelectedLead(null);
            setRefreshKey((prev) => prev + 1);
        } catch (err) {
            setError(
                err.response?.data?.message || "Failed to delete lead."
            );
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                {/* Header + stat row */}
                <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-4">
                        <div className="rounded-lg bg-blue-50 p-2.5 text-blue-600">
                            <Users size={20} />
                        </div>
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                Leads displayed
                            </p>
                            <p className="text-2xl font-bold text-gray-900 leading-tight">
                                {leads.length}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => setShowForm((prev) => !prev)}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
                    >
                        <Plus size={16} />
                        {showForm ? "Close Form" : "Add Lead"}
                    </button>
                </div>

                {/* Create lead form */}
                {showForm && (
                    <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6">
                        <h2 className="mb-5 text-lg font-semibold text-gray-900">
                            Add a new lead
                        </h2>

                        <LeadForm
                            onSubmit={handleCreateLead}
                            onCancel={() => setShowForm(false)}
                            loading={creating}
                        />
                    </div>
                )}

                {/* Search and filter */}
                <div className="mb-4 flex flex-col gap-3 sm:flex-row">
                    <div className="relative flex-1">
                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search leads by name..."
                            className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                    >
                        <option value="">All statuses</option>
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Qualified">Qualified</option>
                        <option value="Lost">Lost</option>
                    </select>
                </div>

                {/* Error message */}
                {error && (
                    <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {/* Leads table */}
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                    {loading ? (
                        <div className="p-10 text-center text-sm text-gray-500">
                            Loading leads...
                        </div>
                    ) : (
                        <LeadTable
                            leads={leads}
                            onStatusChange={handleStatusChange}
                            onDelete={setSelectedLead}
                        />
                    )}
                </div>
            </main>

            {/* Delete confirmation */}
            <ConfirmDialog
                isOpen={Boolean(selectedLead)}
                leadName={selectedLead?.name}
                onConfirm={handleDeleteLead}
                onCancel={() => setSelectedLead(null)}
                loading={deleting}
            />
        </div>
    );
};

export default Dashboard;
