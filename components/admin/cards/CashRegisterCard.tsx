import { OpenCashRegisterResponse } from "@/types/admin/cash-register";

interface Props {
  cash: OpenCashRegisterResponse;
}

export function CashRegisterCard({ cash }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition transform hover:-translate-y-1 animate-fadeIn">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-primary">
          {cash.attendantName}
        </h2>

        <span className="text-sm text-gray-500">
          Aberto em {new Date(cash.openedAt).toLocaleString()}
        </span>
      </div>

      <div className="mb-4">
        <p className="text-gray-500 text-sm">Total Vendido</p>
        <p className="text-2xl font-bold text-green-600">
          {cash.totalSold.toLocaleString("pt-MZ", {
            style: "currency",
            currency: "MZN",
          })}
        </p>
      </div>

      <div className="border-t pt-4 space-y-2">
        <p className="text-sm font-semibold text-gray-600">
          Totais por Método
        </p>

        {cash.totalsByPaymentMethod.map((method) => (
          <div
            key={method.paymentMethodId}
            className="flex justify-between text-sm bg-gray-50 p-2 rounded-lg"
          >
            <span>{method.paymentMethodName}</span>
            <span className="font-medium">
              {method.total.toLocaleString("pt-MZ", {
                style: "currency",
                currency: "MZN",
              })}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}