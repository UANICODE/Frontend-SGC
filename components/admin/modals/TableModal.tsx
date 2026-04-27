// components/admin/modals/TableModal.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

interface TableModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initialData?: any;
}

export function TableModal({ open, onClose, onSave, initialData }: TableModalProps) {
  const [form, setForm] = useState({
    number: "",
    capacity: "",
    location: "",
    active: true,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm({
        number: initialData.number || "",
        capacity: initialData.capacity || "",
        location: initialData.location || "",
        active: initialData.active !== undefined ? initialData.active : true,
      });
    } else {
      setForm({ number: "", capacity: "", location: "", active: true });
    }
  }, [initialData, open]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({
        number: form.number,
        capacity: form.capacity ? parseInt(form.capacity) : null,
        location: form.location || null,
        active: form.active,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl p-6 w-full max-w-md"
      >
        <h2 className="text-xl font-bold mb-4">{initialData ? "Editar Mesa" : "Nova Mesa"}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Número da Mesa *</label>
            <input
              type="text"
              value={form.number}
              onChange={(e) => setForm({ ...form, number: e.target.value })}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-primary focus:outline-none"
              required
              disabled={saving}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Capacidade (pessoas)</label>
            <input
              type="number"
              value={form.capacity}
              onChange={(e) => setForm({ ...form, capacity: e.target.value })}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-primary focus:outline-none"
              disabled={saving}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Localização</label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-primary focus:outline-none"
              placeholder="Ex: Salão Principal, Varanda..."
              disabled={saving}
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
              className="w-4 h-4"
              disabled={saving}
            />
            <label className="text-sm font-medium">Mesa ativa</label>
          </div>
          <div className="flex gap-3 pt-4">
            <button 
              type="button" 
              onClick={onClose} 
              disabled={saving}
              className="flex-1 border rounded-lg py-2 hover:bg-gray-50 transition disabled:opacity-50"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={saving}
              className="flex-1 bg-primary text-white rounded-lg py-2 hover:brightness-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <ArrowPathIcon className="w-4 h-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar"
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}