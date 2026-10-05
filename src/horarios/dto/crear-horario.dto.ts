import { IsInt, IsString, IsNotEmpty, Matches, Min } from 'class-validator';

export class CrearHorarioDto {
  @IsInt()
  claseId: number= 0;
  @IsString()
  @IsNotEmpty()
  dia: string= "";

  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/)
  horaInicio: string= "";
  @IsInt()
  @Min(1)
  cupoMaximo: number= 1;

  @IsString()
  @IsNotEmpty()
  entrenador: string= "";
}
