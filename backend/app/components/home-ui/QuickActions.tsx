// app/components/home-ui/QuickActions.tsx
import Link from "next/link"; // Recommended for Next.js apps

export function QuickActions() {
  const quickActions = [
    { 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
      ),
      label: 'Add User',
      href: '/users/add',
      desc: 'New Staff'
    },
    { 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      label: 'Add Scan Point',
      href: '/scan-points/add',
      desc: 'New Checkpoint'
    },
    { 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
        </svg>
      ),
      label: 'Add QR',
      href: '/qr-codes/add',
      desc: 'Generate Code'
    },
    { 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v1a1 1 0 001 1h4a1 1 0 001-1v-1m3-2V8a2 2 0 00-2-2H8a2 2 0 00-2 2v6m9-1h-6" />
        </svg>
      ),
      label: 'View Reports',
      href: '/reports',
      desc: 'Analytics'
    },
    { 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      ),
      label: 'View Alerts',
      href: '/alerts',
      desc: 'Notifications'
    }
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm h-full flex flex-col hover:shadow-md transition-shadow duration-300">
      
      {/* Header */}
      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Quick Actions</h2>
          <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">Shortcuts</p>
        </div>
      </div>
      
      {/* Action Grid */}
      <div className="flex-1 p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {quickActions.map((action, index) => (
            <Link 
              key={index}
              href={action.href}
              className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:-translate-y-1 hover:border-blue-300 hover:shadow-[0_4px_12px_rgba(37,99,235,0.1)]"
            >
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 p-2.5 rounded-lg bg-slate-50 text-slate-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200">
                  {action.icon}
                </div>
                <div className="flex-1">
                  <span className="block text-sm font-bold text-slate-800 group-hover:text-blue-700 transition-colors duration-200">
                    {action.label}
                  </span>
                  <span className="block text-xs text-slate-400 mt-0.5">
                    {action.desc}
                  </span>
                </div>
              </div>
              
              {/* Hover Arrow Indicator */}
              <svg 
                className="absolute top-4 right-4 w-4 h-4 text-slate-300 opacity-0 -translate-x-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-blue-500" 
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>
      </div>
      
      {/* Footer Link */}
      <div className="p-4 pt-0">
        <Link 
          href="#" 
          className="block w-full text-center text-sm font-bold text-blue-600 hover:text-blue-800 hover:bg-blue-50 py-3 rounded-lg transition-colors duration-200"
        >
          View all actions
        </Link>
      </div>
    </div>
  );
}