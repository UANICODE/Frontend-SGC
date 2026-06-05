// components/attendant/modals/WeightProductModal.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ProductItem } from "@/types/attendant/sale/Product";

interface WeightProductModalProps {
  open: boolean;
  product: ProductItem | null;
  existingWeight?: number | null;
  onClose: () => void;
  onConfirm: (weightInGrams: number, totalPrice: number) => void;
}

export function WeightProductModal({
  open,
  product,
  existingWeight,
  onClose,
  onConfirm,
}: WeightProductModalProps) {
  const [weight, setWeight] = useState<string>("");
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [error, setError] = useState<string>("");

  const pricePerGram = product?.pricePerGram || 0;
  const minWeight = product?.minWeight || 1;

  // Carregar peso existente para edição
  useEffect(() => {
    if (existingWeight && existingWeight > 0) {
      setWeight(existingWeight.toString());
      const calculatedPrice = existingWeight * pricePerGram;
      setTotalPrice(calculatedPrice);
    } else {
      setWeight("");
      setTotalPrice(0);
    }
    setError("");
  }, [existingWeight, product, open]);

  if (!open || !product) return null;

  const handleWeightChange = (value: string) => {
    setWeight(value);
    const grams = parseFloat(value);
    
    if (!isNaN(grams) && grams > 0) {
      const calculatedPrice = grams * pricePerGram;
      setTotalPrice(Number(calculatedPrice.toFixed(2)));
      setError("");
    } else {
      setTotalPrice(0);
    }
  };

  const handleConfirm = () => {
    const grams = parseFloat(weight);
    
    if (isNaN(grams) || grams <= 0) {
      setError("Digite um peso válido");
      return;
    }
    
    if (grams < minWeight) {
      setError(`Peso mínimo permitido: ${minWeight} gramas`);
      return;
    }
    
    onConfirm(grams, totalPrice);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white w-full max-w-md p-6 rounded-xl space-y-4"
      >
        <h2 className="text-xl font-bold text-primary">
          {existingWeight ? "Editar" : "Adicionar"} {product.name}
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Peso (gramas) * mínimo {minWeight}g
            </label>
            <input
              type="number"
              step="any"
              value={weight}
              onChange={(e) => handleWeightChange(e.target.value)}
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
              placeholder={`Ex: ${minWeight}`}
            />
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex justify-between text-sm">
              <span>Preço por grama:</span>
              <span className="font-medium">MZN {pricePerGram.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold mt-2">
              <span>Total:</span>
              <span className="text-primary">MZN {totalPrice.toFixed(2)}</span>
            </div>
          </div>
          
          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}
        </div>
        
        <div className="flex gap-3 pt-4">
          <button
            onClick={onClose}
            className="flex-1 border rounded-lg py-2 hover:bg-gray-50 transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 bg-primary text-white rounded-lg py-2 hover:brightness-90 transition"
          >
            {existingWeight ? "Atualizar" : "Adicionar"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}