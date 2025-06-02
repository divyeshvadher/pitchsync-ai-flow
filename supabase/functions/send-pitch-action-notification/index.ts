import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'npm:resend@2.0.0';

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
    console.log('=== Pitch Action Notification Function Started ===');
    
    // Check if Resend API key is available
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) {
      console.error('RESEND_API_KEY environment variable is not set');
      throw new Error('Email service not configured');
    }
    console.log('Resend API key found:', resendApiKey.substring(0, 10) + '...');

    // Initialize Resend with the API key
    const resend = new Resend(resendApiKey);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Supabase environment variables missing');
      throw new Error('Database service not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    console.log('Supabase client initialized');

    // Parse request body
    const requestBody = await req.json();
    console.log('Request body received:', requestBody);
    
    const { pitch_id, action, investor_id, founder_id, company_name, notes }: PitchActionRequest = requestBody;

    if (!pitch_id || !action || !investor_id || !founder_id || !company_name) {
      console.error('Missing required fields in request');
      throw new Error('Missing required fields');
    }

    console.log('Processing pitch action notification:', { 
      pitch_id, 
      action, 
      investor_id: investor_id.substring(0, 8) + '...', 
      founder_id: founder_id.substring(0, 8) + '...',
      company_name 
    });

    // Get investor and founder profiles
    console.log('Fetching user profiles...');
    const [investorResult, founderResult] = await Promise.all([
      supabase.from('profiles').select('name').eq('id', investor_id).single(),
      supabase.from('profiles').select('name').eq('id', founder_id).single()
    ]);

    if (investorResult.error) {
      console.error('Error fetching investor profile:', investorResult.error);
      throw new Error('Failed to fetch investor profile');
    }

    if (founderResult.error) {
      console.error('Error fetching founder profile:', founderResult.error);
      throw new Error('Failed to fetch founder profile');
    }

    const investorName = investorResult.data?.name || 'An investor';
    const founderName = founderResult.data?.name || 'Founder';
    console.log('Profiles fetched - Investor:', investorName, 'Founder:', founderName);

    // Get founder's email using admin method
    console.log('Fetching founder email...');
    const { data: userData, error: userError } = await supabase.auth.admin.getUserById(founder_id);
    
    if (userError) {
      console.error('Error fetching founder user data:', userError);
      throw new Error('Failed to fetch founder email: ' + userError.message);
    }

    if (!userData.user?.email) {
      console.error('No email found for founder:', founder_id);
      throw new Error('Founder email not found');
    }

    const founderEmail = userData.user.email;
    console.log('Founder email found:', founderEmail);

    // Define action-specific email content
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
    if (!actionData) {
      console.error('Invalid action provided:', action);
      throw new Error('Invalid action type');
    }

    const pitchUrl = `${supabaseUrl.replace('.supabase.co', '')}/pitch/${pitch_id}`;
    console.log('Pitch URL:', pitchUrl);

    // Prepare email content
    const emailHTML = `
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
    `;

    // Send email using Resend
    console.log('Sending email to:', founderEmail);
    console.log('Email subject:', actionData.subject);
    
    const emailResponse = await resend.emails.send({
      from: "PitchFlow <notifications@resend.dev>",
      to: [founderEmail],
      subject: actionData.subject,
      html: emailHTML,
    });

    console.log("Email send response:", emailResponse);

    // Check if email was sent successfully
    if (emailResponse.error) {
      console.error("Email sending failed:", emailResponse.error);
      throw new Error(`Email sending failed: ${emailResponse.error.message}`);
    }

    if (!emailResponse.data || !emailResponse.data.id) {
      console.error("Email response missing data or ID");
      throw new Error("Email sending failed - no confirmation received");
    }

    console.log("Email sent successfully with ID:", emailResponse.data.id);

    return new Response(JSON.stringify({ 
      success: true, 
      emailId: emailResponse.data.id,
      message: 'Email notification sent successfully'
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
    
  } catch (error: any) {
    console.error("=== Error in send-pitch-action-notification function ===");
    console.error("Error details:", error);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false,
        details: error.stack
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
