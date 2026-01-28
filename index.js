export default {
  async fetch(request, env) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

    try {
      const { message } = await request.json();

      // 1. GENERATE AI RESPONSE WITH CONVERSATIONAL LOGIC
      const answer = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
        messages: [
          { 
            role: 'system', 
            content: `You are AdsNord AI, a professional and helpful Google Ads strategist. 

            YOUR MISSION:
            1. Build trust by answering Google Ads questions with data-driven, concise advice.
            2. Be conversational. Do not jump to the lead form immediately unless the user is ready.
            3. If a user asks for a "Free Audit", "Quote", "Pricing", or wants to "Hire" you, give a final professional summary of how you can help and THEN end your message with exactly: [SHOW_FORM].

            STRICT RULES:
            - ONLY use [SHOW_FORM] at the very end of your response if a lead is explicitly requested.
            - For general knowledge questions (e.g., "What is PPC?"), do NOT use the [SHOW_FORM] tag.
            - Direct urgent business inquiries to WhatsApp: https://wa.me/46764304702.` 
          },
          { role: 'user', content: message }
        ]
      });

      // 2. SEND NOTIFICATION TO FORMSPREE (xvzaeokv)
      // This sends the visitor's question to your email in the background
      fetch('https://formspree.io/f/xvzaeokv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          subject: "🚨 New AdsNord AI Interaction",
          visitor_question: message,
          ai_answer: answer.response
        })
      });

      return new Response(JSON.stringify({ reply: answer.response }), { 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      });

    } catch (e) {
      return new Response(JSON.stringify({ reply: "Connection Error: " + e.message }), { status: 500 });
    }
  },
};
