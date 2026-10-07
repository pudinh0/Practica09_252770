import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Res,
  ForbiddenException,
} from "@nestjs/common";
import type { Response } from "express";
import { InscripcionesService } from "./inscripciones.service";
import { CrearInscripcionDto } from "./dto/crear-inscripcion.dto";
import { aInscripcionDto } from "./dto/inscripcion-respuesta.dto";
import { Rol, type PayloadJwt } from "../auth/dominio/usuario";
import { UsuarioActual } from "src/auth/decoradores/usuario-actual.decorator";

@Controller("inscripciones")
export class InscripcionesController {
  constructor(private readonly servicio: InscripcionesService) {}

  @Get()
  async listar() {
    const lista = await this.servicio.listar();
    return lista.map(aInscripcionDto);
  }

  @Get(":id")
  async buscar(@Param("id") id: string) {
    const inscripcion = await this.servicio.buscar(Number(id));
    if (!inscripcion) {
      throw new NotFoundException(`No existe la inscripcion ${id}`);
    }
    return aInscripcionDto(inscripcion);
  }

  // Se borro el try/catch con los cuatro instanceof y los imports de los
  // errores. Si el Service lanza CupoLlenoError, el error sale de aqui y
  // el filtro lo convierte en 409.
  @Post()
  @HttpCode(201)
  async crear(
    @Body() dto: CrearInscripcionDto,
    @Res({ passthrough: true }) res: Response,
    @UsuarioActual() usuario: PayloadJwt,
  ) {
    // Quien eres lo dice el TOKEN, no el cuerpo.
    // Un miembro solo puede inscribirse a si mismo...
    if (usuario.rol === Rol.miembro && usuario.miembroId !== dto.miembroId) {
      // ...si intenta inscribir a otro: 403 (se quien eres y no puedes).
      throw new ForbiddenException("Solo puedes inscribirte a ti mismo");
    }

    // El entrenador y el admin si pueden inscribir a cualquiera.
    const inscripcion = await this.servicio.crear(dto);
    res.setHeader("Location", `/inscripciones/${inscripcion.id}`);
    return aInscripcionDto(inscripcion);
  }

  @Delete(":id")
  async cancelar(@Param("id") id: string) {
    const cancelada = await this.servicio.cancelar(Number(id));
    if (!cancelada) {
      throw new NotFoundException(`No existe la inscripcion ${id}`);
    }
    return aInscripcionDto(cancelada);
  }
}
