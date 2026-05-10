import { prisma } from "../../../lib/prisma";
import { AppError } from "@/app/errorHelpers/AppError";
import httpStatus from "http-status";
import { GoogleGenAI } from "@google/genai";
import { envVars } from "../../../config/env";

// Initialize AI services
const genAI = new GoogleGenAI({ apiKey: envVars.GEMINI_API_KEY });

// Intent patterns for NLP
interface IntentPattern {
  keywords: string[];
  responses?: string[];
  action?: string;
}

const INTENT_PATTERNS: Record<string, IntentPattern> = {
  PASSWORD_RESET: {
    keywords: ['password', 'reset', 'forgot', 'login', 'sign', 'access', 'account'],
    responses: [
      "To reset your password: 1) Click 'Forgot Password' on login page 2) Enter your email 3) Check your email for reset link 4) Create new password",
      "I can help you reset your password. Go to the login page and click 'Forgot Password'. Follow the email instructions to set a new password."
    ]
  },
  APPLICATION_STATUS: {
    keywords: ['application', 'status', 'applied', 'job', 'application'],
    responses: [
      "To check your application status: 1) Login to your account 2) Go to 'My Applications' 3) View status for each job applied",
      "You can track all your applications in your dashboard under 'My Applications'. Each application shows its current status."
    ]
  },
  JOB_POSTING: {
    keywords: ['post', 'job', 'create', 'listing', 'publish', 'recruit'],
    responses: [
      "To post a job: 1) Login as recruiter 2) Click 'Post New Job' 3) Fill job details 4) Review and publish",
      "Job posting is available for recruiters. Fill in job title, description, requirements, and salary to publish your listing."
    ]
  },
  PROFILE_UPDATE: {
    keywords: ['profile', 'update', 'edit', 'change', 'information'],
    responses: [
      "To update your profile: 1) Go to 'Profile' section 2) Click 'Edit Profile' 3) Make changes 4) Save updates",
      "Your profile can be updated anytime. Navigate to your profile page and use the edit option to modify your information."
    ]
  },
  BILLING: {
    keywords: ['payment', 'billing', 'charge', 'cost', 'price', 'subscription'],
    responses: [
      "For billing questions: 1) Go to 'Billing' section 2) View invoice history 3) Update payment methods 4) Contact support for billing issues",
      "Billing information is available in your account dashboard. You can view charges, update payment methods, and download invoices."
    ]
  },
  TECHNICAL_ISSUE: {
    keywords: ['error', 'problem', 'issue', 'broken', 'not working', 'bug'],
    responses: [
      "For technical issues: 1) Clear browser cache 2) Try different browser 3) Check internet connection 4) Contact support if issue persists",
      "I understand you're experiencing technical difficulties. Try basic troubleshooting first, then reach out to our technical support team."
    ]
  },
  ESCALATION_TRIGGERS: {
    keywords: ['urgent', 'emergency', 'hacked', 'security', 'illegal', 'legal', 'complaint'],
    action: 'ESCALATE'
  }
};

interface ChatMessage {
  id: string;
  sessionId: string;
  message: string;
  isUser: boolean;
  timestamp: Date;
  intent?: string;
  confidence?: number;
}

interface SupportSession {
  id: string;
  userId?: string;
  messages: ChatMessage[];
  status: 'ACTIVE' | 'RESOLVED' | 'ESCALATED';
  createdAt: Date;
  updatedAt: Date;
}

interface KnowledgeBaseArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  relevanceScore?: number;
}

interface BotResponse {
  message: string;
  intent: string;
  confidence: number;
  suggestedActions: string[];
  escalated: boolean;
  articles?: KnowledgeBaseArticle[];
}

