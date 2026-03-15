import { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle, Ban, Shield, Search, Filter } from "lucide-react";
import { ThreatItem } from "@/data/mockData";
import { cn } from "@/lib/utils";

interface ThreatsScreenProps {
  threats: ThreatItem[];
  onThreatClick: (threat: ThreatItem) => void;
}

const typeEmoji: Record<string, string> = {
  sms: '💬', call: '📞', whatsapp: '📱', email: '📧', instagram: '📸', facebook: '👤',
};

const formatTime = (date: Date) => {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

const ThreatsScreen = ({ threats, onThreatClick }: ThreatsScreenProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<'all' | 'dangerous' | 'suspicious' | 'safe'>('all');

  const filteredThreats = threats.filter(t => {
    const matchesSearch = t.sender.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'all' || t.riskLevel === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const pending = filteredThreats.filter(t => t.status === 'pending');
  const resolved = filteredThreats.filter(t => t.status !== 'pending');

  return (
    <div className="space-y-5 pb-24">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-bold font-heading">Threat Alerts</h1>
        <p className="text-sm text-muted-foreground">{pending.length} pending review</p>
      </motion.div>

      {/* Search and Filters */}
      <motion.div 
        className="space-y-3"
        initial={{ opacity: 0, y: -10 }} 
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search messages, senders, or urls..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-full bg-secondary/80 border-none text-sm focus:ring-1 focus:ring-primary transition-all"
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {(['all', 'dangerous', 'suspicious', 'safe'] as const).map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={cn(
                "px-4 py-1.5 rounded-full text-xs font-semibold capitalize whitespace-nowrap transition-colors border",
                activeFilter === filter 
                  ? filter === 'dangerous' ? 'bg-danger text-white border-danger'
                  : filter === 'suspicious' ? 'bg-warning text-white border-warning'
                  : filter === 'safe' ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-foreground text-background border-foreground'
                  : 'bg-transparent text-muted-foreground hover:bg-secondary border-border'
              )}
            >
              {filter}
            </button>
          ))}
        </div>
      </motion.div>

      {filteredThreats.length === 0 && (
        <div className="text-center py-10 text-muted-foreground">
          <Shield className="h-10 w-10 mx-auto mb-3 opacity-20" />
          <p className="text-sm">No threats match your search.</p>
        </div>
      )}

      {/* Pending */}
      {pending.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <AlertTriangle className="h-3.5 w-3.5 text-danger" /> Requires Action
          </h3>
          {pending.map((threat, i) => (
            <motion.button
              key={threat.id}
              className={cn(
                "w-full text-left glass-card p-4 transition-all hover:border-border",
                threat.riskLevel === 'dangerous' && 'border-danger/20 hover:border-danger/40',
                threat.riskLevel === 'suspicious' && 'border-warning/20 hover:border-warning/40',
              )}
              onClick={() => onThreatClick(threat)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="flex items-start gap-3">
                <span className="text-xl mt-0.5">{typeEmoji[threat.type]}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold truncate">{threat.sender}</p>
                    <div className={cn(
                      "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold",
                      threat.riskLevel === 'dangerous' ? 'bg-danger/20 text-danger' : 'bg-warning/20 text-warning'
                    )}>
                      {threat.riskScore}%
                    </div>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{threat.content}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="rounded-md bg-secondary px-1.5 py-0.5 text-[10px] font-medium uppercase text-muted-foreground">
                      {threat.type}
                    </span>
                    <span className="text-[10px] text-muted-foreground">{formatTime(threat.timestamp)}</span>
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      )}

      {/* Resolved */}
      {resolved.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <CheckCircle className="h-3.5 w-3.5 text-primary" /> Resolved
          </h3>
          {resolved.map((threat, i) => (
            <motion.div
              key={threat.id}
              className="glass-card p-4 opacity-60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 0.2 + i * 0.05 }}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{typeEmoji[threat.type]}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{threat.sender}</p>
                  <p className="text-xs text-muted-foreground truncate">{threat.content}</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  {threat.status === 'blocked' ? <Ban className="h-3.5 w-3.5" /> : <Shield className="h-3.5 w-3.5" />}
                  <span className="capitalize">{threat.status}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ThreatsScreen;
