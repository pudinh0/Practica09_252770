import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { MiembrosService } from './miembros.service';
import { CrearMiembroDto } from './dto/crear-miembro.dto';
import { ActualizarMiembroDto } from './dto/actualizar-miembro.dto';

@Controller('miembros')
export class MiembrosController {
  constructor(private readonly miembrosService: MiembrosService) {}

 
  @Get()
  listar() {
    return this.miembrosService.listar();
  }

  @Get(':id')
  async buscar(@Param('id') id: string) {
    const miembro = await this.miembrosService.buscar(Number(id));
    if (!miembro) {
      throw new NotFoundException(`No existe el miembro ${id}`);
    }
    return miembro;
  }


  @Post()
  @HttpCode(201)
  crear(@Body() dto: CrearMiembroDto) {
    return this.miembrosService.crear(dto);
  }


  @Patch(':id')
  async actualizar(@Param('id') id: string, @Body() dto: ActualizarMiembroDto) {
    const miembro = await this.miembrosService.actualizar(Number(id), dto);
    if (!miembro) {
      throw new NotFoundException(`No existe el miembro ${id}`);
    }
    return miembro;
  }

  @Delete(':id')
  async eliminar(@Param('id') id: string) {
    const miembro = await this.miembrosService.eliminar(Number(id));
    if (!miembro) {
      throw new NotFoundException(`No existe el miembro ${id}`);
    }
    return miembro;
  }
}
