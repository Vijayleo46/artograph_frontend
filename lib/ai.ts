// lib/ai.ts (server)
import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;

// Mock mode: return fake data if API key is missing/invalid
const MOCK_MODE = !apiKey || apiKey.includes("xxxx") || apiKey.includes("your-real-key");

export const openai = MOCK_MODE ? null : new OpenAI({ apiKey });

// Mock assignment data for testing
const mockAssignmentResponses = [
  {
    title: "Identifying Negative Thought Patterns",
    taskDescription: "Spend 15 minutes today identifying three negative thoughts you had. Write them down and note what triggered each thought.",
    learningObjectives: "Learn to recognize automatic negative thoughts\nUnderstand thought triggers\nBecome aware of thinking patterns",
    reflectionPrompts: "What patterns do you notice in your negative thoughts?\nAre there common triggers?\nHow did recognizing these thoughts make you feel?",
  },
  {
    title: "Behavioral Activation Exercise",
    taskDescription: "Choose one activity you enjoy but have been avoiding. Schedule and complete it this week. It can be as simple as a 15-minute walk or calling a friend.",
    learningObjectives: "Understand how behavior influences mood\nBreak avoidance cycles\nBuild momentum for positive change",
    reflectionPrompts: "How did completing this activity affect your mood?\nWhat barriers did you face?\nWhat will you do next week?",
  },
  {
    title: "Grounding Technique Practice",
    taskDescription: "Practice the 5-4-3-2-1 grounding technique: Notice 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste. Use this when feeling anxious.",
    learningObjectives: "Learn anxiety management techniques\nConnect with the present moment\nDevelop coping skills",
    reflectionPrompts: "When did you feel most anxious this week?\nHow did the grounding technique help?\nWill you use this technique again?",
  },
];

export async function generateAssignment(input: any) {
  if (MOCK_MODE) {
    console.log("🎭 MOCK MODE: Returning fake assignment data");
    // Return a random mock assignment as an object (not stringified)
    return mockAssignmentResponses[Math.floor(Math.random() * mockAssignmentResponses.length)];
  }

  // Build a prompt from the input object
  const prompt = `You are an expert CBT therapist. Generate a therapy assignment based on:
Client: ${input.clientProfile?.name || 'Unknown'}
Age: ${input.clientProfile?.age || 'Not specified'}
Condition: ${input.clientProfile?.condition || 'Not specified'}
Session Focus: ${input.sessionContext?.focusArea || 'General'}

Return a JSON object with these exact fields:
{
  "title": "Assignment Title",
  "taskDescription": "Detailed description of what the client should do",
  "learningObjectives": "Key learning goals",
  "reflectionPrompts": "Questions for reflection"
}`;

  const res = await openai!.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });

  const content = res.choices?.[0]?.message?.content ?? "{}";
  
  try {
    // Parse the JSON response
    return JSON.parse(content);
  } catch (e) {
    console.error("Failed to parse AI response:", content);
    throw new Error("AI response was not valid JSON");
  }
}
