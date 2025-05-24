import { supabase } from '@/integrations/supabase/client';

// File upload configuration
const ALLOWED_PDF_TYPES = ['application/pdf'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/x-msvideo'];
const MAX_PDF_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB

// Upload pitch deck to Supabase storage
export const uploadPitchDeck = async (file: File): Promise<string> => {
  try {
    // Validate file type
    if (!ALLOWED_PDF_TYPES.includes(file.type)) {
      throw new Error('Invalid file type. Please upload a PDF file.');
    }

    // Validate file size
    if (file.size > MAX_PDF_SIZE) {
      throw new Error('File too large. Maximum size is 10MB.');
    }

    // Generate unique filename
    const timestamp = new Date().getTime();
    const fileName = `pitch-deck-${timestamp}.pdf`;

    // Upload to Supabase storage
    const { data, error } = await supabase.storage
      .from('pitch-deck')
      .upload(fileName, file);

    if (error) {
      throw error;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('pitch-deck')
      .getPublicUrl(fileName);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading pitch deck:', error);
    throw error;
  }
};

// Upload pitch video to Supabase storage
export const uploadPitchVideo = async (file: File): Promise<string> => {
  try {
    // Validate file type
    if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
      throw new Error('Invalid file type. Please upload an MP4, MOV, or AVI file.');
    }

    // Validate file size
    if (file.size > MAX_VIDEO_SIZE) {
      throw new Error('File too large. Maximum size is 100MB.');
    }

    // Generate unique filename
    const timestamp = new Date().getTime();
    const fileName = `pitch-video-${timestamp}${file.name.substring(file.name.lastIndexOf('.'))}`;    

    // Upload to Supabase storage
    const { data, error } = await supabase.storage
      .from('pitch-videos')
      .upload(fileName, file);

    if (error) {
      throw error;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('pitch-videos')
      .getPublicUrl(fileName);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading pitch video:', error);
    throw error;
  }
};