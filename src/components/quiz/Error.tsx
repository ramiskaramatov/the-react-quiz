export default function Error() {
  return (
    <div className="bg-red-500/20 border border-red-500 rounded-2xl p-6 text-center">
      <span className="text-4xl mb-2 block">💥</span>
      <p className="text-xl">There was an error fetching questions.</p>
    </div>
  );
}
