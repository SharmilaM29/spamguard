import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Search, CheckCircle, AlertTriangle, MessageSquare, AlertCircle } from "lucide-react";

import { ThreatItem } from "@/data/mockData";

// Training dataset provided by user
const trainingData = [
  { text: "CONGRATULATIONS!!! Your mobile number has WON ₹25,00,000 in the Mega Lucky Draw 2026. To claim your prize contact claimreward@fastwin.com or call +91-9876543210. Claim within 24 hours or your prize will be cancelled.", label: 'spam' },
  { text: "URGENT ALERT! Your bank account has been temporarily suspended due to suspicious activity. Verify your account immediately at http://secure-bank-verify-login.com to avoid permanent blocking.", label: 'spam' },
  { text: "Dear Customer, We detected an unusual login attempt on your account. Please confirm your OTP 482913 to secure your account.", label: 'spam' },
  { text: "You have been selected for a Work From Home job. Earn ₹30,000 per week without experience. Register now at http://easyjob-fastincome.com. Limited seats available.", label: 'spam' },
  { text: "Instant Personal Loan Approved! Get up to ₹5,00,000 with zero documentation. Apply now at http://fastloan-now.com or call +91-9000000000.", label: 'spam' },
  { text: "Someone shared a private photo of you. View it before it gets deleted at http://hidden-photo-share.com.", label: 'spam' },
  { text: "Delivery Failed! Your parcel could not be delivered due to incorrect address. Update your details at http://parcel-update-delivery.com.", label: 'spam' },
  { text: "Hi, just checking in to see how you’re doing. Let me know if you’re free this evening so we can catch up.", label: 'ham' },
  { text: "Hello, I hope you are doing well. I am writing to confirm the meeting scheduled for tomorrow at 10 AM.", label: 'ham' },
  { text: "Dear Customer, Your order has been successfully placed and will be delivered within 3–5 business days. Thank you for shopping with us.", label: 'ham' },
  { text: "Hello, this is a reminder that your appointment is scheduled for tomorrow at 4:30 PM. Please arrive 10 minutes early.", label: 'ham' },
  { text: "Hey, are you coming to the event today? Let me know your plan.", label: 'ham' }
];

// Extract distinct keywords for naive matching
const extractWords = (text: string) => text.toLowerCase().match(/\b\w{3,}\b/g) || [];

const spamWords = new Set<string>();
const hamWords = new Set<string>();

trainingData.forEach(item => {
  const words = extractWords(item.text);
  words.forEach(w => {
    if (item.label === 'spam') spamWords.add(w);
    else hamWords.add(w);
  });
});

// Remove common words that appear in both
const exclusiveSpamWords = Array.from(spamWords).filter(w => !hamWords.has(w));
const suspiciousDomains = ['.xyz', '.ru', 'bit.ly', 'tinyurl', '.tk', 'free-', 'login', 'update'];

// Regex patterns for specific scam types
const scamPatterns = [
  { regex: /(?:rs\.?|₹)\s*\d+(?:,\d+)*(?:\.\d+)?/i, name: 'large sum of money', weight: 20 },
  { regex: /otp\s*[:\-]?\s*\d{4,8}/i, name: 'otp sharing request', weight: 25 },
  { regex: /(?:click|visit|apply|register|update|verify|view).*(?:here|now|link)/i, name: 'urgent call to action', weight: 15 },
  { regex: /\+91[\-\s]?\d{10}/i, name: 'unverified contact number', weight: 10 },
  { regex: /(?:delivery|parcel).*(?:failed|incorrect|update|address)/i, name: 'unusual delivery notice', weight: 15 },
  { regex: /(?:work from home|part time).*(?:earn|salary|income)/i, name: 'unusual job offer', weight: 15 },
];

interface ScanResult {
  score: number;
  level: 'safe' | 'suspicious' | 'dangerous';
  detectedKeywords: string[];
}

interface ScannerScreenProps {
  onScanComplete?: (threat: ThreatItem) => void;
  resetTrigger?: number;
}

