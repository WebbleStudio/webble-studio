import { NextRequest, NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabaseClient';
import { auth } from '@/lib/auth';
import { ApplicationError, ErrorCode, createErrorResponse, logError } from '@/lib/errors';

export async function GET(request: NextRequest) {
  try {
    // Verifica autenticazione admin
    const session = await auth();
    if (!session || !session.user || session.user.role !== 'admin') {
      return createErrorResponse(
        new ApplicationError(ErrorCode.UNAUTHORIZED, 'Accesso non autorizzato'),
        401
      );
    }

    // Usa service role per bypassare RLS
    if (!supabaseAdmin) {
      throw new ApplicationError(ErrorCode.DATABASE_ERROR, 'Service role key non configurata');
    }

    const { data, error } = await supabaseAdmin
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new ApplicationError(
        ErrorCode.DATABASE_ERROR,
        'Errore nel recupero dei booking',
        error
      );
    }

    return NextResponse.json(
      {
        success: true,
        bookings: data || [],
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof ApplicationError) {
      logError(error, 'Bookings Fetch');
      return createErrorResponse(error, error.code === ErrorCode.DATABASE_ERROR ? 500 : 400);
    }

    const unknownError = new ApplicationError(
      ErrorCode.UNKNOWN_ERROR,
      'Errore interno del server',
      error
    );
    logError(unknownError, 'Bookings Fetch Unknown');
    return createErrorResponse(unknownError, 500);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Verifica autenticazione admin
    const session = await auth();
    if (!session || !session.user || session.user.role !== 'admin') {
      return createErrorResponse(
        new ApplicationError(ErrorCode.UNAUTHORIZED, 'Accesso non autorizzato'),
        401
      );
    }

    // Usa service role per bypassare RLS
    if (!supabaseAdmin) {
      throw new ApplicationError(ErrorCode.DATABASE_ERROR, 'Service role key non configurata');
    }

    const body = await request.json();
    const { ids } = body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return createErrorResponse(
        new ApplicationError(ErrorCode.VALIDATION_ERROR, 'IDs non validi'),
        400
      );
    }

    const { error } = await supabaseAdmin.from('bookings').delete().in('id', ids);

    if (error) {
      throw new ApplicationError(
        ErrorCode.DATABASE_ERROR,
        "Errore nell'eliminazione dei booking",
        error
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: `${ids.length} booking eliminati con successo`,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof ApplicationError) {
      logError(error, 'Bookings Bulk Delete');
      return createErrorResponse(error, error.code === ErrorCode.DATABASE_ERROR ? 500 : 400);
    }

    const unknownError = new ApplicationError(
      ErrorCode.UNKNOWN_ERROR,
      'Errore interno del server',
      error
    );
    logError(unknownError, 'Bookings Bulk Delete Unknown');
    return createErrorResponse(unknownError, 500);
  }
}
