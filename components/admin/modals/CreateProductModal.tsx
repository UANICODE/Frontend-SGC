"use client";

import {
  createCompositeProduct,
  createProduct,
  updateProduct,
} from "@/service/admin/products";
import {
  CreateProductRequest,
  CreateCompositeProductRequest,
  ProductItemResponse,
} from "@/types/admin/product";
import { useToast } from "@/ context/ToastContext";
import { motion } from "framer-motion";
import { useState } from "react";

interface Props {
  establishmentId: string;
  product?: ProductItemResponse | null; // ✅ ADICIONE ISSO
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateProductModal({
  establishmentId,
  product,
  onClose,
  onSuccess,
}: Props) {
  const { showToast } = useToast();
const isEdit = !!product;
  const [typeProduct, setTypeProduct] = useState<"simple" | "composite">("simple");
  const [loading, setLoading] = useState(false);
const [form, setForm] = useState<CreateProductRequest>({
  establishmentId,
  categoryId: product?.categoryId ?? "",
  productTypeId: product?.productTypeId ?? "",
  name: product?.name ?? "",
  description: product?.description ?? "",
  imageurl: product?.imageurl ?? "",
  price: product?.price ?? 0,
  controlsStock: product?.controlsStock ?? true,
  allowNegativeStock: product?.allowNegativeStock ?? false,
  active: product?.active ?? true,
  initialStockQuantity: product?.stockQuantity ?? 0,
});
async function handleSubmit() {
  if (!form.name || !form.categoryId || !form.productTypeId) {
    showToast("Preencha os campos obrigatórios.", "error");
    return;
  }

  try {
    setLoading(true);

    if (isEdit) {
        await updateProduct({
        ...form,
        productId: product!.id,
        });

      showToast("Produto atualizado com sucesso!", "success");
    } else {
      if (typeProduct === "simple") {
        await createProduct(form);
        showToast("Produto criado com sucesso!", "success");
      } else {
        const payload: CreateCompositeProductRequest = {
          ...form,
          ingredients: [],
        };

        await createCompositeProduct(payload);
        showToast("Produto composto criado com sucesso!", "success");
      }
    }

    await onSuccess();
    onClose();
  } catch (error) {
    if (error instanceof Error) {
      showToast(error.message, "error");
    }
  } finally {
    setLoading(false);
  }
}

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white w-full max-w-2xl p-8 rounded-xl space-y-6"
      >
       <h2 className="text-xl font-bold text-primary">
        {isEdit ? "Editar Produto" : "Novo Produto"}
        </h2>

        <button
          disabled={loading}
          onClick={handleSubmit}
          className="bg-primary text-white w-full py-3 rounded-lg disabled:opacity-50"
        >
          {loading ? "Salvando..." : "Salvar"}
        </button>
      </motion.div>
    </div>
  );
}