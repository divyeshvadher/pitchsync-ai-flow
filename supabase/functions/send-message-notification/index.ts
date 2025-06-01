
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface MessageNotificationRequest {
  message_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { message_id, sender_id, receiver_id, content }: MessageNotificationRequest = await req.json();

    console.log('Processing message notification:', { message_id, sender_id, receiver_id });

    // Get sender and receiver profiles
    const [senderResult, receiverResult] = await Promise.all([
      supabase.from('profiles').select('name, role').eq('id', sender_id).single(),
      supabase.from('profiles').select('name, role').eq('id', receiver_id).single()
    ]);

    if (senderResult.error || receiverResult.error) {
      console.error('Error fetching profiles:', senderResult.error, receiverResult.error);
      throw new Error('Failed to fetch user profiles');
    }

    const senderProfile = senderResult.data;
    const receiverProfile = receiverResult.data;

    // Get receiver's email from auth.users (using service role key)
    const { data: { user }, error: userError } = await supabase.auth.admin.getUserById(receiver_id);
    
    if (userError || !user?.email) {
      console.error('Error fetching user email:', userError);
      throw new Error('Failed to fetch receiver email');
    }

    const messagePreview = content.length > 100 ? content.substring(0, 100) + '...' : content;
    const messageUrl = `https://htspmmemelunoshqvjtg.supabase.co/messages`;

    const emailResponse = await resend.emails.send({
      from: "PitchFlow <notifications@resend.dev>",
      to: [user.email],
      subject: `New message from ${senderProfile.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">You have a new message!</h2>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>From:</strong> ${senderProfile.name} (${senderProfile.role})</p>
            <p><strong>Message:</strong></p>
            <p style="background-color: white; padding: 15px; border-radius: 4px; border-left: 4px solid #007bff;">
              ${messagePreview}
            </p>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${messageUrl}" 
               style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
              View Conversation
            </a>
          </div>
          <p style="color: #666; font-size: 12px;">
            This is an automated message from PitchFlow. Please do not reply to this email.
          </p>
        </div>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-message-notification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
