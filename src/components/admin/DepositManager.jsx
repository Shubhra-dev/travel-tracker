import { useState } from "react";

import { Pencil, Trash2 } from "lucide-react";

import { useTripData } from "../../context/TripDataContext";

import { supabase } from "../../lib/supabase";

import { formatDate, formatMoney, todayISO } from "../../lib/format";

function createInitialForm() {
  return {
    traveller_id: "",
    amount: "",
    deposit_date: todayISO(),
    note: "",
  };
}

export default function DepositManager() {
  const { travellers, deposits, refresh } = useTripData();

  const [form, setForm] = useState(createInitialForm());

  const [editingId, setEditingId] = useState(null);

  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");

  const travellerNames = new Map(
    travellers.map((traveller) => [traveller.id, traveller.name]),
  );

  function updateField(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function resetForm() {
    setForm(createInitialForm());
    setEditingId(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (
      !form.traveller_id ||
      !form.amount ||
      Number(form.amount) <= 0 ||
      !form.deposit_date
    ) {
      setMessage("Traveller, date and valid amount are required.");

      return;
    }

    setSaving(true);
    setMessage("");

    const payload = {
      traveller_id: form.traveller_id,
      amount: Number(form.amount),
      deposit_date: form.deposit_date,
      note: form.note.trim() || null,
    };

    let response;

    if (editingId) {
      response = await supabase
        .from("deposits")
        .update(payload)
        .eq("id", editingId);
    } else {
      response = await supabase.from("deposits").insert(payload);
    }

    if (response.error) {
      setMessage(response.error.message);
      setSaving(false);
      return;
    }

    await refresh();

    resetForm();

    setMessage(editingId ? "Deposit updated." : "Deposit added.");

    setSaving(false);
  }

  function startEdit(deposit) {
    setEditingId(deposit.id);

    setForm({
      traveller_id: deposit.traveller_id,
      amount: String(deposit.amount),
      deposit_date: deposit.deposit_date,
      note: deposit.note || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function deleteDeposit(deposit) {
    const confirmed = window.confirm("Delete this deposit?");

    if (!confirmed) return;

    const { error } = await supabase
      .from("deposits")
      .delete()
      .eq("id", deposit.id);

    if (error) {
      setMessage(error.message);
      return;
    }

    if (editingId === deposit.id) {
      resetForm();
    }

    await refresh();

    setMessage("Deposit deleted.");
  }

  return (
    <div className="space-y-5">
      <form onSubmit={handleSubmit} className="panel">
        <h3 className="text-lg font-bold text-slate-900">
          {editingId ? "Edit Deposit" : "Add Deposit"}
        </h3>

        {travellers.length === 0 && (
          <div className="mt-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">
            Add at least one traveller before recording deposits.
          </div>
        )}

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label className="form-label">Traveller *</label>

            <select
              className="form-control"
              name="traveller_id"
              value={form.traveller_id}
              onChange={updateField}
            >
              <option value="">Select traveller</option>

              {travellers.map((traveller) => (
                <option key={traveller.id} value={traveller.id}>
                  {traveller.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label">Amount *</label>

            <input
              type="number"
              min="0"
              step="0.01"
              className="form-control"
              name="amount"
              value={form.amount}
              onChange={updateField}
              placeholder="5000"
            />
          </div>

          <div>
            <label className="form-label">Deposit Date *</label>

            <input
              type="date"
              className="form-control"
              name="deposit_date"
              value={form.deposit_date}
              onChange={updateField}
            />
          </div>

          <div>
            <label className="form-label">Note</label>

            <input
              className="form-control"
              name="note"
              value={form.note}
              onChange={updateField}
              placeholder="Cash / bank / etc."
            />
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            type="submit"
            disabled={saving || travellers.length === 0}
            className="btn-primary"
          >
            {saving
              ? "Saving..."
              : editingId
                ? "Update Deposit"
                : "Add Deposit"}
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
        <h3 className="font-bold text-slate-900">Deposit Records</h3>

        <div className="mt-4 divide-y divide-slate-100">
          {deposits.length === 0 ? (
            <p className="py-6 text-center text-sm text-slate-500">
              No deposits yet.
            </p>
          ) : (
            deposits.map((deposit) => (
              <div
                key={deposit.id}
                className="flex items-start justify-between gap-4 py-3"
              >
                <div>
                  <p className="font-medium text-slate-900">
                    {travellerNames.get(deposit.traveller_id) || "Traveller"}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {formatDate(deposit.deposit_date)}
                    {deposit.note ? ` · ${deposit.note}` : ""}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <p className="mr-1 text-sm font-bold text-emerald-700">
                    {formatMoney(deposit.amount)}
                  </p>

                  <button
                    type="button"
                    onClick={() => startEdit(deposit)}
                    className="icon-btn"
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteDeposit(deposit)}
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