const ScannerScreen = ({ onScanComplete, resetTrigger }: ScannerScreenProps) => {
  const [inputText, setInputText] = useState("");
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const autoResize = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // Reset height
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Set to scrollheight
    }
  };

  useEffect(() => {
    // Initial resize if there's default text (not applicable right now but good practice)
    autoResize();
  }, [inputText]);

  // Listen for external reset triggers (e.g., from Index.tsx when overlay closes)
  useEffect(() => {
    setInputText("");
    setResult(null);
    if (textareaRef.current) {
      textareaRef.current.style.height = '128px';
    }
  }, [resetTrigger]);

  const analyzeText = (text: string): ScanResult => {
    const lowerText = text.toLowerCase();
    let score = 0;
    const detected: string[] = [];

    const words = extractWords(text);
    
    // 1. Dataset-based Keyword Analysis
    let spamMatches = 0;
    words.forEach(word => {
      if (exclusiveSpamWords.includes(word)) {
        spamMatches++;
        if (!detected.includes(word)) detected.push(word);
      }
    });

    // Each exclusive spam word adds 12% to the score
    score += Math.min(spamMatches * 12, 50);

    // 2. Exact match check
    const isExactHam = trainingData.some(d => d.label === 'ham' && d.text.toLowerCase() === lowerText);
    const isExactSpam = trainingData.some(d => d.label === 'spam' && d.text.toLowerCase() === lowerText);

    if (isExactHam) {
      return { score: 0, level: 'safe', detectedKeywords: [] };
    }
    if (isExactSpam) {
      score += 50;
      if (!detected.includes('known spam template')) detected.push('known spam template');
    }

    // Check specific scam patterns (Regex)
    scamPatterns.forEach(pattern => {
      if (pattern.regex.test(text)) {
        score += pattern.weight;
        if (!detected.includes(pattern.name)) detected.push(pattern.name);
      }
    });

    // Check suspicious URLs
    const urlMatches = text.match(/(https?:\/\/[^\s]+)/g) || [];
    if (urlMatches.length > 0) {
      score += 15; // Increased base penalty for URLs
      urlMatches.forEach(url => {
        const lowerUrl = url.toLowerCase();
        
        // Check for insecure HTTP protocol
        if (lowerUrl.startsWith('http://')) {
          score += 35;
          if (!detected.includes('insecure http link')) detected.push('insecure http link');
        }

        suspiciousDomains.forEach(domain => {
          if (lowerUrl.includes(domain)) {
            score += 30;
            if (!detected.includes('suspicious link')) detected.push('suspicious link');
          }
        });
      });
    }

    // Urgency indicators (all caps)
    const capsWords = text.match(/\b[A-Z]{4,}\b/g) || [];
    if (capsWords.length > 1) {
      score += 10;
      if (!detected.includes('caps lock shouting')) detected.push('caps lock shouting');
    }

    score = Math.min(score, 100);

    let level: 'safe' | 'suspicious' | 'dangerous' = 'safe';
    if (score >= 70) level = 'dangerous';
    else if (score >= 30) level = 'suspicious';
    else if (score === 0) score = Math.floor(Math.random() * 5); // Add jitter for "safe" texts

    return { score, level, detectedKeywords: detected };
  };

  const handleScan = () => {
    if (!inputText.trim()) return;
    
    setScanning(true);
    setResult(null);

    // Simulate processing time
    setTimeout(() => {
      const scanRes = analyzeText(inputText);
      setResult(scanRes);
      setScanning(false);
      
      if (onScanComplete) {
        const newThreat: ThreatItem = {
          id: `scan-${Date.now()}`,
          type: 'sms',
          sender: 'Manual Scan',
          content: inputText,
          riskScore: scanRes.score,
          riskLevel: scanRes.level,
          timestamp: new Date(),
          status: 'pending',
          keywords: scanRes.detectedKeywords,
        };
        onScanComplete(newThreat);
      }
    }, 1500);
  };

  return (
    <div className="space-y-6 pb-24">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-bold font-heading">AI Text Scanner</h1>
        <p className="text-sm text-muted-foreground">Paste any message or URL to analyze its threat level.</p>
      </motion.div>

      <motion.div
        className="glass-card p-5 space-y-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Message Content
          </label>
          <textarea
            ref={textareaRef}
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              autoResize();
            }}
            placeholder="e.g., URGENT: Your account has been suspended! Verify here: suspicious-link.xyz"
            className="w-full min-h-[128px] max-h-[400px] overflow-y-auto overflow-x-hidden p-3 bg-secondary/50 rounded-xl border-none outline-none resize-none focus:ring-1 focus:ring-primary text-sm transition-all [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            disabled={scanning}
            style={{ minHeight: '128px' }}
          />
        </div>

        <button
          onClick={handleScan}
          disabled={!inputText.trim() || scanning}
          className="w-full rounded-xl bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {scanning ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="h-4 w-4 rounded-full border-2 border-primary-foreground border-t-transparent"
              />
              Analyzing...
            </>
          ) : (
            <>
              <Search className="h-4 w-4" />
              Scan Now
            </>
          )}
        </button>
      </motion.div>

      {/* Results */}
      <AnimatePresence mode="wait">
        {result && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`glass-card p-6 border ${
              result.level === 'dangerous' ? 'border-danger/30 glow-red' :
              result.level === 'suspicious' ? 'border-warning/30 glow-yellow' :
              'border-primary/30 glow-green'
            }`}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className={`p-3 rounded-full ${
                result.level === 'dangerous' ? 'bg-danger/10 text-danger' :
                result.level === 'suspicious' ? 'bg-warning/10 text-warning' :
                'bg-primary/10 text-primary'
              }`}>
                {result.level === 'dangerous' ? <AlertTriangle className="h-8 w-8" /> :
                 result.level === 'suspicious' ? <AlertCircle className="h-8 w-8" /> :
                 <CheckCircle className="h-8 w-8" />}
              </div>
              <div>
                <h3 className="text-lg font-bold capitalize">{result.level} Content</h3>
                <p className="text-sm text-muted-foreground">Threat Score: {result.score}%</p>
              </div>
            </div>

            {result.detectedKeywords.length > 0 ? (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase">Risk Factors Detected</p>
                <div className="flex flex-wrap gap-2">
                  {result.detectedKeywords.map((kw, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-full bg-secondary text-xs capitalize text-muted-foreground font-medium">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/30 p-3 rounded-lg">
                <Shield className="h-4 w-4 text-primary" />
                No known threat signatures detected.
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ScannerScreen;
