import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('image') as File | null;

    if (!file || file.size === 0) {
      return NextResponse.json(
        { success: false, error: 'No image file provided.' },
        { status: 400 }
      );
    }

    // Allow up to 10MB
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'Image size exceeds maximum limit of 10MB.' },
        { status: 400 }
      );
    }

    const client = createAdminClient();
    if (!client) {
      return NextResponse.json(
        { success: false, error: 'Supabase storage service unavailable.' },
        { status: 500 }
      );
    }

    const fileExt = file.name.split('.').pop() || 'jpg';
    const cleanExt = fileExt.toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
    const fileName = `bangles/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${cleanExt}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { data: uploadData, error: uploadErr } = await client.storage
      .from('product-images')
      .upload(fileName, buffer, {
        contentType: file.type || 'image/jpeg',
        upsert: true,
      });

    if (uploadErr) {
      console.error('[Storage Upload Error]:', uploadErr);
      return NextResponse.json(
        { success: false, error: uploadErr.message },
        { status: 500 }
      );
    }

    const { data: publicUrlData } = client.storage
      .from('product-images')
      .getPublicUrl(uploadData.path);

    return NextResponse.json({ success: true, url: publicUrlData.publicUrl });
  } catch (err: any) {
    console.error('[Upload API Exception]:', err);
    return NextResponse.json(
      { success: false, error: err?.message || 'Server error during image upload.' },
      { status: 500 }
    );
  }
}
