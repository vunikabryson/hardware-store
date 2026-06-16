export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="animate-pulse">
        <div className="h-4 w-64 bg-stone-200 rounded mb-6" />
        <div className="grid md:grid-cols-2 gap-10">
          <div className="aspect-square bg-stone-200 rounded-lg" />
          <div className="space-y-4">
            <div className="h-4 w-24 bg-stone-200 rounded" />
            <div className="h-8 w-3/4 bg-stone-200 rounded" />
            <div className="h-6 w-32 bg-stone-200 rounded" />
            <div className="h-10 w-40 bg-stone-200 rounded" />
            <div className="space-y-2 pt-4">
              <div className="h-4 w-full bg-stone-200 rounded" />
              <div className="h-4 w-full bg-stone-200 rounded" />
              <div className="h-4 w-2/3 bg-stone-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
