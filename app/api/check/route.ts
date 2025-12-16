export async function GET() {
    return Response.json({
      hasKey: !!process.env.OPENAI_API_KEY,
      startsWith: process.env.OPENAI_API_KEY?.slice(0,5) || null
    });
  }
  