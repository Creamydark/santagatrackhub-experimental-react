export default function Health() {
  return (
    <div className="p-6 bg-slate-50 dark:bg-gray-900 min-h-screen">
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700 p-8 shadow-sm">
        <h1 className="text-2xl font-bold mb-4 text-slate-800 dark:text-gray-100">System Health</h1>
        <p className="text-slate-600 dark:text-gray-400">This is the Health page. Here you can monitor the health of your system.</p>
      </div>
    </div>
  );
}