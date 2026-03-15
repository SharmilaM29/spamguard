import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import SplashScreen from "@/components/SpamGuard/SplashScreen";
import DashboardScreen from "@/components/SpamGuard/DashboardScreen";
import ThreatsScreen from "@/components/SpamGuard/ThreatsScreen";
import ScannerScreen from "@/components/SpamGuard/ScannerScreen";
import SettingsScreen from "@/components/SpamGuard/SettingsScreen";
import BottomNav from "@/components/SpamGuard/BottomNav";
import ThreatOverlay from "@/components/SpamGuard/ThreatOverlay";
import { mockThreats, ThreatItem } from "@/data/mockData";

import { Shield } from "lucide-react";

// Removed MonitoringState per user request

const Index = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [threats, setThreats] = useState<ThreatItem[]>([]);
  const [selectedThreat, setSelectedThreat] = useState<ThreatItem | null>(null);
  const [simulatedThreat, setSimulatedThreat] = useState<ThreatItem | null>(null);
  const [scannerResetKey, setScannerResetKey] = useState(0);

  // We removed the automatic 5-second simulated threat on load based on user request.
  // The app will now only show threat overlays if actions are explicitly taken.
  useEffect(() => {
    if (showSplash) return;
    
    // Request notification permission on mount
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, [showSplash]);

  const handleThreatAction = useCallback((action: 'block' | 'ignore' | 'report') => {
    const target = selectedThreat || simulatedThreat;
    if (!target) return;

    const statusMap: Record<string, ThreatItem['status']> = {
      block: 'blocked', ignore: 'ignored', report: 'reported'
    };

    setThreats(prev => prev.map(t =>
      t.id === target.id ? { ...t, status: statusMap[action] } : t
    ));

    setSelectedThreat(null);
    setSimulatedThreat(null);
    setScannerResetKey(prev => prev + 1);

    const messages = {
      block: '🚫 Sender blocked successfully',
      ignore: '👁️ Threat marked as safe',
      report: '🚩 Reported as spam',
    };
    toast.success(messages[action]);
  }, [selectedThreat, simulatedThreat]);

  const handleClose = () => {
    setSelectedThreat(null);
    setSimulatedThreat(null);
    setScannerResetKey(prev => prev + 1);
  };

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  const hasActiveThreat = selectedThreat || simulatedThreat;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-lg px-4 pt-6">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && <DashboardScreen key="dashboard" threats={threats} />}
          {activeTab === 'threats' && (
            <ThreatsScreen
              key="threats"
              threats={threats}
              onThreatClick={setSelectedThreat}
            />
          )}
          {activeTab === 'scanner' && (
            <ScannerScreen 
              key="scanner" 
              resetTrigger={scannerResetKey}
              onScanComplete={(threat) => {
                setThreats(prev => [threat, ...prev]);
                if (threat.riskLevel === 'dangerous' || threat.riskLevel === 'suspicious') {
                  setSimulatedThreat(threat);
                }
              }}
            />
          )}
          {activeTab === 'settings' && <SettingsScreen key="settings" />}
        </AnimatePresence>
      </div>
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Threat Overlay pops up over essentially everything */}
      <ThreatOverlay
        threat={hasActiveThreat}
        onAction={handleThreatAction}
        onClose={handleClose}
      />
    </div>
  );
};

export default Index;
