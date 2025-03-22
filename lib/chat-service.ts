import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

// For browser environment, we'll use localStorage to store chat history
// This is a simplified approach - for a production app, you'd want a proper backend
interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  createdAt: string; // ISO date string
}

const SYSTEM_TEMPLATE = `You are an empathetic and supportive mental health AI assistant. Your role is to:
1. Provide emotional support and understanding
2. Help users process their thoughts and feelings
3. Suggest healthy coping mechanisms
4. Recognize crisis situations and recommend professional help when needed
5. Maintain a warm, non-judgmental tone
6. Keep responses concise and focused

Important: You are not a replacement for professional mental health care. If users express serious concerns, always encourage them to seek professional help.

Previous conversation summary: {summary}`;

export class ChatService {
  private model: ChatOpenAI;
  
  constructor() {
    this.model = new ChatOpenAI({
      model: "gpt-4-turbo",
      apiKey: "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", // Use environment variable with NEXT_PUBLIC_ prefix for client-side
      temperature: 0.7,
    });
  }

  // Local storage helpers
  private getChatMessages(userId: string): ChatMessage[] {
    const storedMessages = localStorage.getItem(`chat_history_${userId}`);
    return storedMessages ? JSON.parse(storedMessages) : [];
  }

  private saveChatMessage(userId: string, message: ChatMessage) {
    const messages = this.getChatMessages(userId);
    messages.push(message);
    localStorage.setItem(`chat_history_${userId}`, JSON.stringify(messages));
  }

  private async getConversationSummary(userId: string): Promise<string> {
    const recentMessages = this.getChatMessages(userId).slice(-10);

    if (recentMessages.length === 0) {
      return "This is the first interaction with the user.";
    }

    const summaryPrompt = new SystemMessage({
      content: "Summarize the following conversation concisely, focusing on key emotional themes and important points:"
    });

    const conversationText = recentMessages
      .map(msg => `${msg.role}: ${msg.content}`)
      .join("\n");

    const response = await this.model.invoke([
      summaryPrompt,
      new HumanMessage({ content: conversationText }),
    ]);

    return response.content as string;
  }

  async sendMessage(userId: string, content: string): Promise<string> {
    try {
      // Save user message to local storage
      this.saveChatMessage(userId, {
        content,
        role: 'user',
        createdAt: new Date().toISOString(),
      });

      // Get conversation summary
      const summary = await this.getConversationSummary(userId);

      // Generate AI response with the actual summary inserted
      const systemPrompt = SYSTEM_TEMPLATE.replace('{summary}', summary);
      
      const response = await this.model.invoke([
        new SystemMessage({
          content: systemPrompt,
        }),
        new HumanMessage({ content }),
      ]);

      const responseContent = response.content as string;
      
      // Save AI response to local storage
      this.saveChatMessage(userId, {
        content: responseContent,
        role: 'assistant',
        createdAt: new Date().toISOString(),
      });

      return responseContent;
    } catch (error) {
      console.error('Error in chat service:', error);
      return "I apologize, but I'm having trouble processing your message right now. Please try again in a moment.";
    }
  }

  loadChatHistory(userId: string): Array<{ role: string; content: string; timestamp: Date }> {
    const messages = this.getChatMessages(userId);
    
    return messages.map(msg => ({
      role: msg.role,
      content: msg.content,
      timestamp: new Date(msg.createdAt),
    }));
  }
}