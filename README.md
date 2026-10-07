## Parte 1: Blindar la API

### 1. ¿Por qué el filtro atrapa la clase base y no cada error por separado?
Porque gracias al principio de polimorfismo, al registrar el decorador `@Catch(ErrorDeDominio)`, el filtro intercepta automáticamente la clase base y cualquier clase hija que herede de ella. Esto evita duplicar código o tener que declarar un método/filtro independiente por cada error nuevo del negocio.

### 2. ¿Por qué este middleware no podría decidir si un usuario tiene permiso para una ruta?
Porque el middleware opera a un nivel muy temprano de la petición (en el ciclo de vida de Express), antes de que el enrutador de NestJS procese la solicitud y sepa qué controlador, método o decoradores específicos (como `@Publico()` o roles) van a atenderla. No posee el contexto de la ruta destino ni de la identidad del usuario.

### 3. ¿Por qué la petición que responde 409 no aparece en ese registro (LoggingInterceptor)?
Porque cuando ocurre un error de dominio (como un conflicto de cupo lleno), la ejecución normal del controlador se interrumpe y el flujo se desvía directamente hacia el filtro de excepciones (`DominioExceptionFilter`). Como consecuencia, el operador `.pipe(tap(...))` del interceptor no llega a ejecutarse al no tratarse de una respuesta exitosa.

### 4. ¿Por qué este cambio (`SobreInterceptor`) rompe a cualquier cliente que ya estuviera consumiendo la API?
Porque altera por completo el contrato original de la respuesta HTTP. Si antes el cliente (por ejemplo, una aplicación en React) esperaba recibir directamente un arreglo de datos `[...]`, ahora pasa a recibir un objeto JSON estructurado con un sobre que contiene metadatos (`{ data: [...], meta: {...} }`), lo que ocasiona fallas en las lecturas directas del frontend.

### 5. Si el servidor respondió en los dos casos, ¿quién bloquea y a quién protege?
Quien bloquea es el navegador web del cliente y a quien protege es **al usuario**, evitando que un sitio web malicioso de un origen diferente intente leer o sustraer información confidencial de la API sin una autorización explícita de CORS.


## Parte 2: Autenticación JWT y OpenAPI

### 1. ¿Por qué el campo se llama `passwordHash` y no `password`?
Es una medida de seguridad conceptual y de diseño para prevenir guardar por error o descuido la contraseña en texto plano en la base de datos; el nombre deja explícito que lo que se almacena es únicamente el resultado del cifrado (el hash).

### 2. ¿Por qué los dos errores del inicio de sesión dicen exactamente lo mismo ("Credenciales inválidas")?
Por seguridad contra ataques de enumeración de usuarios. Si el sistema diferenciara los mensajes (por ejemplo, "El correo no existe" frente a "Contraseña incorrecta"), un atacante malintencionado podría descubrir qué correos están registrados en el sistema probando cuentas una por una.

### 3. Si el contenido del token se puede leer, ¿qué es lo que protege la firma?
La firma digital protege la **integridad y la autenticidad** del contenido del token. Aunque cualquier persona puede leer el payload (por ejemplo, en `jwt.io`), si un usuario intenta alterarlo de forma maliciosa (como cambiar su rol a `admin`), la firma matemática dejará de coincidir con el `JWT_SECRET` del servidor y la petición será rechazada de inmediato.

### 4. ¿Por qué es más seguro proteger todo y abrir a mano, que al revés?
Bajo el principio de **seguridad por omisión**, si se crea una nueva ruta o controlador y se olvida colocarle una protección, por defecto estará blindada y exigirá autenticación (arrojando un error 401 que se detecta rápidamente). Si fuera al revés (todo abierto por defecto), olvidar proteger un endpoint dejaría un agujero de seguridad crítico expuesto sin que nadie lo note.

### 5. ¿Cuál es la diferencia entre un 401 y un 403?
* **401 Unauthorized:** Significa "No se quién eres" (falta el token, es inválido o expiró).
* **403 Forbidden:** Significa "Se perfectamente quién eres, pero no tienes los permisos necesarios" para ejecutar esa acción (por ejemplo, un miembro intentando inscribir a otra persona).

### 6. ¿Cuántas líneas del `AuthService` tuvieron que cambiar para pasar de memoria a MySQL? ¿Por qué?
Cero lineas, ya que solo cambio la inyeccion de dependencias en el modulo de AuthMOdule.

### 7. ¿Por qué es importante tomar al usuario de los claims del token y no de un parámetro de la URL o del cuerpo?
Razón: Confiar en datos enviados por el cliente en la URL o en el cuerpo de la petición permitiría que un usuario malintencionado manipule dichos valores para suplantar la identidad de otra persona.
Ejemplo concreto: Si la API confiara en una ruta como `POST /inscripciones` recibiendo un `miembroId` arbitrario en el body sin validarlo contra el token, un usuario podría modificar el ID y registrar a otra persona sin su consentimiento.
Claim utilizado: Se utiliza el claim estándar `sub` (subject) o los datos internos del payload (como `miembroId` y `rol`) firmados de forma segura.
Por qué el cliente no puede falsificarlo:Porque el token está criptográficamente firmado con el secreto del servidor (`JWT_SECRET`); cualquier alteración rompe la firma y el servidor rechaza la solicitud al instante.