export const SupportAgentService = {
  // Process user message and generate response
  processMessage: async (
    message: string,
    sessionId: string,
    userId?: string
  ): Promise<BotResponse> => {
    try {
      // 1. Detect intent using pattern matching
      const detectedIntent = detectIntent(message);

      // 2. Check for escalation triggers
      if (detectedIntent.intent === 'ESCALATION') {
        return await handleEscalation(message, sessionId, userId);
      }

      // 3. Generate AI-powered response
      const aiResponse = await generateAIResponse(message, detectedIntent);

      // 4. Search knowledge base for relevant articles
      const relevantArticles = await searchKnowledgeBase(message, detectedIntent.intent);

      // 5. Save conversation
      await saveConversation(sessionId, message, aiResponse.message, true, detectedIntent.intent, detectedIntent.confidence);

      return {
        message: aiResponse.message,
        intent: detectedIntent.intent,
        confidence: detectedIntent.confidence,
        suggestedActions: aiResponse.suggestedActions,
        escalated: false,
        articles: relevantArticles,
      };
    } catch (error) {
      console.error('Support agent error:', error);
      throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Support agent processing failed");
    }
  },

  // Get or create support session
  getOrCreateSession: async (sessionId: string, userId?: string): Promise<SupportSession> => {
    let session = await prisma.supportSession.findUnique({
      where: { id: sessionId },
      include: { messages: true }
    });

    if (!session) {
      session = await prisma.supportSession.create({
        data: {
          id: sessionId,
          userId,
          status: 'ACTIVE'
        },
        include: { messages: true }
      });
    }

    return session as unknown as SupportSession;
  },

  // Get session history
  getSessionHistory: async (sessionId: string): Promise<ChatMessage[]> => {
    const messages = await prisma.chatMessage.findMany({
      where: { sessionId },
      orderBy: { timestamp: 'asc' }
    });
    return messages as unknown as ChatMessage[];
  },

  // Get support statistics
  getStats: async () => {
    const totalSessions = await prisma.supportSession.count();
    const activeSessions = await prisma.supportSession.count({ where: { status: 'ACTIVE' } });
    const resolvedSessions = await prisma.supportSession.count({ where: { status: 'RESOLVED' } });
    const escalatedSessions = await prisma.supportSession.count({ where: { status: 'ESCALATED' } });

    const resolutionRate = totalSessions > 0 ? ((resolvedSessions / totalSessions) * 100).toFixed(1) : "0.0";

    return {
      totalSessions,
      activeSessions,
      resolvedSessions,
      escalatedSessions,
      resolutionRate: `${resolutionRate}%`,
      avgResponseTime: await getAverageResponseTime(),
    };
  },

  // Get active sessions
  getActiveSessions: async () => {
    const sessions = await prisma.supportSession.findMany({
      where: { status: { in: ['ACTIVE', 'ESCALATED'] } },
      include: {
        user: { select: { name: true, role: true } },
        ticket: true,
      },
      orderBy: { updatedAt: 'desc' },
      take: 20
    });

    return sessions.map((s: any) => ({
      id: s.id,
      user: s.user?.name || 'Anonymous',
      role: s.user?.role || 'Guest',
      issue: s.ticket?.reason || 'General Inquiry',
      handledBy: s.status === 'ESCALATED' ? 'Human' : 'AI Agent',
      status: s.status === 'ESCALATED' ? (s.ticket?.priority === 'URGENT' ? 'Critical' : 'In Progress') : 'In Progress',
      updatedAt: s.updatedAt
    }));
  },

  // Escalate to human support
  escalateToHuman: async (sessionId: string, reason: string, userId?: string) => {
    const session = await prisma.supportSession.update({
      where: { id: sessionId },
      data: { status: 'ESCALATED' }
    });

    const ticket = await prisma.supportTicket.create({
      data: {
        sessionId,
        userId,
        reason,
        status: 'OPEN',
        priority: 'HIGH'
      }
    });

    return ticket;
  },

  // Add knowledge base article
  addKnowledgeArticle: async (article: Omit<KnowledgeBaseArticle, 'id'>) => {
    const newArticle = await prisma.knowledgeBaseArticle.create({
      data: {
        title: article.title,
        content: article.content,
        category: article.category,
        tags: article.tags
      }
    });
    return newArticle;
  },

  // Search knowledge base
  searchKnowledgeBase: async (query: string, category?: string) => {
    return await searchKnowledgeBase(query, category);
  },
};

// Helper functions
function detectIntent(message: string): { intent: string; confidence: number } {
  const lowerMessage = message.toLowerCase();
  let bestMatch = { intent: 'GENERAL', confidence: 0 };

  // Check escalation triggers first
  for (const [intent, pattern] of Object.entries(INTENT_PATTERNS)) {
    if (pattern.action === 'ESCALATE') {
      const matchCount = pattern.keywords.filter(keyword =>
        lowerMessage.includes(keyword.toLowerCase())
      ).length;

      if (matchCount > 0) {
        return { intent: 'ESCALATION', confidence: 0.9 };
      }
    }
  }

  // Check other intents
  for (const [intent, pattern] of Object.entries(INTENT_PATTERNS)) {
    if (pattern.action !== 'ESCALATE') {
      const matchCount = pattern.keywords.filter(keyword =>
        lowerMessage.includes(keyword.toLowerCase())
      ).length;

      const confidence = matchCount / pattern.keywords.length;

      if (confidence > bestMatch.confidence && confidence > 0.3) {
        bestMatch = { intent, confidence };
      }
    }
  }

  return bestMatch;
}

