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
      const answer = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
        messages: [
          { role: 'system', content: 'You are the official AdsNord Assistant. You only answer questions about Google Ads, audits, and professional contractors. Direct users to contact via WhatsApp for business inquiries.' },
          { role: 'user', content: message }
        ]
      });
      return new Response(JSON.stringify({ reply: answer.response }), { 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      });
    } catch (e) {
      return new Response(JSON.stringify({ reply: "Error: " + e.message }), { status: 500 });
    }
  },
};
