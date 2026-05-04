import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding...");

  const hashed = await bcrypt.hash("Demo1234!", 12);

  const user = await prisma.user.upsert({
    where: { email: "demo@neuralchat.ai" },
    update: {},
    create: {
      email: "demo@neuralchat.ai",
      name: "Demo User",
      password: hashed,
      emailVerified: new Date(),
      preferences: {
        create: {
          defaultModel: "gpt-4o-mini",
          temperature: 0.7,
          maxTokens: 2048,
          theme: "dark",
          streamingEnabled: true
        }
      }
    }
  });

  await prisma.conversation.create({
    data: {
      userId: user.id,
      title: "Welcome to NeuralChat!",
      model: "llama-3.3-70b-versatile",
      messages: {
        createMany: {
          data: [
            { role: "user",      content: "What can you help me with?" },
            { role: "assistant", content: "I can help you with coding, writing, analysis, math, creative tasks and much more! Just ask me anything." }
          ]
        }
      }
    }
  });

  console.log("✅ Demo user created!");
  console.log("   Email:    demo@neuralchat.ai");
  console.log("   Password: Demo1234!");
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
