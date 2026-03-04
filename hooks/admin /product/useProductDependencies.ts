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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);

        const [cats, tps, ing] = await Promise.all([
          listCategories(establishmentId),
          listProductTypes(establishmentId),
          listIngredients(establishmentId),
        ]);

        setCategories(cats);
        setTypes(tps);
        setIngredients(ing.content);
      } catch (error) {
        if (error instanceof Error) {
          showToast(error.message, "error");
        }
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [establishmentId]);

  return { categories, types, ingredients, loading };
}