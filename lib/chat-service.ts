import { ChatOpenAI, OpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage, AIMessage } from "@langchain/core/messages";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
      apiKey: process.env.OPENAI_API_KEY,
      temperature: 0.7,
    });
  }

  private async getConversationSummary(userId: string): Promise<string> {
    const recentMessages = await prisma.chatMessage.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    if (recentMessages.length === 0) {
      return "This is the first interaction with the user.";
    }

    const summaryPrompt = new SystemMessage({
      content: "Summarize the following conversation concisely, focusing on key emotional themes and important points:"
    });

    const conversationText = recentMessages
      .reverse()
      .map(msg => `${msg.role}: ${msg.content}`)
      .join("\n");

    const response = await this.model.invoke([
      summaryPrompt,
      new HumanMessage({ content: conversationText }),
    ]);

    return response.content;
  }

  async sendMessage(userId: string, content: string): Promise<string> {
    try {
      // Get conversation summary
      const summary = await this.getConversationSummary(userId);

      // // // Save user message to database
      await prisma.chatMessage.create({
        data: {
          content,
          role: 'user',
          userId,
        },
      });

      // Generate AI response
      const response = await this.model.invoke([
        new SystemMessage({
          content: SYSTEM_TEMPLATE.replace("{summary}", summary),
        }),
        new HumanMessage({ content }),
      ]);

      console.log("AI response:", response);
      // Save AI response to database
      await prisma.chatMessage.create({
        data: {
          content: response.content as string,
          role: 'assistant',
          userId,
        },
      });

      return response.content;
    } catch (error) {
      console.error('Error in chat service:', error);
      return "I apologize, but I'm having trouble processing your message right now. Please try again in a moment.";
    }
  }

  async loadChatHistory(userId: string): Promise<Array<{ role: string; content: string; timestamp: Date }>> {
    const messages = await prisma.chatMessage.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
    });

    return messages.map(msg => ({
      role: msg.role,
      content: msg.content,
      timestamp: msg.createdAt,
    }));
  }
}