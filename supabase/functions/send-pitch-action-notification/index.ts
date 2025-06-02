
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const resend = new Resend(Deno.env.get('RESEND_API_KEY') || '');

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PitchActionRequest {
  pitch_id: string;
  action: 'shortlisted' | 'rejected' | 'forwarded';
  investor_id: string;
  founder_id: string;
  company_name: string;
  notes?: string;
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

    const { pitch_id, action, investor_id, founder_id, company_name, notes }: PitchActionRequest = await req.json();

    console.log('Processing pitch action notification:', { pitch_id, action, investor_id, founder_id });

    // Get investor and founder profiles
    const [investorResult, founderResult] = await Promise.all([
      supabase.from('profiles').select('name').eq('id', investor_id).single(),
      supabase.from('profiles').select('name').eq('id', founder_id).single()
    ]);

    if (investorResult.error || founderResult.error) {
      console.error('Error fetching profiles:', investorResult.error, founderResult.error);
      throw new Error('Failed to fetch user profiles');
    }

    const investorName = investorResult.data.name;
    const founderName = founderResult.data.name;

    // Get founder's email
    const { data: { user }, error: userError } = await supabase.auth.admin.getUserById(founder_id);
    
    if (userError || !user?.email) {
      console.error('Error fetching founder email:', userError);
      throw new Error('Failed to fetch founder email');
    }

    const actionMessages = {
      shortlisted: {
        subject: `Great news! Your pitch for ${company_name} has been shortlisted`,
        title: 'Your pitch has been shortlisted! 🎉',
        message: `${investorName} has shortlisted your pitch for ${company_name}. This means they're interested in learning more about your company.`,
        color: '#22c55e'
      },
      rejected: {
        subject: `Update on your pitch for ${company_name}`,
        title: 'Pitch Status Update',
        message: `${investorName} has reviewed your pitch for ${company_name}. While this particular opportunity didn't move forward, keep refining your pitch and continue reaching out to other investors.`,
        color: '#ef4444'
      },
      forwarded: {
        subject: `Your pitch for ${company_name} has been forwarded`,
        title: 'Your pitch has been forwarded! 📤',
        message: `${investorName} has forwarded your pitch for ${company_name} to other investors in their network. This could lead to additional opportunities.`,
        color: '#3b82f6'
      }
    };

    const actionData = actionMessages[action];
    const pitchUrl = `http://localhost:8080/pitch/${pitch_id}`;

    const emailResponse = await resend.emails.send({
      from: "PitchFlow <notifications@resend.dev>",
      to: [user.email],
      subject: actionData.subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: ${actionData.color};">${actionData.title}</h2>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Company:</strong> ${company_name}</p>
            <p><strong>Investor:</strong> ${investorName}</p>
            <p style="margin-top: 15px;">${actionData.message}</p>
            ${notes ? `
              <div style="margin-top: 20px;">
                <p><strong>Additional Notes:</strong></p>
                <p style="background-color: white; padding: 15px; border-radius: 4px; border-left: 4px solid ${actionData.color};">
                  ${notes}
                </p>
              </div>
            ` : ''}
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${pitchUrl}" 
               style="background-color: ${actionData.color}; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
              View Your Pitch
            </a>
          </div>
          <p style="color: #666; font-size: 12px;">
            This is an automated message from PitchFlow. Please do not reply to this email.
          </p>
        </div>
      `,
    });

    console.log("Pitch action email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-pitch-action-notification function:", error);
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
