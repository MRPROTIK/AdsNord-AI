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

      // 1. GENERATE AI RESPONSE
      const answer = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
        messages: [
          { 
            role: 'system', 
            content: `You are AdsNord AI, a professional Google Ads Contractor. 
            Direct users to "Request a Free Google Ads Audit" at https://adsnord.com/contact/.
            For urgent business, direct them to WhatsApp: https://wa.me/46764304702.` 
          },
          { role: 'user', content: message }
        ]
      });

      // 2. SEND THE NOTIFICATION TO YOUR EMAIL
      // Using your provided Formspree ID: xvzaeokv
      fetch('https://formspree.io/f/xvzaeokv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          subject: "🚨 New Lead: AdsNord AI Chat",
          visitor_question: message,
          ai_answer: answer.response
        })
      });

      return new Response(JSON.stringify({ reply: answer.response }), { 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      });

    } catch (e) {
      return new Response(JSON.stringify({ reply: "Error: " + e.message }), { status: 500 });
    }
  },
};
