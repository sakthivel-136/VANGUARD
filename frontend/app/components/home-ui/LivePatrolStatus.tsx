// app/components/home-ui/LivePatrolStatus.tsx

interface Patrol {
  id: number;
  guardName: string;
  routeName: string;
  startTime: string;
  expectedEndTime: string;
  progress: number;
}

interface LivePatrolStatusProps {
  patrols: Patrol[];
}

export function LivePatrolStatus({ patrols }: LivePatrolStatusProps) {
  /* 
    REFINED COLOR PALETTE (Strict Blue & White):
    - High Progress (>75%): Vibrant Blue (Primary)
    - Medium Progress (>50%): Slate Blue (Subtle)
    - Low Progress (<50%): Desaturated Slate (Attention)
    - Very Low (<25%): Red (Critical Alert)
  */
  const getProgressStyle = (progress: number) => {
    if (progress >= 75) return 'bg-blue-600';
    if (progress >= 50) return 'bg-indigo-500';
    if (progress >= 25) return 'bg-slate-400';
    return 'bg-red-500';
  };

  const getAvatarGradient = (name: string) => {
    // Simple hash to pick a color from a blue-ish palette
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const colors = [
      'bg-blue-600', 'bg-blue-700', 'bg-indigo-600', 
      'bg-cyan-600', 'bg-sky-600', 'bg-teal-600'
    ];
    return colors[hash % colors.length];
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm h-full flex flex-col hover:shadow-md transition-shadow duration-300">
      
      {/* Header */}
      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white/95">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Live Patrol Status</h2>
          <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">Active Sessions</p>
        </div>
        
        <div className="flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-full border border-green-100">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-bold text-green-700 uppercase tracking-wide">Live</span>
        </div>
      </div>
      
      {/* Table Body */}
      <div className="flex-1 overflow-x-auto p-4">
        <table className="w-full min-w-[500px]">
          <thead>
            <tr className="text-left border-b border-slate-100">
              <th className="pb-3 pl-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Guard</th>
              <th className="pb-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Route</th>
              <th className="pb-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Duration</th>
              <th className="pb-3 text-right pr-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Progress</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {patrols.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center">
                    <svg className="w-8 h-8 mb-2 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm font-medium">No active patrols</p>
                  </div>
                </td>
              </tr>
            ) : (
              patrols.map((patrol) => (
                <tr key={patrol.id} className="hover:bg-slate-50 transition-colors duration-150 group">
                  
                  {/* Guard Column */}
                  <td className="py-4 pl-2 align-middle">
                    <div className="flex items-center">
                      <div className={`h-9 w-9 rounded-full ${getAvatarGradient(patrol.guardName)} flex items-center justify-center text-xs font-bold text-white shadow-sm ring-2 ring-white`}>
                        {patrol.guardName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-bold text-slate-800">{patrol.guardName}</div>
                      </div>
                    </div>
                  </td>

                  {/* Route Column */}
                  <td className="py-4 align-middle">
                    <div className="text-sm text-slate-700 font-medium">{patrol.routeName}</div>
                  </td>

                  {/* Time Column */}
                  <td className="py-4 align-middle">
                    <div className="flex flex-col">
                      <span className="text-sm text-slate-800 font-medium">{patrol.startTime}</span>
                      <span className="text-xs text-slate-400 mt-0.5">End: {patrol.expectedEndTime}</span>
                    </div>
                  </td>

                  {/* Progress Column */}
                  <td className="py-4 pr-4 align-middle">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ease-out ${getProgressStyle(patrol.progress)}`}
                          style={{ width: `${patrol.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-bold text-slate-600 min-w-[3rem] text-right">{patrol.progress}%</span>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}