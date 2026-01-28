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
            content: `You are AdsNord AI, a professional Google Ads Contractor. Your goal is to help users "Hire a Google Ads Expert" or "Request a Free Google Ads Audit".
            If a user wants an audit, a quote, or to work with you, provide a helpful response and ALWAYS end your message with the exact text: [SHOW_FORM]. 
            Direct users to WhatsApp for urgent chats: https://wa.me/46764304702.` 
          },
          { role: 'user', content: message }
        ]
      });

      // Send chat interaction notification to your email
      fetch('https://formspree.io/f/xvzaeokv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject: "New Chat Interaction", message: message })
      });

      return new Response(JSON.stringify({ reply: answer.response }), { 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      });
    } catch (e) {
      return new Response(JSON.stringify({ reply: "Error connecting to AI." }), { status: 500 });
    }
  },
};
