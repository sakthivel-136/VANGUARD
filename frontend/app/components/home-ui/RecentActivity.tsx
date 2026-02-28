// app/components/home-ui/RecentActivity.tsx
import Link from "next/link";

interface Activity {
  id: number;
  time: string;
  type: string;
  guard: string;
  description: string;
}

interface RecentActivityProps {
  activities: Activity[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
  /* 
    REFINED ICON PALETTE (Strict Blue & White):
    - Success (Completed): Blue 600 (Primary Theme Color)
    - Warning (Emergency): Red 500 (Retained for safety)
    - Info (Check-in): Slate 400 (Subtle)
  */
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'Patrol Completed':
        return (
          <div className="flex-shrink-0 h-9 w-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center ring-1 ring-blue-100">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case 'Alert Resolved':
        return (
          <div className="flex-shrink-0 h-9 w-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center ring-1 ring-indigo-100">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      case 'Guard Check-in':
        return (
          <div className="flex-shrink-0 h-9 w-9 rounded-lg bg-slate-50 text-slate-500 flex items-center justify-center ring-1 ring-slate-200">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        );
      case 'Emergency Alert':
        return (
          <div className="flex-shrink-0 h-9 w-9 rounded-lg bg-red-50 text-red-500 flex items-center justify-center ring-1 ring-red-100">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        );
      case 'Patrol Started':
        return (
          <div className="flex-shrink-0 h-9 w-9 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/30">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="flex-shrink-0 h-9 w-9 rounded-lg bg-slate-100 text-slate-400 flex items-center justify-center">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm h-full flex flex-col hover:shadow-md transition-shadow duration-300">
      
      {/* Header */}
      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Recent Activity</h2>
          <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">Event Log</p>
        </div>
        <Link href="#" className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline underline-offset-2">
          View all
        </Link>
      </div>
      
      {/* List Body */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          {activities.map((activity, index) => (
            <div key={activity.id} className="relative group flex gap-4">
              {/* Timeline Line (Connects items) */}
              {index !== activities.length - 1 && (
                <div className="absolute left-[18px] top-9 bottom-[-24px] w-0.5 bg-slate-100 group-last:hidden"></div>
              )}

              {/* Icon */}
              <div className="relative z-10">
                {getActivityIcon(activity.type)}
              </div>

              {/* Content */}
              <div className="flex-1 pt-1 pb-6">
                <div className="flex justify-between items-start">
                  <p className="text-sm font-bold text-slate-800">{activity.type}</p>
                  <span className="text-xs font-mono text-slate-400 whitespace-nowrap bg-slate-50 px-1.5 py-0.5 rounded">
                    {activity.time}
                  </span>
                </div>
                
                <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                  <span className="font-semibold text-slate-700">{activity.guard}</span> — {activity.description}
                </p>
              </div>
            </div>
          ))}
          
          {activities.length === 0 && (
            <div className="text-center py-12">
               <div className="bg-slate-50 rounded-full p-3 mx-auto w-fit">
                <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
               </div>
               <p className="text-sm font-medium text-slate-500 mt-3">No recent activity</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Footer Link */}
      <div className="p-4 pt-0">
        <Link 
          href="#" 
          className="block w-full text-center text-sm font-bold text-blue-600 hover:text-blue-800 hover:bg-blue-50 py-3 rounded-lg transition-colors duration-200"
        >
          View full activity log
        </Link>
      </div>
    </div>
  );
}