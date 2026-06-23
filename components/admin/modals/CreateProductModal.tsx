"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import { 
  X, 
  Package, 
  Tag, 
  Layers, 
  DollarSign, 
  Box, 
  Power, 
  FlaskConical, 
  Scale, 
  Weight, 
  AlertCircle,
  Upload,
  Save,
  Plus,
  Trash2
} from "lucide-react";

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
    isWeightBased: product?.isWeightBased ?? false,
    pricePerGram: product?.pricePerGram ?? null,
    minWeight: product?.minWeight ?? null,
  });

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [ingredients, setIngredients] = useState<IngredientItemResponse[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(form.imageurl || null);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  async function handleSubmit() {
    if (!form.name || !form.categoryId || !form.productTypeId) {
      showToast("Preencha os campos obrigatórios.", "error");
      return;
    }

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
          const payload: CreateProductRequest = {
            establishmentId: form.establishmentId,
            categoryId: form.categoryId,
            productTypeId: form.productTypeId,
            name: form.name,
            description: form.description,
            imageurl: uploadedUrl,
            price: 0,
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

  const removeIngredient = (ingredientId: string) => {
    setForm({
      ...form,
      ingredients: form.ingredients!.filter(i => i.ingredientId !== ingredientId),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header com gradiente */}
        <div className="">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  {isEdit ? "Editar Produto" : "Novo Produto"}
                </h2>
                <p className="text-white/80 text-sm">
                  {isEdit ? "Altere as informações do produto" : "Adicione um novo produto ao catálogo"}
                </p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-xl transition-colors"
            >
              <X className="w-5 h-5 " />
            </button>
          </div>
        </div>

        {/* Body com scroll */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {/* Tipo de Produto - Cards */}
          <div className="mb-6">
            <label className="text-sm font-semibold text-gray-700 block mb-3 flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-primary" />
              Tipo de Produto
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { value: "simple", label: "Produto Simples", icon: Package, desc: "Produto único sem ingredientes", color: "from-blue-500 to-cyan-500" },
                { value: "composite", label: "Produto Composto", icon: Layers, desc: "Produto com ingredientes", color: "from-purple-500 to-pink-500" },
                { value: "weight", label: "Produto por Peso", icon: Scale, desc: "Vendido por grama/quilo", color: "from-green-500 to-emerald-500" }
              ].map((type) => {
                const Icon = type.icon;
                const isSelected = productType === type.value;
                return (
                  <button
                    key={type.value}
                    onClick={() => setProductType(type.value as any)}
                    className={`relative p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                      isSelected 
                        ? `border-primary bg-gradient-to-r ${type.color} bg-opacity-10 shadow-lg scale-105` 
                        : "border-gray-200 hover:border-primary/50 hover:shadow-md"
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute -top-2 -right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 ${
                      isSelected ? "bg-white/20" : "bg-gray-100"
                    }`}>
                      <Icon className={`w-5 h-5 ${isSelected ? "text-white" : "text-gray-500"}`} />
                    </div>
                    <p className={`font-semibold text-sm ${isSelected ? "text-white" : "text-gray-800"}`}>{type.label}</p>
                    <p className={`text-xs mt-1 ${isSelected ? "text-white/80" : "text-gray-400"}`}>{type.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Nome */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Tag className="w-4 h-4 text-primary" />
                Nome do Produto *
              </label>
              <input
                type="text"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                placeholder="Ex: Hambúrguer Artesanal"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
              />
            </div>

            {/* Preço */}
            {productType !== "weight" && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-primary" />
                  Preço (MZN) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  placeholder="0.00"
                  value={form.price}
                  onChange={e => setForm({ ...form, price: parseFloat(e.target.value) })}
                />
              </div>
            )}

            {productType === "weight" && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Weight className="w-4 h-4 text-primary" />
                  Preço por Grama (MZN) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  placeholder="Ex: 0.50"
                  value={form.pricePerGram ?? ""}
                  onChange={(e) => setForm({ ...form, pricePerGram: parseFloat(e.target.value) || null })}
                />
                <p className="text-xs text-gray-400">Preço por grama. Ex: 0.50 = 50 centavos/grama</p>
              </div>
            )}

            {/* Categoria */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Layers className="w-4 h-4 text-primary" />
                Categoria *
              </label>
              <select
                value={form.categoryId}
                onChange={e => setForm({ ...form, categoryId: e.target.value })}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white"
              >
                <option value="">Selecione a categoria</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            {/* Tipo de Produto */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Package className="w-4 h-4 text-primary" />
                Tipo de Classificação *
              </label>
              <select
                value={form.productTypeId}
                onChange={e => setForm({ ...form, productTypeId: e.target.value })}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white"
              >
                <option value="">Selecione o tipo</option>
                {productTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>

            {/* Quantidade inicial */}
            {!isEdit && (productType === "simple" || productType === "weight") && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Box className="w-4 h-4 text-primary" />
                  Quantidade inicial {productType === "weight" && "(gramas)"}
                </label>
                <input
                  type="number"
                  step="any"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  placeholder={productType === "weight" ? "Ex: 1000" : "Ex: 10"}
                  value={form.initialStockQuantity}
                  onChange={e => setForm({ ...form, initialStockQuantity: parseFloat(e.target.value) })}
                />
              </div>
            )}

            {/* Peso mínimo para produto por peso */}
            {productType === "weight" && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Weight className="w-4 h-4 text-primary" />
                  Peso mínimo (gramas) *
                </label>
                <input
                  type="number"
                  step="any"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  placeholder="Ex: 100"
                  value={form.minWeight ?? ""}
                  onChange={(e) => setForm({ ...form, minWeight: parseFloat(e.target.value) || null })}
                />
                <p className="text-xs text-gray-400">Peso mínimo que o cliente pode comprar</p>
              </div>
            )}

            {/* Descrição */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-primary" />
                Descrição
              </label>
              <textarea
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                placeholder="Descreva o produto..."
                rows={3}
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
              />
            </div>

            {/* Imagem */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Upload className="w-4 h-4 text-primary" />
                Imagem do Produto
              </label>
              <div className="flex items-center gap-4">
                {imagePreview && (
                  <div className="relative">
                    <img src={imagePreview} alt="Preview" className="w-20 h-20 object-cover rounded-xl shadow-md" />
                    <button
                      onClick={() => {
                        setImagePreview(null);
                        setSelectedFile(null);
                        setForm({ ...form, imageurl: "" });
                      }}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                )}
                <label className="flex-1 cursor-pointer">
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-primary transition-all">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Clique ou arraste uma imagem</p>
                    <p className="text-xs text-gray-400">PNG, JPG até 5MB</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            </div>

            {/* Checkboxes */}
            <div className="flex flex-wrap gap-4 md:col-span-2 p-4 bg-gray-50 rounded-xl">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.controlsStock}
                  onChange={e => setForm({ ...form, controlsStock: e.target.checked })}
                  className="w-4 h-4 text-primary rounded focus:ring-primary"
                />
                <span className="text-sm text-gray-700">Controlar estoque</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.allowNegativeStock}
                  onChange={e => setForm({ ...form, allowNegativeStock: e.target.checked })}
                  className="w-4 h-4 text-primary rounded focus:ring-primary"
                />
                <span className="text-sm text-gray-700">Permitir estoque negativo</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={e => setForm({ ...form, active: e.target.checked })}
                  className="w-4 h-4 text-primary rounded focus:ring-primary"
                />
                <span className="text-sm text-gray-700">Produto ativo</span>
              </label>
            </div>

            {/* Porção Fixa */}
            {productType === "simple" && (
              <div className="md:col-span-2 border-t pt-4">
                <label className="flex items-center gap-2 cursor-pointer mb-3">
                  <input
                    type="checkbox"
                    checked={form.isFixedPortion}
                    onChange={(e) => {
                      setForm({ 
                        ...form, 
                        isFixedPortion: e.target.checked,
                        portionQuantity: e.target.checked ? form.portionQuantity : null 
                      });
                    }}
                    className="w-4 h-4 text-primary rounded focus:ring-primary"
                  />
                  <span className="text-sm font-medium text-gray-700">Produto com porção fixa</span>
                </label>
                
                {form.isFixedPortion && (
                  <div className="ml-6 p-4 bg-gray-50 rounded-xl">
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Quantidade por venda (gramas/unidades) *
                    </label>
                    <input
                      type="number"
                      step="any"
                      className="w-full md:w-64 border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      placeholder="Ex: 57.43"
                      value={form.portionQuantity ?? ""}
                      onChange={(e) => {
                        const value = e.target.value ? parseFloat(e.target.value) : null;
                        setForm({ ...form, portionQuantity: value });
                      }}
                    />
                    <p className="text-xs text-gray-400 mt-2">
                      Cada venda descontará exatamente esta quantidade do estoque.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Ingredientes */}
            {productType === "composite" && (
              <div className="md:col-span-2 border rounded-xl p-4 space-y-3">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                  <FlaskConical className="w-4 h-4 text-primary" />
                  Ingredientes do Produto
                </h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {ingredients.map(i => {
                    const selected = form.ingredients?.find(f => f.ingredientId === i.id);
                    return (
                      <div key={i.id} className={`flex items-center gap-3 p-2 rounded-lg transition-all ${selected ? "bg-primary/5 border border-primary/20" : "hover:bg-gray-50"}`}>
                        <input
                          type="checkbox"
                          checked={!!selected}
                          onChange={() => toggleIngredient(i.id)}
                          className="w-4 h-4 text-primary rounded focus:ring-primary"
                        />
                        <span className="flex-1 text-sm text-gray-700">{i.name}</span>
                        {selected && (
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min={0.01}   
                              step="any"
                              value={selected.quantityUsed}
                              className="border-2 border-gray-200 rounded-lg px-3 py-1.5 w-24 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                              onChange={e => setIngredientQuantity(i.id, parseFloat(e.target.value) || 0.01)}
                            />
                            <span className="text-xs text-gray-500">{i.unit}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                {form.ingredients && form.ingredients.length > 0 && (
                  <div className="pt-2 text-xs text-gray-500 border-t">
                    Total de ingredientes: {form.ingredients.length}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer com botões */}
        <div className="flex gap-3 p-6 bg-gray-50 border-t">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-100 hover:border-gray-300 transition-all duration-300"
          >
            Cancelar
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-primary to-secondary text-white px-4 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                {isEdit ? "Salvando..." : "Criando..."}
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                {isEdit ? "Atualizar Produto" : "Criar Produto"}
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}