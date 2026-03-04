export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div className="min-h-screen bg-backgroundLight text-textPrimaryLight">
      {children}
    </div>
  );
}