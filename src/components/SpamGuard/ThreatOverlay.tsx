import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Ban, EyeOff, Flag, X, Shield } from "lucide-react";
import { ThreatItem } from "@/data/mockData";

interface ThreatOverlayProps {
  threat: ThreatItem | null;
  onAction: (action: 'block' | 'ignore' | 'report') => void;
  onClose: () => void;
}

const typeIcons: Record<string, string> = {
  sms: '💬',
  call: '📞',
  whatsapp: '📱',
  email: '📧',
  instagram: '📸',
  facebook: '👤',
};

const ThreatOverlay = ({ threat, onAction, onClose }: ThreatOverlayProps) => {
  if (!threat) return null;

  const isDangerous = threat.riskLevel === 'dangerous';

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-background/80 backdrop-blur-md"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />

        {/* Card */}
        <motion.div
          className={`relative w-full max-w-sm rounded-3xl border p-6 ${
            isDangerous
              ? 'border-danger/30 bg-card glow-red'
              : 'border-warning/30 bg-card glow-yellow'
          }`}
          initial={{ scale: 0.8, y: 50, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.8, y: 50, opacity: 0 }}
          transition={{ type: "spring", damping: 20 }}
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full p-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Icon */}
          <div className="flex flex-col items-center text-center mb-6">
            <motion.div
              className={`mb-4 flex h-16 w-16 items-center justify-center rounded-2xl ${
                isDangerous ? 'bg-danger/10' : 'bg-warning/10'
              }`}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <AlertTriangle className={`h-8 w-8 ${isDangerous ? 'text-danger' : 'text-warning'}`} />
            </motion.div>

            <h2 className="text-lg font-bold font-heading">
              {isDangerous ? '⚠️ Dangerous Threat Detected' : '⚠️ Suspicious Activity'}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              This {threat.type} may be a phishing attempt
            </p>
          </div>

          {/* Details */}
          <div className="mb-6 space-y-3">
            <div className="flex items-center gap-3 rounded-xl bg-secondary/50 p-3">
              <span className="text-xl">{typeIcons[threat.type]}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">From</p>
                <p className="text-sm font-medium truncate">{threat.sender}</p>
              </div>
              <div className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                isDangerous
                  ? 'bg-danger/20 text-danger'
                  : 'bg-warning/20 text-warning'
              }`}>
                {threat.riskScore}%
              </div>
            </div>

            <div className="rounded-xl bg-secondary/50 p-3">
              <p className="text-xs text-muted-foreground mb-1">Message Content</p>
              <p className="text-sm leading-relaxed">{threat.content}</p>
            </div>

            {threat.keywords.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {threat.keywords.map((keyword, i) => (
                  <span key={i} className="rounded-full bg-danger/10 px-2.5 py-0.5 text-xs text-danger font-medium">
                    {keyword}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => onAction('block')}
              className="flex flex-col items-center gap-1.5 rounded-xl bg-danger/10 p-3 text-danger hover:bg-danger/20 transition-colors"
            >
              <Ban className="h-5 w-5" />
              <span className="text-xs font-semibold">Block</span>
            </button>
            <button
              onClick={() => onAction('ignore')}
              className="flex flex-col items-center gap-1.5 rounded-xl bg-secondary p-3 text-muted-foreground hover:bg-secondary/80 transition-colors"
            >
              <EyeOff className="h-5 w-5" />
              <span className="text-xs font-semibold">Ignore</span>
            </button>
            <button
              onClick={() => onAction('report')}
              className="flex flex-col items-center gap-1.5 rounded-xl bg-warning/10 p-3 text-warning hover:bg-warning/20 transition-colors"
            >
              <Flag className="h-5 w-5" />
              <span className="text-xs font-semibold">Report</span>
            </button>
          </div>

          {/* Privacy badge */}
          <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <Shield className="h-3 w-3" />
            <span>Analyzed on-device • No data sent to cloud</span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ThreatOverlay;
