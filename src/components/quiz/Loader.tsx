export default function Loader() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-xl text-slate-300">Loading questions...</p>
    </div>
  );
}
