import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';
import { auth } from '@/lib/auth';
import { ApplicationError, ErrorCode, createErrorResponse, logError } from '@/lib/errors';

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
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

    const { id } = params;

    if (!id) {
      return createErrorResponse(
        new ApplicationError(ErrorCode.VALIDATION_ERROR, 'ID booking mancante'),
        400
      );
    }

    const { error } = await supabaseAdmin.from('bookings').delete().eq('id', id);

    if (error) {
      throw new ApplicationError(
        ErrorCode.DATABASE_ERROR,
        "Errore nell'eliminazione del booking",
        error
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Booking eliminato con successo',
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof ApplicationError) {
      logError(error, 'Booking Delete');
      return createErrorResponse(error, error.code === ErrorCode.DATABASE_ERROR ? 500 : 400);
    }

    const unknownError = new ApplicationError(
      ErrorCode.UNKNOWN_ERROR,
      'Errore interno del server',
      error
    );
    logError(unknownError, 'Booking Delete Unknown');
    return createErrorResponse(unknownError, 500);
  }
}
