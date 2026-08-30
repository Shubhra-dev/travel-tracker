import { useState } from "react";

import { Pencil, Trash2 } from "lucide-react";

import { useTripData } from "../../context/TripDataContext";

import { supabase } from "../../lib/supabase";

import { formatDate, formatMoney, todayISO } from "../../lib/format";

const categories = [
  "Transport",
  "Hotel",
  "Food",
  "Tickets",
  "Temple / Puja",
  "Medicine",
  "Shopping",
  "Emergency",
  "Miscellaneous",
];

function createInitialForm() {
  return {
    expense_date: todayISO(),
    category: "Transport",
    description: "",
    amount: "",
  };
}

export default function ExpenseManager() {
  const { expenses, refresh } = useTripData();

  const [form, setForm] = useState(createInitialForm());

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
    setForm(createInitialForm());
    setEditingId(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (
      !form.description.trim() ||
      !form.category ||
      !form.expense_date ||
      !form.amount ||
      Number(form.amount) <= 0
    ) {
      setMessage("Date, category, description and valid amount are required.");

      return;
    }

    setSaving(true);
    setMessage("");

    const payload = {
      expense_date: form.expense_date,
      category: form.category,
      description: form.description.trim(),
      amount: Number(form.amount),
    };

    let response;

    if (editingId) {
      response = await supabase
        .from("expenses")
        .update(payload)
        .eq("id", editingId);
    } else {
      response = await supabase.from("expenses").insert(payload);
    }

    if (response.error) {
      setMessage(response.error.message);
      setSaving(false);
      return;
    }

    await refresh();

    resetForm();

    setMessage(editingId ? "Expense updated." : "Expense added.");

    setSaving(false);
  }

  function startEdit(expense) {
    setEditingId(expense.id);

    setForm({
      expense_date: expense.expense_date,
      category: expense.category,
      description: expense.description,
      amount: String(expense.amount),
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function deleteExpense(expense) {
    const confirmed = window.confirm(`Delete "${expense.description}"?`);

    if (!confirmed) return;

    const { error } = await supabase
      .from("expenses")
      .delete()
      .eq("id", expense.id);

    if (error) {
      setMessage(error.message);
      return;
    }

    if (editingId === expense.id) {
      resetForm();
    }

    await refresh();

    setMessage("Expense deleted.");
  }

  return (
    <div className="space-y-5">
      <form onSubmit={handleSubmit} className="panel">
        <h3 className="text-lg font-bold text-slate-900">
          {editingId ? "Edit Expense" : "Add Expense"}
        </h3>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label className="form-label">Date *</label>

            <input
              type="date"
              className="form-control"
              name="expense_date"
              value={form.expense_date}
              onChange={updateField}
            />
          </div>

          <div>
            <label className="form-label">Category *</label>

            <select
              className="form-control"
              name="category"
              value={form.category}
              onChange={updateField}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label">Expense Details *</label>

            <input
              className="form-control"
              name="description"
              value={form.description}
              onChange={updateField}
              placeholder="e.g. Delhi to Haridwar car"
            />
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
              placeholder="2500"
            />
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <button type="submit" disabled={saving} className="btn-primary">
            {saving
              ? "Saving..."
              : editingId
                ? "Update Expense"
                : "Add Expense"}
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
        <h3 className="font-bold text-slate-900">Expense Records</h3>

        <div className="mt-4 divide-y divide-slate-100">
          {expenses.length === 0 ? (
            <p className="py-6 text-center text-sm text-slate-500">
              No expenses yet.
            </p>
          ) : (
            expenses.map((expense) => (
              <div
                key={expense.id}
                className="flex items-start justify-between gap-4 py-3"
              >
                <div>
                  <p className="font-medium text-slate-900">
                    {expense.description}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {formatDate(expense.expense_date)} · {expense.category}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <p className="mr-1 text-sm font-bold text-slate-900">
                    {formatMoney(expense.amount)}
                  </p>

                  <button
                    type="button"
                    onClick={() => startEdit(expense)}
                    className="icon-btn"
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteExpense(expense)}
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
