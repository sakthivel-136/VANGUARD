'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
    Shield,
    Users,
    AlertTriangle,
    Activity,
    Clock,
    BarChart3,
    TrendingUp,
    Target,
    Trophy,
    Building2,
} from 'lucide-react'
import {
    getAnalyticsOverview,
    getDashboardCharts,
    getScansByGuard,
    getGuardPerformance,
    AnalyticsOverview,
    DashboardChartsResponse,
    GuardScan,
    GuardPerformanceMetric,
} from '@/app/api/analytics.api'
import { fetchFactories } from '@/app/api/qr.api'
import { getSecurityUsers } from '@/app/api/securityUsers.api'

interface Factory {
    factory_code: string
    factory_name: string
}

export default function DashboardPage() {
    const router = useRouter()
    const [adminName, setAdminName] = useState('')
    const [currentTime, setCurrentTime] = useState('')
    const [loading, setLoading] = useState(true)

    // Factory selector
    const [factories, setFactories] = useState<Factory[]>([])
    const [selectedFactory, setSelectedFactory] = useState('')

    // Analytics
    const [overview, setOverview] = useState<AnalyticsOverview | null>(null)
    const [charts, setCharts] = useState<DashboardChartsResponse | null>(null)
    const [guardScans, setGuardScans] = useState<GuardScan[]>([])
    const [guardPerformance, setGuardPerformance] = useState<GuardPerformanceMetric[]>([])
    const [securityCount, setSecurityCount] = useState(0)

    // Auth check + load factories
    useEffect(() => {
        const name = localStorage.getItem('adminName') || localStorage.getItem('name')
        if (!name || name.trim() === '') { router.push('/login'); return }
        setAdminName(name)

        const updateTime = () => {
            setCurrentTime(new Date().toLocaleString('en-IN', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                hour: '2-digit', minute: '2-digit',
            }))
        }
        updateTime()
        const interval = setInterval(updateTime, 60000)

        // Load factories
        fetchFactories()
            .then((data) => {
                const list = data || []
                setFactories(list)
                const saved = localStorage.getItem('selectedFactory')
                if (saved && list.find((f: Factory) => f.factory_code === saved)) {
                    setSelectedFactory(saved)
                } else if (list.length > 0) {
                    setSelectedFactory(list[0].factory_code)
                }
            })
            .catch(console.error)

        return () => clearInterval(interval)
    }, [router])

    // Load analytics when factory changes
    useEffect(() => {
        if (!selectedFactory || !adminName) return
        const load = async () => {
            setLoading(true)
            try {
                const today = new Date().toISOString().slice(0, 10)
                const [ov, ch, gs, perf, users] = await Promise.allSettled([
                    getAnalyticsOverview(),
                    getDashboardCharts(selectedFactory),
                    getScansByGuard(),
                    getGuardPerformance(today),
                    getSecurityUsers(),
                ])
                if (ov.status === 'fulfilled') setOverview(ov.value)
                if (ch.status === 'fulfilled') setCharts(ch.value)
                if (gs.status === 'fulfilled') setGuardScans(gs.value)
                if (perf.status === 'fulfilled') setGuardPerformance(perf.value?.metrics || [])
                if (users.status === 'fulfilled') {
                    const allUsers = users.value || []
                    const factoryUsers = allUsers.filter((u: any) => u.factory_code === selectedFactory)
                    setSecurityCount(factoryUsers.length)
                }
            } catch (err) { console.error(err) }
            finally { setLoading(false) }
        }
        load()
    }, [selectedFactory, adminName])

    // Derived stats
    const topGuard = guardScans.length > 0
        ? guardScans.reduce((m, g) => g.scan_count > m.scan_count ? g : m, guardScans[0])
        : null

    const totalScanned = guardPerformance.reduce((s, g) => s + g.scanned_points, 0)
    const totalPoints = guardPerformance.reduce((s, g) => s + g.total_points, 0)
    const scanAccuracy = totalPoints > 0 ? Math.round((totalScanned / totalPoints) * 100) : 0

    const currentFactoryName = factories.find(f => f.factory_code === selectedFactory)?.factory_name || selectedFactory

    const kpis = [
        { label: 'Security Personnel', value: securityCount, icon: Users, bgLight: 'bg-blue-50', textColor: 'text-blue-600', borderColor: 'border-l-blue-500' },
        { label: 'Total Rounds', value: overview?.total_expected_rounds ?? 0, icon: BarChart3, bgLight: 'bg-indigo-50', textColor: 'text-indigo-600', borderColor: 'border-l-indigo-500' },
        { label: 'Missed Scans', value: overview?.missed_scans ?? 0, icon: AlertTriangle, bgLight: 'bg-red-50', textColor: 'text-red-600', borderColor: 'border-l-red-500' },
        { label: 'Scan Accuracy', value: `${scanAccuracy}%`, icon: Target, bgLight: scanAccuracy >= 80 ? 'bg-emerald-50' : 'bg-amber-50', textColor: scanAccuracy >= 80 ? 'text-emerald-600' : 'text-amber-600', borderColor: scanAccuracy >= 80 ? 'border-l-emerald-500' : 'border-l-amber-500' },
    ]

    const maxGuardScans = Math.max(...(guardScans?.map(g => g.scan_count) || [1]), 1)

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Banner with Factory Selector */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl p-8 mb-8 relative overflow-hidden shadow-lg"
                    style={{ background: 'linear-gradient(to right, #060650, #1a1a8f)' }}
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-16 w-32 h-32 bg-white/5 rounded-full translate-y-1/2" />

                    <div className="relative z-10">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="bg-white/20 p-2 rounded-lg">
                                        <Shield className="w-6 h-6 text-white" />
                                    </div>
                                    <h1 className="text-2xl font-bold text-white drop-shadow-lg">VanguardVisor Dashboard</h1>
                                </div>
                                <p className="text-white/70 text-sm ml-12">Welcome, {adminName}</p>
                            </div>
                            <div className="flex items-center gap-2 bg-white/15 px-4 py-2 rounded-xl">
                                <Clock className="w-4 h-4 text-white/80" />
                                <span className="text-sm text-white font-medium">{currentTime}</span>
                            </div>
                        </div>

                        {/* Factory Selector */}
                        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20">
                            <Building2 className="w-5 h-5 text-white/80" />
                            <label className="text-xs text-white/70 font-bold uppercase tracking-wider shrink-0">Factory:</label>
                            <select
                                value={selectedFactory}
                                onChange={(e) => {
                                    setSelectedFactory(e.target.value)
                                    localStorage.setItem('selectedFactory', e.target.value)
                                }}
                                className="flex-1 bg-transparent text-white font-semibold text-sm border-none outline-none cursor-pointer appearance-none"
                                style={{ colorScheme: 'dark' }}
                            >
                                {factories.map((f) => (
                                    <option key={f.factory_code} value={f.factory_code} style={{ color: '#000', background: '#fff' }}>
                                        {f.factory_name} ({f.factory_code})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </motion.div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                    {kpis.map((kpi, i) => (
                        <motion.div key={kpi.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                            className={`bg-white rounded-xl border border-gray-100 border-l-4 ${kpi.borderColor} shadow-sm p-5 hover:shadow-md hover:-translate-y-0.5 transition-all`}
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{kpi.label}</p>
                                    <p className="text-3xl font-bold text-gray-900">
                                        {loading ? <span className="inline-block w-12 h-8 bg-gray-100 rounded animate-pulse" /> : kpi.value}
                                    </p>
                                </div>
                                <div className={`${kpi.bgLight} p-2.5 rounded-xl`}>
                                    <kpi.icon className={`w-6 h-6 ${kpi.textColor}`} />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Top Guard Highlight */}
                {topGuard && !loading && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                        className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-2xl p-5 mb-8 flex items-center gap-4"
                    >
                        <div className="bg-amber-100 p-3 rounded-xl">
                            <Trophy className="w-7 h-7 text-amber-600" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-amber-600 uppercase tracking-wider">🏆 Highest Success Scans — {currentFactoryName}</p>
                            <p className="text-xl font-bold text-gray-900">{topGuard.guard_name}</p>
                            <p className="text-sm text-gray-500">{topGuard.scan_count} successful scans today</p>
                        </div>
                    </motion.div>
                )}

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Scan Activity */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                        className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                    >
                        <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Activity className="w-5 h-5 text-blue-600" />
                                <h3 className="font-bold text-gray-800">Scan Activity</h3>
                            </div>
                            <span className="text-xs text-gray-400 font-medium">{currentFactoryName}</span>
                        </div>
                        <div className="p-6">
                            {loading ? (
                                <div className="h-48 flex items-center justify-center">
                                    <div className="w-8 h-8 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                                </div>
                            ) : charts?.activity_data && charts.activity_data.length > 0 ? (
                                <div className="space-y-3">
                                    {charts.activity_data.slice(0, 8).map((item, i) => {
                                        const maxVal = Math.max(...charts.activity_data.map(d => d.scans), 1)
                                        return (
                                            <div key={i} className="flex items-center gap-3">
                                                <span className="text-xs text-gray-400 font-mono w-14 shrink-0">{item.time}</span>
                                                <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                                                    <motion.div initial={{ width: 0 }} animate={{ width: `${(item.scans / maxVal) * 100}%` }}
                                                        transition={{ delay: i * 0.05, duration: 0.5 }}
                                                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-end pr-2"
                                                    >
                                                        {item.scans > 0 && <span className="text-[10px] font-bold text-white">{item.scans}</span>}
                                                    </motion.div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            ) : (
                                <div className="h-48 flex flex-col items-center justify-center text-gray-400">
                                    <Activity className="w-8 h-8 mb-2 opacity-30" />
                                    <p className="text-sm">No scan activity data for {currentFactoryName}</p>
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Guard Performance */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                        className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                    >
                        <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-emerald-600" />
                                <h3 className="font-bold text-gray-800">Guard Scans</h3>
                            </div>
                            <span className="text-xs text-gray-400 font-medium">{currentFactoryName}</span>
                        </div>
                        <div className="p-6">
                            {loading ? (
                                <div className="h-48 flex items-center justify-center">
                                    <div className="w-8 h-8 border-3 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
                                </div>
                            ) : guardScans && guardScans.length > 0 ? (
                                <div className="space-y-3">
                                    {guardScans.slice(0, 8).map((guard, i) => (
                                        <div key={guard.guard_name} className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                                                {guard.guard_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-sm font-medium text-gray-800 truncate">{guard.guard_name}</span>
                                                    <span className="text-xs font-bold text-gray-500 ml-2">{guard.scan_count}</span>
                                                </div>
                                                <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
                                                    <motion.div initial={{ width: 0 }} animate={{ width: `${(guard.scan_count / maxGuardScans) * 100}%` }}
                                                        transition={{ delay: i * 0.05, duration: 0.5 }}
                                                        className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="h-48 flex flex-col items-center justify-center text-gray-400">
                                    <Users className="w-8 h-8 mb-2 opacity-30" />
                                    <p className="text-sm">No guard scan data for {currentFactoryName}</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>

            </div>
        </div>
    )
}
