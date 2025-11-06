export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-12 border-t border-slate-200">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 text-sm text-slate-600 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>© {year} Polash Diary. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <a
            href="https://www.linkedin.com/in/md-polash-miya-726667193/"
            target="_blank"
            rel="noreferrer"
            className="text-green-600 hover:text-green-800"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}
