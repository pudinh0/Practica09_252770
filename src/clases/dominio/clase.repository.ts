import { Clase } from './entidades';
import { CrearClaseDto } from '../dto/crear-clase.dto';
import { ActualizarClaseDto } from '../dto/actualizar-clase.dto';

export interface ClaseRepository {
  listar(): Promise<Clase[]>;
  buscarPorId(id: number): Promise<Clase | null>;
  crear(datos: CrearClaseDto): Promise<Clase>;
  actualizar(id: number, datos: ActualizarClaseDto): Promise<Clase | null>;
  eliminar(id: number): Promise<Clase | null>;
}
