import UsersClientComplete from "./components/UserClientComplete";

export default function Home() {
  return (
    <main className="container-main">
      <header className="bg-linear-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 text-white py-11 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-5xl">👥</span>
            <h1 className="text-5xl font-bold m-0 max-h-0">User Management</h1>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto py-12 px-4">
        <UsersClientComplete />
      </div>

      <footer className="bg-slate-50 dark:bg-slate-800 mt-20 py-8 px-4 border-t border-slate-200 dark:border-slate-700">
        <div className="max-w-6xl mx-auto text-center text-slate-600 dark:text-slate-400">
          <p>✨ นายอัคคเดช สายแก้ว 6740011063 Sec02 ✨</p>
        </div>
      </footer>
    </main>
  );
}
