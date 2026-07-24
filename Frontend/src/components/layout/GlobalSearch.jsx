import { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { searchTasks } from '../../api/tasks';

const labelColors = {
  DESIGN: 'bg-indigo-100 text-indigo-600',
  FEATURE: 'bg-green-100 text-green-600',
  'HIGH PRIORITY': 'bg-red-100 text-red-600',
  BUG: 'bg-orange-100 text-orange-600',
  RESEARCH: 'bg-purple-100 text-purple-600',
};

const GlobalSearch = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const handler = setTimeout(async () => {
      if (query.trim().length < 2) {
        setResults([]);
        return;
      }
      try {
        setLoading(true);
        const res = await searchTasks(query);
        setResults(res.data);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [query]);

  
  useEffect(() => {
    const handleClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSelect = (task) => {
    navigate(`/board/${task.board?._id}`);
    setQuery('');
    setResults([]);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-72">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search all tasks..."
          className="w-full bg-slate-100 rounded-full pl-10 pr-8 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setResults([]); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {}
      {open && query.length >= 2 && (
        <div className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 size={18} className="animate-spin text-slate-400" />
            </div>
          ) : results.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-6">
              No tasks found for "{query}"
            </p>
          ) : (
            <div className="max-h-72 overflow-y-auto">
              {results.map((task) => (
                <div
                  key={task._id}
                  onClick={() => handleSelect(task)}
                  className="px-4 py-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-1">
                    {task.label && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${labelColors[task.label] || 'bg-slate-100 text-slate-600'}`}>
                        {task.label}
                      </span>
                    )}
                    <span className="text-[10px] text-slate-400 font-medium">
                      {task.board?.title}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-slate-800 truncate">
                    {task.title}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GlobalSearch;