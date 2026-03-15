export interface ThreatItem {
  id: string;
  type: 'sms' | 'call' | 'whatsapp' | 'email' | 'instagram' | 'facebook';
  sender: string;
  content: string;
  riskScore: number; // 0-100
  riskLevel: 'safe' | 'suspicious' | 'dangerous';
  timestamp: Date;
  status: 'pending' | 'blocked' | 'ignored' | 'reported';
  keywords: string[];
}

export const mockThreats: ThreatItem[] = [
  {
    id: '1',
    type: 'sms',
    sender: '+1-800-555-0199',
    content: 'URGENT: Your bank account has been compromised! Click here to verify: http://b4nk-secure.xyz/verify',
    riskScore: 95,
    riskLevel: 'dangerous',
    timestamp: new Date(Date.now() - 120000),
    status: 'pending',
    keywords: ['URGENT', 'bank account', 'compromised', 'suspicious URL'],
  },
  {
    id: '2',
    type: 'whatsapp',
    sender: 'Unknown (+44 7911 123456)',
    content: 'Congratulations! You won a $10,000 Amazon gift card. Claim now before it expires: bit.ly/amzn-prize',
    riskScore: 88,
    riskLevel: 'dangerous',
    timestamp: new Date(Date.now() - 300000),
    status: 'pending',
    keywords: ['Congratulations', 'won', 'gift card', 'shortened URL'],
  },
  {
    id: '3',
    type: 'email',
    sender: 'security@paypa1-support.com',
    content: 'Your PayPal account will be suspended in 24 hours. Verify your identity immediately.',
    riskScore: 92,
    riskLevel: 'dangerous',
    timestamp: new Date(Date.now() - 600000),
    status: 'pending',
    keywords: ['suspended', 'verify identity', 'spoofed domain'],
  },
  {
    id: '4',
    type: 'call',
    sender: '+1-202-555-0147',
    content: 'Incoming call from suspected IRS scam number. This number has been reported 347 times.',
    riskScore: 78,
    riskLevel: 'suspicious',
    timestamp: new Date(Date.now() - 900000),
    status: 'pending',
    keywords: ['IRS scam', 'reported number'],
  },
  {
    id: '5',
    type: 'instagram',
    sender: '@crypto_wealth_guru',
    content: 'DM: Hey! I made $50k in one week with this crypto bot. Send me $200 to get started 🚀💰',
    riskScore: 82,
    riskLevel: 'dangerous',
    timestamp: new Date(Date.now() - 1800000),
    status: 'pending',
    keywords: ['crypto', 'send money', 'get rich quick'],
  },
  {
    id: '6',
    type: 'sms',
    sender: 'Amazon',
    content: 'Your order #123-456 has shipped. Track: amazon.com/track/123456',
    riskScore: 8,
    riskLevel: 'safe',
    timestamp: new Date(Date.now() - 3600000),
    status: 'ignored',
    keywords: [],
  },
  {
    id: '7',
    type: 'facebook',
    sender: 'Mark Johnson',
    content: 'Message: Check out this video of you! 😂 Click here → fb-vid-viewer.ru/watch',
    riskScore: 90,
    riskLevel: 'dangerous',
    timestamp: new Date(Date.now() - 5400000),
    status: 'blocked',
    keywords: ['suspicious URL', 'clickbait', '.ru domain'],
  },
  {
    id: '8',
    type: 'sms',
    sender: '+1-555-0123',
    content: 'Hey, are we still meeting for lunch tomorrow at noon?',
    riskScore: 3,
    riskLevel: 'safe',
    timestamp: new Date(Date.now() - 7200000),
    status: 'ignored',
    keywords: [],
  },
];

export const dashboardStats = {
  totalScanned: 1247,
  threatsBlocked: 89,
  messagesAnalyzed: 856,
  callsMonitored: 391,
  riskBreakdown: {
    safe: 1089,
    suspicious: 69,
    dangerous: 89,
  },
  weeklyData: [
    { day: 'Mon', threats: 12, safe: 156 },
    { day: 'Tue', threats: 8, safe: 178 },
    { day: 'Wed', threats: 15, safe: 142 },
    { day: 'Thu', threats: 6, safe: 190 },
    { day: 'Fri', threats: 19, safe: 168 },
    { day: 'Sat', threats: 11, safe: 134 },
    { day: 'Sun', threats: 18, safe: 121 },
  ],
};
