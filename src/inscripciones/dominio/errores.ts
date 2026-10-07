import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import type { Request, Response } from 'express';

export abstract class ErrorDeDominio extends Error {}

export class HorarioNoEncontradoError extends ErrorDeDominio {
  constructor(horarioId: number) {
    super(`No existe el horario ${horarioId}`);
  }
}

export class MiembroNoEncontradoError extends ErrorDeDominio {
  constructor(miembroId: number) {
    super(`No existe el miembro ${miembroId}`);
  }
}

export class CupoLlenoError extends ErrorDeDominio {
  constructor(horarioId: number, cupoMaximo: number) {
    super(`El horario ${horarioId} ya tiene ${cupoMaximo} inscripciones confirmadas`);
  }
}

export class InscripcionDuplicadaError extends ErrorDeDominio {
  constructor(horarioId: number, miembroId: number) {
    super(`El miembro ${miembroId} ya esta inscrito en el horario ${horarioId}`);
  }
}

  
@Catch(ErrorDeDominio)
export class DominioExceptionFilter implements ExceptionFilter {
  catch(error: ErrorDeDominio, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      error instanceof HorarioNoEncontradoError || error instanceof MiembroNoEncontradoError
        ? HttpStatus.NOT_FOUND
        : error instanceof CupoLlenoError || error instanceof InscripcionDuplicadaError
          ? HttpStatus.CONFLICT
          : HttpStatus.BAD_REQUEST;

    response.status(status).json({
      statusCode: status,
      message: error.message,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }

}
