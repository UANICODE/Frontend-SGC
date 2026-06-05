export function formatCurrency(value?: number) {
  return new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "MZN",
  }).format(value ?? 0);
}