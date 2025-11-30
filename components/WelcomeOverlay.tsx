export default function WelcomeOverlay({ visible }: { visible: boolean }) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none animate-fade-out">
      <div className="bg-white dark:bg-zinc-900 px-8 py-6 rounded-3xl shadow-2xl border border-purple-200 dark:border-purple-800">
        <p className="text-3xl font-bold text-purple-600">Haii sayangg! ♡</p>
      </div>
    </div>
  );
}
