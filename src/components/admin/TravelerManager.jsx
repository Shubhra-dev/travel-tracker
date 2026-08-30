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
      setMessage("যাত্রীর নাম দিন।");
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
      setMessage("তথ্য সংরক্ষণ করা যায়নি।");
      setSaving(false);
      return;
    }

    await refresh();

    const wasEditing = Boolean(editingId);

    resetForm();

    setMessage(
      wasEditing ? "যাত্রীর তথ্য আপডেট হয়েছে।" : "নতুন যাত্রী যোগ হয়েছে।",
    );

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
    const confirmed = window.confirm(`${traveller.name}-কে মুছে ফেলবেন?`);

    if (!confirmed) return;

    const { error } = await supabase
      .from("travellers")
      .delete()
      .eq("id", traveller.id);

    if (error) {
      setMessage("এই যাত্রীর জমার রেকর্ড আছে। আগে তার জমার রেকর্ড মুছে ফেলুন।");
      return;
    }

    if (editingId === traveller.id) {
      resetForm();
    }

    await refresh();

    setMessage("যাত্রী মুছে ফেলা হয়েছে।");
  }

  return (
    <div className="space-y-5">
      <form onSubmit={handleSubmit} className="panel">
        <h3 className="text-lg font-bold text-slate-900">
          {editingId ? "যাত্রীর তথ্য সম্পাদনা" : "নতুন যাত্রী"}
        </h3>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="form-label">যাত্রীর নাম *</label>

            <input
              className="form-control"
              name="name"
              value={form.name}
              onChange={updateField}
              placeholder="নাম লিখুন"
            />
          </div>

          <div>
            <label className="form-label">অতিরিক্ত তথ্য</label>

            <input
              className="form-control"
              name="note"
              value={form.note}
              onChange={updateField}
              placeholder="প্রয়োজন হলে লিখুন"
            />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button type="submit" disabled={saving} className="btn-primary">
            {saving
              ? "সংরক্ষণ হচ্ছে..."
              : editingId
                ? "আপডেট করুন"
                : "যাত্রী যোগ করুন"}
          </button>

          {editingId && (
            <button type="button" onClick={resetForm} className="btn-secondary">
              বাতিল
            </button>
          )}
        </div>

        {message && <p className="mt-3 text-sm text-slate-600">{message}</p>}
      </form>

      <div className="panel">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900">যাত্রী তালিকা</h3>

          <span className="text-xs text-slate-500">
            মোট {travellers.length} জন
          </span>
        </div>

        <div className="mt-4 divide-y divide-slate-100">
          {travellers.length === 0 ? (
            <p className="py-6 text-center text-sm text-slate-500">
              কোনো যাত্রী যোগ করা হয়নি।
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
                    title="সম্পাদনা"
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteTraveller(traveller)}
                    className="icon-btn-danger"
                    title="মুছুন"
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
