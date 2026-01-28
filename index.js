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
          { 
            role: 'system', 
            content: `You are AdsNord AI, a professional Google Ads Contractor and expert auditor. 
            Your goal is to help users "Hire a Google Ads Expert" or "Request a Free Google Ads Audit".
            
            Key Rules:
            1. Be professional, data-driven, and concise.
            2. If users ask for help, suggest they "Request a Quote" or "Request a Free Google Ads Audit".
            3. Mention that AdsNord specializes in scaling high-intent brands through precision data.
            4. If a user wants to talk to a human, direct them to your WhatsApp (https://wa.me/46764304702).
            5. Politely decline questions not related to Marketing or Google Ads.` 
          },
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
