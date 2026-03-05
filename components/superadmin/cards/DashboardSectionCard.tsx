import Link from "next/link";

interface Props {
  title: string;
  description: string;
}

export function DashboardSectionCard({
  title,
  description,
}: Props) {
  return (
    <div className="bg-card border rounded-xl p-6 flex flex-col justify-between">
      <div>
        <h3 className="font-semibold text-lg">
          {title}
        </h3>

        <p className="text-sm text-muted-foreground mt-2">
          {description}
        </p>
      </div>

      <Link
        href="#"
        className="mt-4 text-primary font-medium"
      >
        Ver Detalhes →
      </Link>
    </div>
  );
}