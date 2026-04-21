// components/admin/modals/CreateProductModal.tsx
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
  product?: ProductItemResponse | null;
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

  // 🔥 Tipo do produto: simple, composite, weight
  const [productType, setProductType] = useState<"simple" | "composite" | "weight">(
    product?.isWeightBased ? "weight" : (product?.ingredients?.length ? "composite" : "simple")
  );

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
    isFixedPortion: product?.isFixedPortion ?? false,
    portionQuantity: product?.portionQuantity ?? null,
    // 🆕 Campos para produto por peso
    isWeightBased: product?.isWeightBased ?? false,
    pricePerGram: product?.pricePerGram ?? null,
    minWeight: product?.minWeight ?? null,
  });

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [ingredients, setIngredients] = useState<IngredientItemResponse[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // 🔹 Carregar dependências
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
    // Validações básicas
    if (!form.name || !form.categoryId || !form.productTypeId) {
      showToast("Preencha os campos obrigatórios.", "error");
      return;
    }

    // Validações por tipo de produto
    if (productType === "composite" && (!form.ingredients || form.ingredients.length === 0)) {
      showToast("Selecione pelo menos um ingrediente para produtos compostos.", "error");
      return;
    }

    if (productType === "weight") {
      if (!form.pricePerGram || form.pricePerGram <= 0) {
        showToast("Informe o preço por grama válido.", "error");
        return;
      }
      if (!form.minWeight || form.minWeight <= 0) {
        showToast("Informe o peso mínimo válido.", "error");
        return;
      }
    }

    try {
      setLoading(true);

      let uploadedUrl = form.imageurl;
      if (selectedFile) uploadedUrl = await uploadProductImage(selectedFile);

      if (isEdit && product) {
        // ✅ UPDATE
        const payload: UpdateProductRequest = {
          establishmentId: form.establishmentId,
          productId: product.id,
          categoryId: form.categoryId,
          productTypeId: form.productTypeId,
          name: form.name,
          description: form.description,
          imageurl: uploadedUrl,
          price: productType === "weight" ? 0 : form.price,
          controlsStock: form.controlsStock,
          allowNegativeStock: form.allowNegativeStock,
          active: form.active,
          ingredients: productType === "composite"
            ? form.ingredients?.map(i => ({
                ingredientId: i.ingredientId,
                ingredientName: i.ingredientName,
                quantityUsed: i.quantityUsed,
              }))
            : null,
          isFixedPortion: productType === "simple" ? (form.isFixedPortion ?? false) : false,
          portionQuantity: (productType === "simple" && form.isFixedPortion) ? form.portionQuantity : null,
          isWeightBased: productType === "weight",
          pricePerGram: productType === "weight" ? form.pricePerGram : null,
          minWeight: productType === "weight" ? form.minWeight : null,
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
            initialStockQuantity: form.initialStockQuantity,
            isFixedPortion: form.isFixedPortion ?? false,
            portionQuantity: form.isFixedPortion ? form.portionQuantity : null,
          };
          await createProduct(payload);
        } else if (productType === "composite") {
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
        } else {
          // weight - produto por peso
          const payload: CreateProductRequest = {
            establishmentId: form.establishmentId,
            categoryId: form.categoryId,
            productTypeId: form.productTypeId,
            name: form.name,
            description: form.description,
            imageurl: uploadedUrl,
            price: 0, // ZERO para produtos por peso
            controlsStock: form.controlsStock,
            allowNegativeStock: form.allowNegativeStock,
            active: form.active,
            initialStockQuantity: form.initialStockQuantity,
            isFixedPortion: false,
            portionQuantity: null,
            isWeightBased: true,
            pricePerGram: form.pricePerGram,
            minWeight: form.minWeight,
          };
          await createProduct(payload);
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
      setForm({
        ...form,
        ingredients: form.ingredients!.filter(i => i.ingredientId !== ingredientId),
      });
    } else {
      const ingredient = ingredients.find(i => i.id === ingredientId);
      if (!ingredient) return;
      setForm({
        ...form,
        ingredients: [...(form.ingredients ?? []), {
          ingredientId: ingredient.id,
          ingredientName: ingredient.name,
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
        <div className="flex gap-4 flex-wrap">
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
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={productType === "weight"}
              onChange={() => setProductType("weight")}
            />
            Produto por Peso (carne, queijo, etc)
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Nome */}
          <label className="flex flex-col">Nome *</label>
          <input
            type="text"
            className="border p-2 rounded w-full"
            placeholder="Informe o nome do produto"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />

          {/* Preço - só para produtos simples e compostos */}
          {productType !== "weight" && (
            <>
              <label className="flex flex-col">Preço *</label>
              <input
                type="number"
                step="0.01"
                className="border p-2 rounded w-full"
                value={form.price}
                onChange={e => setForm({ ...form, price: parseFloat(e.target.value) })}
              />
            </>
          )}

          {/* Para produto por peso - mostrar mensagem */}
          {productType === "weight" && (
            <>
              <div></div>
              <p className="text-sm text-amber-600 col-span-2 -mt-2">
                ⚠️ Produto por peso: o preço será calculado automaticamente na venda (peso × preço por grama)
              </p>
            </>
          )}

          {/* Categoria */}
          <label className="flex flex-col">Categoria *</label>
          <select
            value={form.categoryId}
            onChange={e => setForm({ ...form, categoryId: e.target.value })}
            className="border p-2 rounded w-full"
          >
            <option value="">Selecione a categoria</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>

          {/* Tipo de Produto */}
          <label className="flex flex-col">Tipo de Produto *</label>
          <select
            value={form.productTypeId}
            onChange={e => setForm({ ...form, productTypeId: e.target.value })}
            className="border p-2 rounded w-full"
          >
            <option value="">Selecione o tipo</option>
            {productTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>

          {/* Quantidade inicial - só para criação */}
          {!isEdit && productType === "simple" && (
            <>
              <label className="flex flex-col">Quantidade inicial</label>
              <input
                type="number"
                step="any"
                className="border p-2 rounded w-full"
                value={form.initialStockQuantity}
                onChange={e => setForm({ ...form, initialStockQuantity: parseFloat(e.target.value) })}
              />
            </>
          )}

          {!isEdit && productType === "weight" && (
            <>
              <label className="flex flex-col">Quantidade inicial (gramas)</label>
              <input
                type="number"
                step="any"
                className="border p-2 rounded w-full"
                value={form.initialStockQuantity}
                onChange={e => setForm({ ...form, initialStockQuantity: parseFloat(e.target.value) })}
              />
            </>
          )}

          {/* Descrição */}
          <label className="flex flex-col col-span-2">Descrição</label>
          <textarea
            className="border p-2 rounded w-full"
            placeholder="Descreva o produto"
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
          />

          {/* Upload */}
          <label className="flex flex-col col-span-2">Imagem do produto</label>
          <input
            type="file"
            accept="image/*"
            onChange={e => e.target.files?.[0] && setSelectedFile(e.target.files[0])}
          />

          {/* Checkboxes */}
          <div className="flex items-center gap-4 col-span-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.controlsStock}
                onChange={e => setForm({ ...form, controlsStock: e.target.checked })}
              />
              Controla estoque
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.allowNegativeStock}
                onChange={e => setForm({ ...form, allowNegativeStock: e.target.checked })}
              />
              Permitir estoque negativo
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.active}
                onChange={e => setForm({ ...form, active: e.target.checked })}
              />
              Ativo
            </label>
          </div>

          {/* 🆕 SEÇÃO PARA PRODUTO POR PESO */}
          {productType === "weight" && (
            <div className="col-span-2 border rounded-lg p-4 space-y-4 bg-purple-50">
              <h3 className="font-semibold text-purple-800">Configuração de Venda por Peso</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Preço por grama (MZN) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.pricePerGram ?? ""}
                    onChange={(e) => setForm({ ...form, pricePerGram: parseFloat(e.target.value) || null })}
                    className="w-full border p-2 rounded"
                    placeholder="Ex: 0.50"
                  />
                  <p className="text-xs text-gray-500 mt-1">Preço por grama. Ex: 0.50 = 50 centavos por grama</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Peso mínimo (gramas) *</label>
                  <input
                    type="number"
                    step="any"
                    value={form.minWeight ?? ""}
                    onChange={(e) => setForm({ ...form, minWeight: parseFloat(e.target.value) || null })}
                    className="w-full border p-2 rounded"
                    placeholder="Ex: 100"
                  />
                  <p className="text-xs text-gray-500 mt-1">Peso mínimo que o cliente pode comprar</p>
                </div>
              </div>
            </div>
          )}

          {/* 🆕 SEÇÃO PARA PORÇÃO FIXA - só para produtos simples */}
          {productType === "simple" && (
            <div className="col-span-2 border-t pt-4 mt-2">
              <div className="flex items-center gap-2 mb-3">
                <input
                  type="checkbox"
                  id="isFixedPortion"
                  checked={form.isFixedPortion}
                  onChange={(e) => {
                    setForm({ 
                      ...form, 
                      isFixedPortion: e.target.checked,
                      portionQuantity: e.target.checked ? form.portionQuantity : null 
                    });
                  }}
                />
                <label htmlFor="isFixedPortion" className="font-medium">
                  Produto com porção fixa (ex: shot, dose, unidade específica)
                </label>
              </div>
              
              {form.isFixedPortion && (
                <div className="ml-6 p-3 bg-gray-50 rounded-lg">
                  <label className="flex flex-col text-sm font-medium mb-1">
                    Quantidade por venda (gramas/unidades) *
                  </label>
                  <input
                    type="number"
                    step="any"
                    className="border p-2 rounded w-64"
                    placeholder="Ex: 57.43"
                    value={form.portionQuantity ?? ""}
                    onChange={(e) => {
                      const value = e.target.value ? parseFloat(e.target.value) : null;
                      setForm({ ...form, portionQuantity: value });
                    }}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Cada venda deste produto descontará exatamente esta quantidade do estoque.
                  </p>
                </div>
              )}
            </div>
          )}

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
                        min={0.01}
                        step="any"
                        value={selected.quantityUsed}
                        className="border p-1 rounded w-24"
                        onChange={e => setIngredientQuantity(i.id, parseFloat(e.target.value) || 0.01)}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Botões */}
        <button
          disabled={loading}
          onClick={handleSubmit}
          className="bg-primary text-white w-full py-3 rounded-lg disabled:opacity-50 hover:brightness-90 transition"
        >
          {loading ? "Salvando..." : "Salvar"}
        </button>
        <button
          disabled={loading}
          onClick={onClose}
          className="mt-2 w-full py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition"
        >
          Cancelar
        </button>
      </motion.div>
    </div>
  );
}