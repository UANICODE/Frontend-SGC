"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  createProduct,
  createCompositeProduct,
  updateProduct,
  listCategories,
  listProductTypes,
  listIngredients,
} from "@/service/admin/products";
import { uploadProductImage } from "@/utils/uploadProductImage";
import {
  CreateProductRequest,
  ProductItemResponse,
  CategoryResponse,
  ProductType,
  IngredientItemResponse,
  IngredientItem,
  UpdateProductRequest,
  CreateCompositeProductRequest,
} from "@/types/admin/product";
import { useToast } from "@/ context/ToastContext";

interface Props {
  establishmentId: string;
  product?: ProductItemResponse | null; // para edição
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

  const [form, setForm] = useState<CreateProductRequest & { ingredients?: IngredientItem[] }>({
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
    ingredients: product?.ingredients ?? [],
  });

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [ingredients, setIngredients] = useState<IngredientItemResponse[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [productType, setProductType] = useState<"simple" | "composite">(product?.ingredients?.length ? "composite" : "simple");

  // 🔹 Carregar categorias, tipos e ingredientes
  useEffect(() => {
    async function fetchDependencies() {
      try {
        setCategories(await listCategories(establishmentId));
        setProductTypes(await listProductTypes(establishmentId));
     setIngredients((await listIngredients(establishmentId)).content);
      } catch (err) {
        console.error(err);
      }
    }
    fetchDependencies();
  }, [establishmentId]);

 async function handleSubmit() {
  if (!form.name || !form.categoryId || !form.productTypeId) {
    showToast("Preencha os campos obrigatórios.", "error");
    return;
  }

  if (productType === "composite" && (!form.ingredients || form.ingredients.length === 0)) {
    showToast("Selecione pelo menos um ingrediente para produtos compostos.", "error");
    return;
  }

  try {
    setLoading(true);

    let uploadedUrl = form.imageurl;
    if (selectedFile) uploadedUrl = await uploadProductImage(selectedFile);

    if (isEdit && product) {
      // ✅ UPDATE (não enviar initialStockQuantity)
      const payload: UpdateProductRequest = {
  establishmentId: form.establishmentId,
  productId: product.id,
  categoryId: form.categoryId,
  productTypeId: form.productTypeId,
  name: form.name,
  description: form.description,
  imageurl: uploadedUrl,
  price: form.price,
  controlsStock: form.controlsStock,
  allowNegativeStock: form.allowNegativeStock,
  active: form.active,
   ingredients: productType === "composite"
  ? form.ingredients?.map(i => ({
      ingredientId: i.ingredientId,
      ingredientName: i.ingredientName, // ✅ adicionado
      quantityUsed: i.quantityUsed,
  }))
  : null,
};

      await updateProduct(payload);
      showToast("Produto atualizado com sucesso!", "success");

    } else {
      // ✅ CREATE
      if (productType === "simple") {
        const payload: CreateProductRequest = {
          establishmentId: form.establishmentId,
          categoryId: form.categoryId,
          productTypeId: form.productTypeId,
          name: form.name,
          description: form.description,
          imageurl: uploadedUrl,
          price: form.price,
          controlsStock: form.controlsStock,
          allowNegativeStock: form.allowNegativeStock,
          active: form.active,
          initialStockQuantity: form.initialStockQuantity, // só no create
        };
        await createProduct(payload);
      } else {
        // produto composto
        const payload: CreateCompositeProductRequest = {
          establishmentId: form.establishmentId,
          categoryId: form.categoryId,
          productTypeId: form.productTypeId,
          name: form.name,
          description: form.description,
          imageurl: uploadedUrl,
          price: form.price,
          controlsStock: form.controlsStock,
          allowNegativeStock: form.allowNegativeStock,
          active: form.active,
          ingredients: form.ingredients || [],
        };
        await createCompositeProduct(payload);
      }

      showToast("Produto criado com sucesso!", "success");
    }

    await onSuccess();
    onClose();
  } catch (err) {
    if (err instanceof Error) showToast(err.message, "error");
  } finally {
    setLoading(false);
  }
}

  const toggleIngredient = (ingredientId: string) => {
  const existing = form.ingredients?.find(i => i.ingredientId === ingredientId);
  if (existing) {
    // Remove ingrediente
    setForm({
      ...form,
      ingredients: form.ingredients!.filter(i => i.ingredientId !== ingredientId),
    });
  } else {
    // Adiciona ingrediente com nome correto
    const ingredient = ingredients.find(i => i.id === ingredientId);
    if (!ingredient) return;

    setForm({
      ...form,
      ingredients: [...(form.ingredients ?? []), {
        ingredientId: ingredient.id,
        ingredientName: ingredient.name, // ✅ obrigatorio
        quantityUsed: 1,
      }],
    });
  }
};

  const setIngredientQuantity = (ingredientId: string, quantity: number) => {
    setForm({
      ...form,
      ingredients: form.ingredients!.map(i => i.ingredientId === ingredientId ? { ...i, quantityUsed: quantity } : i),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white w-full max-w-3xl p-6 rounded-xl space-y-4 overflow-y-auto max-h-[90vh]"
      >
        <h2 className="text-xl font-bold text-primary">
          {isEdit ? "Editar Produto" : "Novo Produto"}
        </h2>

        {/* Select tipo produto */}
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={productType === "simple"}
              onChange={() => setProductType("simple")}
            />
            Produto Simples
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={productType === "composite"}
              onChange={() => setProductType("composite")}
            />
            Produto Composto
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Nome, Preço, Categoria, Tipo */}
          <label className="flex flex-col">Nome *</label>
          <input type="text" className="border p-2 rounded w-full" placeholder="Informe o nome do produto" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          <label className="flex flex-col">Preço *</label>
          <input type="number" className="border p-2 rounded w-full" value={form.price} onChange={e => setForm({...form, price: parseFloat(e.target.value)})} />
          <label className="flex flex-col">Categoria *</label>
          <select value={form.categoryId} onChange={e => setForm({...form, categoryId: e.target.value})} className="border p-2 rounded w-full">
            <option value="">Selecione a categoria</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <label className="flex flex-col">Tipo de Produto *</label>
          <select value={form.productTypeId} onChange={e => setForm({...form, productTypeId: e.target.value})} className="border p-2 rounded w-full">
            <option value="">Selecione o tipo</option>
            {productTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>

       {/* Quantidade inicial - só aparece se não for edição */}
        {!isEdit && productType === "simple" && (
          <>
            <label className="flex flex-col">Quantidade inicial</label>
            <input
              type="number"
              className="border p-2 rounded w-full"
              value={form.initialStockQuantity}
              onChange={e =>
                setForm({ ...form, initialStockQuantity: parseFloat(e.target.value) })
              }
            />
          </>
        )}
          {/* Descrição */}
          <label className="flex flex-col col-span-2">Descrição</label>
          <textarea className="border p-2 rounded w-full" placeholder="Descreva o produto" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />

          {/* Upload */}
          <label className="flex flex-col col-span-2">Imagem do produto</label>
          <input type="file" accept="image/*" onChange={e => e.target.files?.[0] && setSelectedFile(e.target.files[0])} />

          {/* Checkboxes */}
          <div className="flex items-center gap-4 col-span-2">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.controlsStock} onChange={e => setForm({...form, controlsStock: e.target.checked})} />
              Controla estoque
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.allowNegativeStock} onChange={e => setForm({...form, allowNegativeStock: e.target.checked})} />
              Permitir estoque negativo
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.active} onChange={e => setForm({...form, active: e.target.checked})} />
              Ativo
            </label>
          </div>

          {/* Ingredientes se composto */}
         {/* Ingredientes se composto */}
{productType === "composite" && (
  <div className="col-span-2 border p-4 rounded space-y-2">
    <h3 className="font-semibold">Ingredientes</h3>
    {ingredients.map(i => {
      const selected = form.ingredients?.find(f => f.ingredientId === i.id);
      return (
        <div key={i.id} className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={!!selected}
            onChange={() => toggleIngredient(i.id)}
          />
          <span className="flex-1">{i.name}</span>
          {selected && (
            <input
              type="number"
              min={1}
              value={selected.quantityUsed}
              className="border p-1 rounded w-20"
              onChange={e =>
                setIngredientQuantity(i.id, parseFloat(e.target.value) || 1)
              }
            />
          )}
        </div>
      );
    })}
  </div>
)}
        </div>

        {/* Botões */}
        <button disabled={loading} onClick={handleSubmit} className="bg-primary text-white w-full py-3 rounded-lg disabled:opacity-50">
          {loading ? "Salvando..." : "Salvar"}
        </button>
        <button disabled={loading} onClick={onClose} className="mt-2 w-full py-3 rounded-lg border border-gray-300">
          Cancelar
        </button>
      </motion.div>
    </div>
  );
}