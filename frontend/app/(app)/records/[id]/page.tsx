"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/api";
import { FinancialRecord } from "@/types";
import RecordForm from "@/components/ui/RecordForm";
import { Loader2 } from "lucide-react";

export default function EditRecordPage() {
  const { id } = useParams<{ id: string }>();
  const [record, setRecord] = useState<FinancialRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch all records then find this one — avoids needing a GET /records/:id endpoint
    api
      .get(`/records`, { params: { limit: 1000 } })
      .then((res) => {
        const found = res.data.records.find((r: FinancialRecord) => r._id === id);
        if (found) setRecord(found);
        else setError("Record not found");
      })
      .catch(() => setError("Failed to load record"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="w-5 h-5 animate-spin" style={{ color: "var(--accent)" }} />
      </div>
    );
  }

  if (error || !record) {
    return (
      <p className="text-sm" style={{ color: "var(--text-muted)" }}>
        {error || "Record not found"}
      </p>
    );
  }

  return (
    <div className="animate-fade-in max-w-2xl">
      <div className="mb-6">
        <h2 className="page-title">Edit Record</h2>
        <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
          Update the details for this transaction
        </p>
      </div>
      <div className="card">
        <RecordForm initialData={record} recordId={id} />
      </div>
    </div>
  );
}
