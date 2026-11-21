
import { AlertTriangle } from "lucide-react";

const ConfirmDialog = ({
    isOpen,
    leadName,
    onConfirm,
    onCancel,
    loading,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="delete-title"
                className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
            >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
                    <AlertTriangle size={23} />
                </div>

                <h2
                    id="delete-title"
                    className="text-lg font-semibold text-gray-900"
                >
                    Delete lead?
                </h2>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                    Are you sure you want to delete{" "}
                    <span className="font-semibold text-gray-900">
                        {leadName}
                    </span>
                    ? This action cannot be undone.
                </p>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        disabled={loading}
                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
                    >
                        {loading ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;
