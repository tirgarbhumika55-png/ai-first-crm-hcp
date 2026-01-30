export default function PageLayout({ title, children }) {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        {title}
      </h1>
      {children}
    </div>
  );
}