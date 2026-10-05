import { Horario, Miembro } from '../inscripciones/dominio/entidades';

export const HORARIOS: Horario[] = [
  { id: 1, claseId: 1, dia: 'lunes', horaInicio: '06:00', cupoMaximo: 5, entrenador: 'Carlos Santana' },
  { id: 2, claseId: 1, dia: 'miercoles', horaInicio: '08:00', cupoMaximo: 4, entrenador: 'Mariana Vega' },
  { id: 3, claseId: 2, dia: 'martes', horaInicio: '16:00', cupoMaximo: 6, entrenador: 'Alejandro Ruiz' },
  { id: 4, claseId: 3, dia: 'jueves', horaInicio: '18:30', cupoMaximo: 3, entrenador: 'Brenda Soto' },
  { id: 5, claseId: 2, dia: 'viernes', horaInicio: '07:00', cupoMaximo: 5, entrenador: 'Luis Fierro' },
];

export const MIEMBROS: Miembro[] = [
  { id: 1, nombre: 'Valeria Cárdenas', correo: 'valeria@itson.mx', membresia: 'premium', activo: true },
  { id: 2, nombre: 'Diego Valenzuela', correo: 'diego@itson.mx', membresia: 'plus', activo: true },
  { id: 3, nombre: 'Fernanda Mendívil', correo: 'fernanda@itson.mx', membresia: 'basica', activo: false },
  { id: 4, nombre: 'Jesús Beltrán', correo: 'jesus@itson.mx', membresia: 'premium', activo: true },
  { id: 5, nombre: 'Paola Higuera', correo: 'paola@itson.mx', membresia: 'plus', activo: true },
];