import RecordForm from "@/components/ui/RecordForm";

export default function NewRecordPage() {
  return (
    <div className="animate-fade-in max-w-2xl">
      <div className="mb-6">
        <h2 className="page-title">New Record</h2>
        <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
          Add a new income or expense entry
        </p>
      </div>
      <div className="card">
        <RecordForm />
      </div>
    </div>
  );
}
