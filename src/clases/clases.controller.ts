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
import { ClasesService } from './clases.service';
import { CrearClaseDto } from './dto/crear-clase.dto';
import { ActualizarClaseDto } from './dto/actualizar-clase.dto';

@Controller('clases')
export class ClasesController {
  constructor(private readonly clasesService: ClasesService) {}


  @Get()
  listar() {
    return this.clasesService.listar();
  }


  @Get(':id')
  async buscar(@Param('id') id: string) {
    const clase = await this.clasesService.buscar(Number(id));
    if (!clase) {
      throw new NotFoundException(`No existe la clase ${id}`);
    }
    return clase;
  }


  @Post()
  @HttpCode(201)
  crear(@Body() dto: CrearClaseDto) {
    return this.clasesService.crear(dto);
  }


  @Patch(':id')
  async actualizar(@Param('id') id: string, @Body() dto: ActualizarClaseDto) {
    const clase = await this.clasesService.actualizar(Number(id), dto);
    if (!clase) {
      throw new NotFoundException(`No existe la clase ${id}`);
    }
    return clase;
  }


  @Delete(':id')
  async eliminar(@Param('id') id: string) {
    const clase = await this.clasesService.eliminar(Number(id));
    if (!clase) {
      throw new NotFoundException(`No existe la clase ${id}`);
    }
    return clase;
  }
}
