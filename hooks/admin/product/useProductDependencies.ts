import { useEffect, useState } from "react";
import {
  CategoryResponse,
  ProductType,
  IngredientItemResponse,
} from "@/types/admin/product";
import {
  listCategories,
  listProductTypes,
  listIngredients,
} from "@/service/admin/products";
import { useToast } from "@/ context/ToastContext";

export function useProductDependencies(establishmentId: string) {
  const { showToast } = useToast();

  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [types, setTypes] = useState<ProductType[]>([]);
  const [ingredients, setIngredients] = useState<IngredientItemResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      // Se não tiver establishmentId, não faz nada
      if (!establishmentId) {
     //   console.warn("⚠️ [useProductDependencies] Sem establishmentId");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
    //    console.log("🔍 [useProductDependencies] Carregando para:", establishmentId);

        // Buscar cada um separadamente para debug
        //console.log("🔍 Buscando categorias...");
        const cats = await listCategories(establishmentId);
        //console.log("✅ Categorias recebidas:", cats);
       // console.log("📊 Quantidade:", cats?.length || 0);
        setCategories(cats || []);

       // console.log("🔍 Buscando product types...");
        const tps = await listProductTypes(establishmentId);
        //console.log("✅ Product Types recebidos:", tps);
        //console.log("📊 Quantidade:", tps?.length || 0);
        setTypes(tps || []);

       // console.log("🔍 Buscando ingredientes...");
        const ing = await listIngredients(establishmentId);
        //console.log("✅ Ingredientes recebidos:", ing);
      //  console.log("📊 Quantidade:", ing?.content?.length || 0);
        setIngredients(ing?.content || []);

       // console.log("✅ [useProductDependencies] Tudo carregado com sucesso!");
      } catch (error) {
      //  console.error("❌ [useProductDependencies] Erro:", error);
        if (error instanceof Error) {
          showToast(error.message, "error");
        }
        // Em caso de erro, manter arrays vazios
        setCategories([]);
        setTypes([]);
        setIngredients([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [establishmentId, showToast]);

  return { categories, types, ingredients, loading };
}