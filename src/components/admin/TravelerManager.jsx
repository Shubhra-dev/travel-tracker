import { useState } from "react";

import { Pencil, Trash2 } from "lucide-react";

import { useTripData } from "../../context/TripDataContext";
import { supabase } from "../../lib/supabase";

const initialForm = {
  name: "",
  note: "",
};

export default function TravelerManager() {
  const { travellers, refresh } = useTripData();

  const [form, setForm] = useState(initialForm);

  const [editingId, setEditingId] = useState(null);

  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");

  function updateField(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function resetForm() {
    setForm(initialForm);
    setEditingId(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.name.trim()) {
      setMessage("Traveller name is required.");
      return;
    }

    setSaving(true);
    setMessage("");

    const payload = {
      name: form.name.trim(),
      note: form.note.trim() || null,
    };

    let response;

    if (editingId) {
      response = await supabase
        .from("travellers")
        .update(payload)
        .eq("id", editingId);
    } else {
      response = await supabase.from("travellers").insert(payload);
    }

    if (response.error) {
      setMessage(response.error.message);
      setSaving(false);
      return;
    }

    await refresh();

    resetForm();

    setMessage(editingId ? "Traveller updated." : "Traveller added.");

    setSaving(false);
  }

  function startEdit(traveller) {
    setEditingId(traveller.id);

    setForm({
      name: traveller.name || "",
      note: traveller.note || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function deleteTraveller(traveller) {
    const confirmed = window.confirm(`Delete ${traveller.name}?`);

    if (!confirmed) return;

    const { error } = await supabase
      .from("travellers")
      .delete()
      .eq("id", traveller.id);

    if (error) {
      setMessage(
        "This traveller may already have deposits. Delete their deposit entries first, then remove the traveller.",
      );

      return;
    }

    if (editingId === traveller.id) {
      resetForm();
    }

    await refresh();

    setMessage("Traveller deleted.");
  }

  return (
    <div className="space-y-5">
      <form onSubmit={handleSubmit} className="panel">
        <h3 className="text-lg font-bold text-slate-900">
          {editingId ? "Edit Traveller" : "Add Traveller"}
        </h3>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="form-label">Traveller Name *</label>

            <input
              className="form-control"
              name="name"
              value={form.name}
              onChange={updateField}
              placeholder="e.g. Shubhradev"
            />
          </div>

          <div>
            <label className="form-label">Note</label>

            <input
              className="form-control"
              name="note"
              value={form.note}
              onChange={updateField}
              placeholder="Optional"
            />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button type="submit" disabled={saving} className="btn-primary">
            {saving
              ? "Saving..."
              : editingId
                ? "Update Traveller"
                : "Add Traveller"}
          </button>

          {editingId && (
            <button type="button" onClick={resetForm} className="btn-secondary">
              Cancel
            </button>
          )}
        </div>

        {message && <p className="mt-3 text-sm text-slate-600">{message}</p>}
      </form>

      <div className="panel">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900">Traveller List</h3>

          <span className="text-xs text-slate-500">
            {travellers.length} total
          </span>
        </div>

        <div className="mt-4 divide-y divide-slate-100">
          {travellers.length === 0 ? (
            <p className="py-6 text-center text-sm text-slate-500">
              No travellers added.
            </p>
          ) : (
            travellers.map((traveller) => (
              <div
                key={traveller.id}
                className="flex items-center justify-between gap-3 py-3"
              >
                <div>
                  <p className="font-medium text-slate-900">{traveller.name}</p>

                  {traveller.note && (
                    <p className="mt-0.5 text-xs text-slate-500">
                      {traveller.note}
                    </p>
                  )}
                </div>

                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => startEdit(traveller)}
                    className="icon-btn"
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteTraveller(traveller)}
                    className="icon-btn-danger"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
