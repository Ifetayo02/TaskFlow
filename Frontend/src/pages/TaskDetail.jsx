import React from 'react';
import { 
  X, 
  AlignLeft, 
  MessageSquare, 
  Calendar, 
  Plus, 
  FileText, 
  Image as ImageIcon,
  CheckCircle2,
  Paperclip
} from 'lucide-react';

const TaskDetailModal = () => {
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 font-sans">
      <div className="bg-white w-full max-w-5xl rounded-[1.5rem] shadow-2xl flex flex-col md:flex-row overflow-hidden relative">
        
        {/* Close Button */}
        <button className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors z-10">
          <X size={24} />
        </button>

        {/* Left Column: Content & Activity */}
        <div className="flex-1 p-8 md:p-12 overflow-y-auto max-h-[90vh]">
          {/* Breadcrumb & Title */}
          <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider mb-4">
            <AlignLeft size={14} />
            Marketing Campaign / Social Assets
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-10">Finalize social media assets</h1>

          {/* Description Section */}
          <div className="mb-12">
            <h3 className="flex items-center gap-2 text-slate-900 font-bold mb-4">
              <AlignLeft size={18} /> Description
            </h3>
            <div className="bg-indigo-50/30 border border-indigo-100/50 rounded-2xl p-6 text-slate-600 leading-relaxed text-sm">
              Please ensure all assets are exported in both 1080x1080 (square) and 1080x1920 (stories) formats. 
              Focus on the core brand colors—Indigo and Slate—maintaining the Corporate Modern aesthetic 
              established in the design system. Refer to the brief attached in the sidebar for specific copy requirements for each slide.
            </div>
          </div>

          {/* Activity Section */}
          <div>
            <h3 className="flex items-center gap-2 text-slate-900 font-bold mb-6">
              <MessageSquare size={18} /> Activity & Comments
            </h3>
            
            {/* Input */}
            <div className="flex gap-4 mb-8">
              <img src="https://i.pravatar.cc/150?u=me" className="w-10 h-10 rounded-full" alt="User" />
              <input 
                type="text" 
                placeholder="Write a comment..." 
                className="flex-1 bg-indigo-50/30 border border-transparent rounded-xl px-4 py-3 text-sm focus:bg-white focus:border-indigo-200 outline-none transition-all"
              />
            </div>

            {/* Comment Thread */}
            <div className="space-y-6">
              <div className="flex gap-4">
                <img src="https://i.pravatar.cc/150?u=sarah" className="w-10 h-10 rounded-full" alt="Sarah" />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm text-slate-900">Sarah Jenkins</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Oct 10 at 4:30 PM</span>
                  </div>
                  <div className="bg-indigo-50/50 rounded-2xl p-4 text-sm text-slate-600 border border-indigo-100/30">
                    I've just uploaded the revised brand guidelines. Let me know if the color codes match the new Slate and Indigo palette.
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">MD</div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm text-slate-900">Marcus Davis</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Yesterday at 11:15 AM</span>
                  </div>
                  <div className="bg-indigo-50/50 rounded-2xl p-4 text-sm text-slate-600 border border-indigo-100/30">
                    Looks great so far! Make sure to double-check the contrast on the secondary CTAs.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Sidebar Metadata */}
        <div className="w-full md:w-[340px] bg-indigo-50/20 border-l border-slate-100 p-8 md:p-10 flex flex-col gap-10">
          
          {/* Members */}
          <section>
            <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">Members</h4>
            <div className="flex items-center gap-2">
              <img src="https://i.pravatar.cc/150?u=sarah" className="w-8 h-8 rounded-full border-2 border-white shadow-sm" alt="m1" />
              <div className="w-8 h-8 rounded-full bg-orange-700 text-white flex items-center justify-center text-[10px] font-bold">MD</div>
              <img src="https://i.pravatar.cc/150?u=4" className="w-8 h-8 rounded-full border-2 border-white shadow-sm" alt="m3" />
              <button className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center border-2 border-white shadow-sm hover:bg-indigo-200 transition-colors">
                <Plus size={14} />
              </button>
            </div>
          </section>

          {/* Labels */}
          <section>
            <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">Labels</h4>
            <div className="flex flex-wrap gap-2">
              <span className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-[10px] font-bold">Design</span>
              <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-[10px] font-bold">High Priority</span>
            </div>
          </section>

          {/* Due Date */}
          <section>
            <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">Due Date</h4>
            <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 flex items-center gap-3 text-sm font-semibold text-slate-700 shadow-sm">
              <Calendar className="text-slate-400" size={18} />
              Oct 12, 2024
            </div>
          </section>

          {/* Checklist */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Checklist</h4>
              <span className="text-[11px] font-black text-indigo-600">60%</span>
            </div>
            <div className="w-full bg-indigo-100 h-2 rounded-full mb-6 overflow-hidden">
              <div className="bg-indigo-600 h-full w-[60%] rounded-full" />
            </div>
            <div className="space-y-4">
              {[
                { label: 'Export JPG versions', checked: true },
                { label: 'Verify font licensing', checked: true },
                { label: 'Final review with Marcus', checked: false },
                { label: 'Handoff to Marketing', checked: false },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 group cursor-pointer">
                  <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${item.checked ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300 group-hover:border-indigo-400'}`}>
                    {item.checked && <CheckCircle2 size={14} className="text-white" />}
                  </div>
                  <span className={`text-sm font-medium ${item.checked ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Attachments */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Attachments</h4>
              <button className="text-[11px] font-black text-indigo-600 hover:underline">Add</button>
            </div>
            <div className="space-y-4">
              <div className="bg-white border border-slate-100 p-3 rounded-xl flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                  <ImageIcon size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">design_v1.png</p>
                  <p className="text-[10px] text-slate-400">Uploaded Oct 8 • 2.4MB</p>
                </div>
              </div>
              <div className="bg-white border border-slate-100 p-3 rounded-xl flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center text-red-600">
                  <FileText size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">brief_revised.pdf</p>
                  <p className="text-[10px] text-slate-400">Uploaded Oct 9 • 1.1MB</p>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;