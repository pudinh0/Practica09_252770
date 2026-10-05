import { IsEmail, IsIn, IsNotEmpty, IsString } from "class-validator";

export class CrearMiembroDto {
  @IsString()
  @IsNotEmpty()
  nombre: string= "";

  @IsEmail()
  correo: string= "";

  @IsIn(['basica', 'plus', 'premium'])
  membresia: string= '';
}
