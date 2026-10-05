import { Module } from '@nestjs/common';
import { HorariosController } from './horarios.controller';
import { HorariosService } from './horarios.service';
import { HorarioMemoriaRepository } from './infra/horario-memoria.repository';
import { HORARIO_REPOSITORY } from './horarios.tokens';

@Module({
  controllers: [HorariosController],
  providers: [
    HorariosService,
    {
      provide: HORARIO_REPOSITORY,
      useClass: HorarioMemoriaRepository,
    },
  ],
  exports: [HorariosService],
})
export class HorariosModule {}
