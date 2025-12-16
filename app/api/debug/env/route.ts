// app/api/debug/env/route.ts
export async function GET() {
    return new Response(JSON.stringify({
      hasKey: !!process.env.OPENAI_API_KEY,
      startsWith: process.env.OPENAI_API_KEY?.slice(0,5) ?? null
    }), { status: 200, headers: { "Content-Type": "application/json" }});
  }

  