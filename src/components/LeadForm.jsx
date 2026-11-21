
import { useState } from "react";

const initialForm = {
    name: "",
    email: "",
    phone: "",
    company: "",
    source: "Website",
};

const LeadForm = ({ onSubmit, onCancel, loading }) => {
    const [form, setForm] = useState(initialForm);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const hasEmptyField = Object.values(form).some(
            (value) => !value.trim()
        );

        if (hasEmptyField) {
            setError("Please fill in all fields.");
            return;
        }

        try {
            await onSubmit(form);
            setForm(initialForm);
        } catch (err) {
            setError(
                err.response?.data?.message || "Unable to create lead."
            );
        }
    };

    const inputClass =
        "w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                    {error}
                </p>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                        Name
                    </label>
                    <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Lead name"
                        maxLength={100}
                        required
                        className={inputClass}
                    />
                </div>

                <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="name@example.com"
                        maxLength={254}
                        required
                        className={inputClass}
                    />
                </div>

                <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                        Phone
                    </label>
                    <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="+91 9876543210"
                        maxLength={20}
                        required
                        className={inputClass}
                    />
                </div>

                <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                        Company
                    </label>
                    <input
                        name="company"
                        value={form.company}
                        onChange={handleChange}
                        placeholder="Company name"
                        maxLength={100}
                        required
                        className={inputClass}
                    />
                </div>

                <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                        Lead Source
                    </label>
                    <select
                        name="source"
                        value={form.source}
                        onChange={handleChange}
                        className={inputClass}
                    >
                        <option value="Website">Website</option>
                        <option value="Referral">Referral</option>
                        <option value="LinkedIn">LinkedIn</option>
                        <option value="Cold Call">Cold Call</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={loading}
                    className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    disabled={loading}
                    className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                >
                    {loading ? "Adding..." : "Add Lead"}
                </button>
            </div>
        </form>
    );
};

export default LeadForm;
