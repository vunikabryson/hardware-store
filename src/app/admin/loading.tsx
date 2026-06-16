export default function AdminLoading() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-8 w-48 bg-stone-200 rounded" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 bg-stone-200 rounded-lg" />
        ))}
      </div>
      <div className="h-64 bg-stone-200 rounded-lg" />
    </div>
  )
}
