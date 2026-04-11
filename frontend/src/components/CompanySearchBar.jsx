import { useState } from "react";
import { Search } from "lucide-react";

export default function CompanySearchBar({ handleCompanySearch, className = "" }) {
  const [query, setQuery] = useState("");

  const onAnalyze = () => {
    if (typeof handleCompanySearch === "function") {
      handleCompanySearch(query);
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="flex w-full items-center gap-3 rounded-2xl bg-[#0f172a] p-3 shadow-[0_10px_30px_rgba(2,6,23,0.55)]">
        <div className="group flex h-14 w-full items-center gap-3 rounded-xl border border-slate-700/70 bg-slate-900/70 px-4 transition-all duration-300 focus-within:border-indigo-400/80 focus-within:shadow-[0_0_0_3px_rgba(99,102,241,0.2)]">
          <Search
            size={18}
            className="shrink-0 text-slate-400 transition-colors duration-300 group-focus-within:text-indigo-300"
            aria-hidden="true"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search company (e.g., Tata Steel, Reliance...)"
            className="h-full w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-500 outline-none"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onAnalyze();
              }
            }}
            aria-label="Search company"
          />
        </div>

        <button
          type="button"
          onClick={onAnalyze}
          className="h-14 shrink-0 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-6 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(79,70,229,0.45)] transition-all duration-300 hover:-translate-y-0.5 hover:from-purple-500 hover:to-indigo-500 hover:shadow-[0_12px_28px_rgba(99,102,241,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300/70"
        >
          Analyze Company
        </button>
      </div>
      <p className="mt-2 px-1 text-xs text-slate-400">Try: Tata, Reliance, Adani, Infosys</p>
    </div>
  );
}