async function generateAIResponse(message: string, intent: { intent: string; confidence: number }) {
  // Use predefined responses for high-confidence matches
  if (intent.confidence > 0.7 && INTENT_PATTERNS[intent.intent as keyof typeof INTENT_PATTERNS]) {
    const pattern = INTENT_PATTERNS[intent.intent as keyof typeof INTENT_PATTERNS];
    if (pattern.responses) {
      const responseIndex = Math.floor(Math.random() * pattern.responses.length);
      return {
        message: pattern.responses[responseIndex],
        suggestedActions: getSuggestedActions(intent.intent),
      };
    }
  }

  // Use Gemini AI for complex or low-confidence queries
  try {
    const prompt = `You are a helpful support assistant for a job platform called JobsPark. 
    Respond to this user query professionally and concisely: "${message}"
    
    Keep responses under 150 words and be helpful. Focus on job platform related questions.`;

    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return {
      message: response.text || "I'm here to help! Could you provide more details about your question?",
      suggestedActions: getSuggestedActions(intent.intent),
    };
  } catch (error) {
    // Fallback response
    return {
      message: "I'm here to help! Could you provide more details about your question?",
      suggestedActions: ["Contact support", "Search help center"],
    };
  }
}

function getSuggestedActions(intent: string): string[] {
  const actionMap: Record<string, string[]> = {
    PASSWORD_RESET: ["Reset password", "Contact support"],
    APPLICATION_STATUS: ["View applications", "Contact recruiter"],
    JOB_POSTING: ["Post new job", "View job templates"],
    PROFILE_UPDATE: ["Edit profile", "Preview profile"],
    BILLING: ["View billing", "Update payment"],
    TECHNICAL_ISSUE: ["Clear cache", "Contact technical support"],
    GENERAL: ["Browse help center", "Contact support"],
  };

  return actionMap[intent] || actionMap.GENERAL;
}

async function searchKnowledgeBase(query: string, intent?: string): Promise<KnowledgeBaseArticle[]> {
  // Search the actual knowledge base in the database
  const articles = await prisma.knowledgeBaseArticle.findMany();
  
  if (articles.length === 0) {
    // Return sample articles if empty
    return [
      {
        id: "1",
        title: "How to reset your password",
        content: "Step-by-step guide to reset your password securely...",
        category: "Account",
        tags: ["password", "reset", "account"],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "2",
        title: "Job application process",
        content: "Complete guide to applying for jobs on our platform...",
        category: "Applications",
        tags: ["application", "jobs", "process"],
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ] as unknown as KnowledgeBaseArticle[];
  }

  return articles.filter(article =>
    article.tags.some(tag => query.toLowerCase().includes(tag.toLowerCase())) ||
    article.category.toLowerCase() === intent?.toLowerCase()
  ).slice(0, 3) as unknown as KnowledgeBaseArticle[];
}

async function handleEscalation(message: string, sessionId: string, userId?: string): Promise<BotResponse> {
  await SupportAgentService.escalateToHuman(sessionId, message, userId);

  return {
    message: "I've detected that you need immediate assistance. A human support agent will be with you shortly. This has been marked as high priority.",
    intent: 'ESCALATION',
    confidence: 1.0,
    suggestedActions: ["Wait for agent", "Call support hotline"],
    escalated: true,
  };
}

async function saveConversation(
  sessionId: string,
  userMessage: string,
  botMessage: string,
  isUser: boolean,
  intent?: string,
  confidence?: number
) {
  // Ensure session exists
  await SupportAgentService.getOrCreateSession(sessionId);

  // Save user message
  await prisma.chatMessage.create({
    data: {
      sessionId,
      message: userMessage,
      isUser: true,
    }
  });

  // Save bot response
  await prisma.chatMessage.create({
    data: {
      sessionId,
      message: botMessage,
      isUser: false,
      intent,
      confidence,
    }
  });
}

async function getAverageResponseTime(): Promise<string> {
  return "2 minutes";
}
