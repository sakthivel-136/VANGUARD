// app/components/home-ui/KpiCards.tsx

interface KpiData {
  guardsOnDuty: number;
  activePatrols: number;
  missedScans: number;
  emergencyAlerts: number;
}

interface KpiCardsProps {
  data: KpiData;
}

export function KpiCards({ data }: KpiCardsProps) {
  /* 
    COLOR LOGIC (Strict Blue & White):
    - Primary: White card with Blue text & Blue border.
    - Critical: Red text/indicators (Retained for safety urgency).
    - Warnings: Slate text (Subtle, not distracting).
  */
  const getKpiStyle = (type: string, value: number) => {
    // Base white card style
    const base = "bg-white border-slate-200 text-slate-800";
    const accentBlue = "border-l-blue-600";
    
    // Emergency overrides: Red border/text
    if (type === 'emergencyAlerts' && value > 0) {
      return `${base} border-red-200 shadow-[0_4px_14px_0_rgba(239,68,68,0.15)] hover:shadow-[0_6px_20px_0_rgba(239,68,68,0.25)] border-l-4 border-l-red-500`;
    }
    
    // Missed Scans: Progressive colors
    if (type === 'missedScans') {
      if (value > 5) return `${base} border-amber-200 border-l-4 border-l-amber-500`;
      if (value > 2) return `${base} border-slate-200 border-l-4 border-l-slate-400`;
    }

    // Standard: Blue Theme
    return `${base} shadow-sm hover:shadow-md border-l-4 ${accentBlue}`;
  };

  const getKpiIcon = (type: string, value: number) => {
    // Determine color based on status
    let iconColor = "text-blue-500";
    if (type === 'emergencyAlerts' && value > 0) iconColor = "text-red-500";
    if (type === 'missedScans' && value > 5) iconColor = "text-amber-500";

    switch (type) {
      case 'guardsOnDuty':
        return (
          <svg className={`w-8 h-8 ${iconColor}`} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
          </svg>
        );
      case 'activePatrols':
        return (
          <svg className={`w-8 h-8 ${iconColor}`} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
          </svg>
        );
      case 'missedScans':
        return (
          <svg className={`w-8 h-8 ${iconColor}`} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        );
      case 'emergencyAlerts':
        return (
          <svg className={`w-8 h-8 ${iconColor}`} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const kpiItems = [
    { type: 'guardsOnDuty', label: 'Guards On Duty', value: data.guardsOnDuty },
    { type: 'activePatrols', label: 'Active Patrols', value: data.activePatrols },
    { type: 'missedScans', label: 'Missed Scans', value: data.missedScans },
    { type: 'emergencyAlerts', label: 'Emergency Alerts', value: data.emergencyAlerts }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpiItems.map((item) => (
        <div 
          key={item.type} 
          className={`group relative p-5 rounded-xl border border-l-4 transition-all duration-300 hover:-translate-y-1 ${getKpiStyle(item.type, item.value)}`}
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                {item.label}
              </p>
              <p className={`text-3xl font-bold tracking-tight transition-colors duration-300 ${item.type === 'emergencyAlerts' && item.value > 0 ? 'text-red-600' : 'text-slate-800'}`}>
                {item.value}
              </p>
            </div>
            
            <div className="p-2 rounded-lg bg-slate-50 group-hover:bg-white group-hover:shadow-sm transition-all duration-300">
              {getKpiIcon(item.type, item.value)}
            </div>
          </div>

          {/* Subtle Background Decoration for Active State */}
          {item.value > 0 && item.type === 'activePatrols' && (
             <div className="absolute top-0 right-0 -mt-2 -mr-2 h-4 w-4 rounded-full bg-blue-500 opacity-20 animate-ping"></div>
          )}
        </div>
      ))}
    </div>
  );
}