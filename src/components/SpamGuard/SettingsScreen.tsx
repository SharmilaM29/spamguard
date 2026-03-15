import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Bell, Lock, Eye, Smartphone, Zap, ChevronRight, ToggleLeft, ToggleRight, Info } from "lucide-react";

interface SettingToggle {
  id: string;
  label: string;
  description: string;
  icon: any;
  defaultOn: boolean;
}

const settings: SettingToggle[] = [
  { id: 'sms', label: 'SMS Protection', description: 'Monitor incoming SMS for spam', icon: Smartphone, defaultOn: true },
  { id: 'calls', label: 'Call Monitoring', description: 'Warn about suspicious callers', icon: Shield, defaultOn: true },
  { id: 'notifications', label: 'App Notifications', description: 'Scan WhatsApp, Instagram, Facebook', icon: Bell, defaultOn: true },
  { id: 'realtime', label: 'Real-Time Analysis', description: 'Analyze messages as they arrive', icon: Zap, defaultOn: true },
  { id: 'privacy', label: 'Privacy Mode', description: 'Extra encryption for stored data', icon: Lock, defaultOn: false },
];

const appOverlays: SettingToggle[] = [
  { id: 'whatsapp_overlay', label: 'WhatsApp', description: 'Draw over WhatsApp when a threat is detected', icon: Eye, defaultOn: true },
  { id: 'facebook_overlay', label: 'Facebook', description: 'Draw over Facebook when a threat is detected', icon: Eye, defaultOn: false },
  { id: 'instagram_overlay', label: 'Instagram', description: 'Draw over Instagram when a threat is detected', icon: Eye, defaultOn: false },
];

const permissions = [
  { label: 'READ_SMS', status: 'granted' },
  { label: 'RECEIVE_SMS', status: 'granted' },
  { label: 'READ_CALL_LOG', status: 'granted' },
  { label: 'SYSTEM_ALERT_WINDOW', status: 'granted' },
  { label: 'NOTIFICATION_LISTENER', status: 'pending' },
];

const SettingsScreen = () => {
  const [toggles, setToggles] = useState<Record<string, boolean>>(
    Object.fromEntries([...settings, ...appOverlays].map(s => [s.id, s.defaultOn]))
  );

  const toggle = (id: string) => setToggles(prev => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="space-y-6 pb-24">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-bold font-heading">Settings</h1>
        <p className="text-sm text-muted-foreground">Configure your protection</p>
      </motion.div>

      {/* Protection toggles */}
      <div className="space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Protection Features</h3>
        {settings.map((setting, i) => (
          <motion.div
            key={setting.id}
            className="glass-card p-4 flex items-center gap-3"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
              <setting.icon className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{setting.label}</p>
              <p className="text-xs text-muted-foreground">{setting.description}</p>
            </div>
            <button onClick={() => toggle(setting.id)} className="transition-colors">
              {toggles[setting.id] ? (
                <ToggleRight className="h-7 w-7 text-primary" />
              ) : (
                <ToggleLeft className="h-7 w-7 text-muted-foreground" />
              )}
            </button>
          </motion.div>
        ))}
      </div>

      {/* App Overlay Permissions */}
      <div className="space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
          <span>App Overlay Permissions</span>
          <span className="text-[10px] bg-secondary px-2 py-0.5 rounded-full text-primary">Required for popups</span>
        </h3>
        {appOverlays.map((app, i) => (
          <motion.div
            key={app.id}
            className={`glass-card p-4 flex items-center gap-3 transition-colors ${toggles[app.id] ? 'border-primary/30 bg-primary/5' : ''}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + (i * 0.04) }}
          >
            <div className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${toggles[app.id] ? 'bg-primary/20 text-primary' : 'bg-secondary text-muted-foreground'}`}>
              <app.icon className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{app.label}</p>
              <p className="text-xs text-muted-foreground">{app.description}</p>
            </div>
            <button onClick={() => toggle(app.id)} className="transition-colors">
              {toggles[app.id] ? (
                <ToggleRight className="h-7 w-7 text-primary" />
              ) : (
                <ToggleLeft className="h-7 w-7 text-muted-foreground" />
              )}
            </button>
          </motion.div>
        ))}
      </div>

      {/* Permissions */}
      <div className="space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Permissions</h3>
        {permissions.map((perm, i) => (
          <motion.div
            key={perm.label}
            className="glass-card p-3 flex items-center justify-between"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 + i * 0.04 }}
          >
            <span className="text-xs font-mono text-muted-foreground">{perm.label}</span>
            <span className={`text-[10px] font-bold uppercase ${
              perm.status === 'granted' ? 'text-primary' : 'text-warning'
            }`}>
              {perm.status}
            </span>
          </motion.div>
        ))}
      </div>

      {/* AI Info */}
      <motion.div
        className="glass-card p-4 border-primary/20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium">On-Device AI</p>
            <p className="text-xs text-muted-foreground mt-1">
              SpamGuard uses TensorFlow Lite for on-device spam classification. All processing happens locally — your messages never leave your device.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Version */}
      <div className="text-center text-xs text-muted-foreground pt-2">
        <p>SpamGuard v1.0.0 (Prototype)</p>
        <p className="mt-0.5">Built with privacy-first architecture</p>
      </div>
    </div>
  );
};

export default SettingsScreen;
