import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { projects } = await request.json();

    if (!Array.isArray(projects) || projects.length === 0) {
      return NextResponse.json(
        { error: 'Projects array is required and must not be empty' },
        { status: 400 }
      );
    }

    // Inserisci tutti i progetti in batch
    const { data: insertedProjects, error } = await supabase
      .from('projects')
      .insert(projects)
      .select();

    if (error) {
      console.error('Error inserting projects:', error);
      return NextResponse.json({ error: 'Failed to insert projects' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: `${insertedProjects.length} projects inserted successfully`,
      projects: insertedProjects,
    });
  } catch (error) {
    console.error('Batch insert error:', error);
    return NextResponse.json(
      { error: 'Internal server error during batch insert' },
      { status: 500 }
    );
  }
}
