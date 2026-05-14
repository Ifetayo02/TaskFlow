import React from 'react'

const CTA = () => {
  return (
    <>
    <div className='bg-slate-100'>
            <div className="px-6 py-20 max-w-7xl mx-auto">
              <div className="bg-slate-950 rounded-[3rem] p-12 md:p-24 text-center text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 blur-[120px] rounded-full -mr-20 -mt-20" />
                <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to hit flow state?</h2>
                <p className="text-slate-400 mb-10 max-w-md mx-auto">Join thousands of high-performance teams using TaskFlow to ship more, faster.</p>
                <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
                  <button className="bg-indigo-600 px-8 py-4 rounded-xl font-bold hover:bg-indigo-500 transition-all">Start 14-Day Free Trial</button>
                  <button className="bg-slate-800 px-8 py-4 rounded-xl font-bold hover:bg-slate-700 transition-all border border-slate-700">Talk to Sales</button>
                </div>
              </div>
            </div>
        </div>
        </>
  )
}

export default CTA