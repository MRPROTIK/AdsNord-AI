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
  content: `You are AdsNord AI, a professional Google Ads expert. 
  
  RULES:
  1. For general questions about Google Ads, just give a helpful answer. Do NOT show the form.
  2. ONLY end your message with "[SHOW_FORM]" if the user explicitly asks for a "Free Audit," wants to "Hire" you, asks for a "Quote," or wants to "Work with you."
  3. If they are just chatting, do NOT include the [SHOW_FORM] tag.` 
}
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
