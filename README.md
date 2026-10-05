## Pregunta 1 
¿Qué línea del Service o del Controller tuvo que cambiar para que Clases hablara con MySQL?
ni una, solo se cambio algo en clases.module, que fue que se cambio a clasePrismaRepository

## Pregunta 2
¿Por qué InscripcionesService no cambió ni una línea de las reglas de cupo/duplicados?

por que viven en el service, y el service solo contiene una dependencia base que es la de interfaz inscripcionRepository,
aparte la logica para guardar datos no tiene por que verse afectada por cambiar en donde se guardan.


## Pregunta 3
¿Por qué una interfaz no puede validar en tiempo de ejecución?
no pueden validar debido a que las interfaces de ts se borran cuando se compila a js, se necesitan las clases para validar lo que llega en tiempo real/ejecucion

## Pregunta 4
¿Qué código de estado responde y qué trae en el cuerpo?

el 400, el cuerpo contiene message, error y statuscode, donde el message es un arreglo con el detalle del  error

## Pregunta 5
¿Cuántas líneas quedó más corto el controlador con el filter?
como 10, se redujo el bloque try catch que utilizabamos, esto debido al filtro

## Prgeunta 6
Si la respuesta llega en los dos casos, ¿quién bloquea
realmente y a quién protege?

el navegador es que e lbloquea la respuesta y protege al usuario, esto debido al CORS 


