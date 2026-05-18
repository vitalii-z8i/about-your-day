export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-stone-100 flex flex-col items-center justify-center px-4">
      <div className="mb-8 text-center">
        <h1 className="text-xl font-medium tracking-tight text-stone-900">
          About Your Day
        </h1>
        <p className="mt-1 text-sm text-stone-500">
          A quiet space to reflect
        </p>
      </div>
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}
