// app/components/home-ui/ActiveAlerts.tsx

interface Alert {
  id: number;
  type: string;
  message: string;
  time: string;
  severity: 'critical' | 'warning' | 'normal';
}

interface ActiveAlertsProps {
  alerts: Alert[];
}

export function ActiveAlerts({ alerts }: ActiveAlertsProps) {
  /* 
    REFINED COLOR PALETTE (Strict Blue & White):
    - Critical: Red (Retained for safety, but softer)
    - Warning: Amber-600 (Orange-ish yellow for better contrast on white)
    - Normal: Blue-50/Blue-700 (Matches the main theme instead of generic blue)
  */
  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-50 text-red-900 border-red-200 hover:bg-red-100';
      case 'warning':
        return 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100';
      default:
        return 'bg-blue-50 text-blue-900 border-blue-200 hover:bg-blue-100';
    }
  };

  const getAlertIcon = (type: string, severity: string) => {
    const iconClass = severity === 'critical' 
      ? "text-red-500" 
      : severity === 'warning' ? "text-amber-500" : "text-blue-600";

    switch (type) {
      case 'Emergency':
        return (
          <svg className={`w-5 h-5 ${iconClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      case 'Missed Scan':
        return (
          <svg className={`w-5 h-5 ${iconClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg className={`w-5 h-5 ${iconClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm h-full flex flex-col hover:shadow-md transition-shadow duration-300">
      {/* Header Section */}
      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
        <h2 className="text-lg font-bold text-slate-800">Active Alerts</h2>
        
        {/* Count Badge with Animation */}
        <div className="flex items-center gap-2">
          <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wide">
            Live
          </span>
          <span className="bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md shadow-blue-500/30">
            {alerts.length}
          </span>
        </div>
      </div>
      
      {/* Alerts List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-slate-400">
            <svg className="w-8 h-8 mb-2 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm font-medium">No active alerts</p>
          </div>
        ) : (
          alerts.map((alert) => (
            <div 
              key={alert.id} 
              className={`group relative p-4 rounded-xl border-l-4 shadow-sm transition-all duration-300 hover:translate-x-1 ${getSeverityStyle(alert.severity)}`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  {getAlertIcon(alert.type, alert.severity)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <p className="font-bold text-sm truncate">{alert.type}</p>
                    <p className="text-xs opacity-70 font-medium whitespace-nowrap ml-2">{alert.time}</p>
                  </div>
                  <p className="text-sm leading-snug opacity-90">{alert.message}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Footer Link */}
      <div className="p-4 pt-0">
        <a href="#" className="block text-center text-blue-600 hover:text-blue-800 text-sm font-bold transition-colors duration-200 py-2 rounded-lg hover:bg-blue-50">
          View all alerts
        </a>
      </div>
    </div>
  );
}