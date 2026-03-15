import { motion } from "framer-motion";
import { Shield, ShieldAlert, MessageSquare, Phone, TrendingUp, Activity } from "lucide-react";
import { dashboardStats, ThreatItem } from "@/data/mockData";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { useState, useEffect } from "react";

const StatCard = ({ icon: Icon, label, value, color, delay }: {
  icon: any; label: string; value: number; color: string; delay: number;
}) => (
  <motion.div
    className={`glass-card p-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    whileHover={{ y: -5 }}
  >
    <div className="flex items-center gap-3">
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${color}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-2xl font-bold font-heading">{value.toLocaleString()}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  </motion.div>
);

const DashboardScreen = ({ threats = [] }: { threats?: ThreatItem[] }) => {
  const { weeklyData } = dashboardStats;
  
  // Calculate dynamic stats from actual interactions
  const totalScanned = threats.length > 0 ? threats.length * 12 + 150 : 150; // Basline + actual
  const threatsBlocked = threats.length;
  const messagesAnalyzed = Math.floor(totalScanned * 0.7) + threats.filter(t => t.type === 'sms').length;
  const callsMonitored = Math.floor(totalScanned * 0.3) + threats.filter(t => t.type === 'call').length;

  const dangerousCount = threats.filter(t => t.riskLevel === 'dangerous').length;
  const suspiciousCount = threats.filter(t => t.riskLevel === 'suspicious').length;
  const safeCount = totalScanned - (dangerousCount + suspiciousCount);

  // Still add a slight "live" jitter to make it feel active, but base it on real numbers
  const [liveStats, setLiveStats] = useState({
    scanned: totalScanned,
    blocked: threatsBlocked,
    messages: messagesAnalyzed,
    calls: callsMonitored,
  });

  // Sync state when threats prop updates
  useEffect(() => {
    setLiveStats(prev => ({
      ...prev,
      blocked: threatsBlocked,
      scanned: Math.max(prev.scanned, totalScanned)
    }));
  }, [threatsBlocked, totalScanned]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveStats(prev => ({
        ...prev,
        scanned: prev.scanned + Math.floor(Math.random() * 3),
        messages: prev.messages + Math.floor(Math.random() * 2),
        calls: prev.calls + (Math.random() > 0.8 ? 1 : 0),
      }));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const safePercentage = Math.round((safeCount / Math.max(1, totalScanned)) * 100);

  return (
    <div className="space-y-5 pb-24">
      {/* Header */}
      <motion.div
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-2xl font-bold font-heading">SpamGuard</h1>
          <p className="text-sm text-muted-foreground">Protection status: <span className="text-primary font-medium">Active</span></p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 pulse-dot">
          <Activity className="h-5 w-5 text-primary" />
        </div>
      </motion.div>

      {/* Protection Score */}
      <motion.div
        className="glass-card p-6 glow-green"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center gap-6">
          <div className="relative flex h-32 w-32 shrink-0 items-center justify-center">
            <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="hsl(220 14% 18%)" strokeWidth="10" />
              <motion.circle
                cx="50" cy="50" r="45" fill="none"
                stroke="hsl(142 71% 45%)" strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={`${safePercentage * 2.827} ${282.7 - safePercentage * 2.827}`}
                initial={{ strokeDasharray: "0 282.7" }}
                animate={{ strokeDasharray: `${safePercentage * 2.827} ${282.7 - safePercentage * 2.827}` }}
                transition={{ delay: 0.5, duration: 1.2, ease: "easeOut" }}
              />
            </svg>
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl font-bold font-heading text-primary m-0 p-0 leading-none">{safePercentage}%</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold font-heading">Protection Score</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {threatsBlocked} threats blocked out of {totalScanned} items scanned
            </p>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard icon={Shield} label="Threats Blocked" value={liveStats.blocked} color="bg-danger/10 text-danger" delay={0.2} />
        <StatCard icon={TrendingUp} label="Total Scanned" value={liveStats.scanned} color="bg-primary/10 text-primary" delay={0.25} />
        <StatCard icon={MessageSquare} label="Messages" value={liveStats.messages} color="bg-warning/10 text-warning" delay={0.3} />
        <StatCard icon={Phone} label="Calls" value={liveStats.calls} color="bg-accent/10 text-accent" delay={0.35} />
      </div>

      {/* Weekly Chart */}
      <motion.div
        className="glass-card p-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="mb-4 text-sm font-semibold font-heading">Weekly Activity</h3>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={weeklyData} barGap={2}>
            <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'hsl(215 12% 55%)' }} axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip
              contentStyle={{
                background: 'hsl(220 18% 10%)',
                border: '1px solid hsl(220 14% 18%)',
                borderRadius: '12px',
                fontSize: '12px',
              }}
            />
            <Bar dataKey="safe" fill="hsl(142 71% 45%)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="threats" fill="hsl(0 72% 51%)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-primary" /> Safe
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-danger" /> Threats
          </span>
        </div>
      </motion.div>

      {/* Risk Breakdown */}
      <motion.div
        className="glass-card p-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h3 className="mb-3 text-sm font-semibold font-heading">Risk Breakdown</h3>
        <div className="space-y-3">
          {([
            { label: 'Safe', value: safeCount, total: totalScanned, color: 'bg-primary' },
            { label: 'Suspicious', value: suspiciousCount, total: totalScanned, color: 'bg-warning' },
            { label: 'Dangerous', value: dangerousCount, total: totalScanned, color: 'bg-danger' },
          ]).map(({ label, value, total, color }) => (
            <div key={label}>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-muted-foreground">{label}</span>
                <span className="font-mono font-medium">{value}</span>
              </div>
              <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${color}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${(value / Math.max(1, total)) * 100}%` }}
                  transition={{ delay: 0.7, duration: 0.8 }}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Live Activity Feed */}
      <motion.div
        className="glass-card p-5 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold font-heading flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Live Scan Activity
          </h3>
        </div>
        
        <div className="space-y-3">
          {threats.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground text-sm">
              <Shield className="h-8 w-8 mx-auto mb-2 opacity-20" />
              Scanning for threats...
            </div>
          ) : (
            threats.slice(0, 3).map((threat, index) => (
              <motion.div 
                key={threat.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + (index * 0.1) }}
                className={`flex items-start gap-3 p-3 rounded-lg border ${
                  threat.riskLevel === 'dangerous' ? 'border-danger/20 bg-danger/5' :
                  threat.riskLevel === 'suspicious' ? 'border-warning/20 bg-warning/5' :
                  'border-primary/20 bg-primary/5'
                }`}
              >
                <div className="mt-0.5 text-lg">
                  {threat.type === 'sms' ? '💬' : threat.type === 'email' ? '📧' : threat.type === 'call' ? '📞' : '📱'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="text-xs font-medium truncate">{threat.sender}</p>
                    <span className="text-[10px] text-muted-foreground">Recent</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{threat.content}</p>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardScreen;
