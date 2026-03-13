# 📝 Las notas

mar 6, 2026

## Reunión del 6 mar 2026 a las 09:35 CST

Registros de la reunión [Transcripción](https://docs.google.com/document/d/1qrUlMJLJPWGQ3LJHzuXNZ0xHtOQtN4wsOJ2I49vSyH4/edit?usp=drive_web&tab=t.45xuoh8r2hbg) 

### Resumen

Revisión de la configuración de sucursales con ajustes en la gestión de empresas, resultando en la decisión de estructurar la agenda de citas por cliente.

**Configuración y asignación de sucursales**  
Se detalló la configuración de sucursales con capacidad de personal por hora; se decidió que la asignación de sucursales a una empresa se realizará mediante casillas de verificación para permitir la multiasignación. Se propuso una identificación única para trabajadores con ID y código QR para manejar duplicados y homónimos en el sistema.

**Ajuste de flujo en la agenda de citas**  
Se discutieron problemas de usabilidad con listas interminables de colaboradores; se decidió modificar el flujo de agendamiento de citas, priorizando la selección de la empresa antes del trabajador. Se acordó que el sistema agregue un paso para la corroboración de datos al momento de la llegada del trabajador a la clínica.

**Integración de perfiles y estudios**  
Se decidió integrar baterías de exámenes y perfiles de puesto en el flujo del Piso Clínico, mostrando las pruebas individualmente para que el personal las confirme a medida que se realizan. Se aceptó la solicitud de implementar la visualización de las 3 agendas de sucursales simultáneamente en una pantalla independiente.

*Califica este resumen:* [Útil](https://google.qualtrics.com/jfe/form/SV_4YkxrBAaiTVqYCi?isGoogler=false&isHelpful=true) o [Poco útil](https://google.qualtrics.com/jfe/form/SV_4YkxrBAaiTVqYCi?isGoogler=false&isHelpful=false)

### Próximos pasos

- [ ] \[Frank Saavedra\] Implementar Checkbox: Cambiar lista desplegable por checkbox para asignar sucursales a empresas.

- [ ] \[Frank Saavedra\] Detección Duplicados: Agregar funcionalidad para detectar colaborador existente. Ofrecer opción de actualizar perfil en lugar de duplicar registro.

- [ ] \[Frank Saavedra\] Modificar Agendamiento: Cambiar flujo de agendamiento de citas. Priorizar selección de empresa antes de seleccionar trabajador para búsqueda eficiente.

- [ ] \[Frank Saavedra\] Corroborar Datos: Añadir paso para corroboración de datos del trabajador. Implementar verificación de información al momento de la llegada.

- [ ] \[Frank Saavedra\] Crear Vista Agendas: Desarrollar nueva pantalla independiente. Mostrar agendas diarias simultáneas de las 3 sucursales.

- [ ] \[Frank Saavedra\] Mover Agudeza Visual: Mover la prueba Agudeza Visual al módulo Sala. Asegurar que este paso sea realizado por la enfermera.

- [ ] \[Frank Saavedra\] Eliminar Triaje: Eliminar la clasificación Triaje de la sección. Renombrar la sección Somatometría.

- [ ] \[Frank Saavedra\] Desarrollar Perfiles: Trabajar en la lógica de empresas cliente. Implementar perfiles de exámenes y estudios autorizados.

- [ ] \[leticia uribe\] Compartir Estudios: Enviar lista depurada y clasificada de estudios. Incluir tipologías de Laboratorio, Imagen y Ambulancia.

- [ ] \[leticia uribe\] Enviar Archivo: Compartir el archivo de datos actual inmediatamente. Usar WhatsApp o canal preferido para el envío.

- [ ] \[El grupo\] Limpiar Base: Ejecutar la limpieza de la base de datos de perfiles. Compartir la base limpia con Frank para la carga.

- [ ] \[Frank Saavedra\] Responder Pacientes: Contestar a 4 pacientes específicos de Leticia Uribe.

### Detalles

* **Configuración de Sucursales y Capacidad de Atención**: Frank Saavedra está desarrollando una sección para dar de alta las sucursales, que actualmente incluye campos para el nombre, la dirección completa, el teléfono, el encargado, la hora de apertura y cierre, y la capacidad de personal para atender por hora ([00:00:00](#00:00:00)). La capacidad de personal por hora es crucial porque las citas no son lineales y se basan en una cierta capacidad de atención por hora, que puede ser ajustada en cualquier momento, aunque hay un ajuste preestablecido ([00:06:56](#00:06:56)). Leticia Uribe señaló que en la lista de sucursales faltan tres más, sumando un total de cuatro con las unidades móviles ([00:00:00](#00:00:00)).

* **Gestión de Empresas y Asignación de Sucursales**: La interfaz incluye una sección para dar de alta a las empresas que contratan los servicios. Leticia Uribe sugirió que esta sección debería capturar datos como la cantidad de clientes que aporta la empresa, similar a un Excel de recortes ([00:06:56](#00:06:56)). Frank Saavedra mencionó que se puede asignar una sucursal a la empresa en cualquier momento. Surgió una duda sobre si la asignación de sucursales debería ser por empresa o por trabajador, y se confirmó que es \*\*por empresa\*\*. Además, Leticia Uribe planteó que cualquier empresa puede enviar trabajadores a cualquier sucursal, por lo que propuso que en lugar de una lista desplegable para asignar sucursales, se utilice una \*\*casilla de verificación (checkbox)\*\* o que la opción esté disponible para las tres sucursales sin seleccionar ninguna por defecto ([00:08:17](#00:08:17)).

* **Registro y Actualización de Trabajadores**: Después de dar de alta una empresa, se puede registrar a sus trabajadores, ya sea mediante un listado de la empresa, cuando el trabajador llama para programar una cita, o a través del asesor de ventas o la recepcionista ([00:08:17](#00:08:17)). Los datos de registro incluyen nombre y fecha de nacimiento. Si un trabajador cambia de empresa, se puede seleccionar la nueva empresa sin que esto afecte la base de datos anterior. El historial médico del trabajador permanece ligado a su registro original, por ejemplo, un examen médico realizado cuando estaba en BCORP se mantiene registrado bajo BCORP, y solo se actualizaría la información del colaborador en el sistema ([00:09:46](#00:09:46)).

* **Identificación Única de Trabajadores y Manejo de Duplicados**: Para evitar trabajadores repetidos, a cada trabajador se le asignará un ID único y un código QR, creando una credencial permanente. Esto significa que si un trabajador regresa, solo necesitaría actualizar su información (como el número de teléfono) o cambiar la empresa a la que pertenece. Frank Saavedra admitió que aún no había considerado qué sucedería si se intenta dar de alta a un trabajador (como Francisco Saavedra) que ya existe en el sistema ([00:11:14](#00:11:14)). Leticia Uribe sugirió que el sistema debería notificar que el colaborador ya existe y solo ofrecer la opción de actualizar su información. En caso de homónimos (dos personas con el mismo nombre, como dos Leticias Uribe), Frank Saavedra explicó que se asignará un ID identificador, similar a la homoclave de tres dígitos utilizada en el RFC (Registro Federal de Contribuyentes), para distinguirlos ([00:12:23](#00:12:23)).

* **Mejoras en el Flujo de Agendamiento de Citas para Trabajadores**: El sistema actual permite a la secretaria agendar citas directamente después de dar de alta al trabajador. Leticia Uibe señaló que la agenda de citas parece estar basada en el trabajador y no en la empresa, lo que genera problemas de usabilidad debido a la lista interminable de colaboradores (aproximadamente 20,000 al año) ([00:12:23](#00:12:23)). Leticia Uribe, tras revisar la funcionalidad de 'agendar cita' que muestra un desplegable para 'seleccionar trabajador', argumentó que no es una buena opción. Su propuesta fue que el filtro principal o identificador sea el cliente o la empresa, por lo que el proceso debería ser: \*\*primero seleccionar la empresa, y luego el trabajador\*\*, lo que reduciría la base de datos de 20,000 a solo 1,000 colaboradores por empresa. Frank Saavedra aceptó implementar esta modificación ([00:15:27](#00:15:27)).

* **Manejo de Errores Humanos en la Captura de Datos del Paciente**: Leticia Uribe expresó preocupación por el error humano en la captura (por ejemplo, uso de acentos, espacios dobles, o errores ortográficos como "Ramírez" con 'S' o 'Z'), que podría llevar a la duplicación de ID de pacientes ([00:15:27](#00:15:27)). Frank Saavedra inicialmente sugirió usar un corrector ortográfico o un identificador sin errores, como la CURP. Sin embargo, dado que el identificador único del trabajador se genera a partir de su nombre y apellidos, Leticia Uribe propuso utilizar una funcionalidad que escanee la INE (credencial de elector) del paciente, similar a los sistemas utilizados por Afore y la banca, para extraer los datos correctos (nombre, dirección) y evitar errores de captura ([00:17:23](#00:17:23)).

* **Proceso de Confirmación de Datos e Identificación con Recepción**: Discutieron el momento en que se confirmarían los datos del trabajador si se usa el escaneo de la INE. Frank Saavedra preguntó si esto anularía el registro telefónico previo. Leticia Uribe aclaró que el registro telefónico es necesario para apartar el espacio de la cita, pero el recepcionista tendría que confirmar o actualizar los datos cuando el paciente llega a la clínica. Esto es crucial para nombres inusuales o complejos que pueden ser mal registrados por teléfono, por lo que Frank Saavedra concluyó que debe agregar un paso para la \*\*corroboración de datos cuando el trabajador acuda\*\* ([00:19:14](#00:19:14)). Leticia Uribe confirmó que la actualización de datos en el perfil del trabajador no debería afectar su ID ([00:21:08](#00:21:08)).

* **Impacto de las Modificaciones en la Base de Datos Histórica**: Leticia Uribe expresó temor ante la modificación de perfiles debido a su experiencia con el sistema actual, donde modificar un perfil (por ejemplo, reducir el número de pruebas de 10 a 5\) afectaba retroactivamente el historial descargado, haciendo parecer que siempre se hicieron 5 pruebas ([00:21:08](#00:21:08)). Esto la obligaba a generar un nuevo perfil para cada cambio para preservar los datos anteriores. Frank Saavedra aseguró que este comportamiento es anómalo y que el nuevo sistema no funcionará de esa manera, y prometió realizar pruebas para generar confianza en la integridad de los datos ([00:22:43](#00:22:43)).

* **Visualización Simultánea de Agendas de Citas en Múltiples Sucursales**: Frank Saavedra mostró la pantalla de citas, que permite a las recepcionistas ver las citas de la sucursal en la que están asignadas. Leticia Uribe preguntó si sería posible tener \*\*visibilidad de las tres agendas simultáneamente\*\* en una sola pantalla, aunque no fuera la principal ([00:22:43](#00:22:43)). El motivo es estratégico: si una sucursal (ej., El Prado) tiene 80 citas y poca capacidad de personal, pero otra (El Márquez) solo tiene 2 citas, poder ver las tres agendas permitiría reubicar personal del Márquez al Prado. Frank Saavedra consideró que es muy posible implementar la visualización simultánea por día, incluso dividiendo la pantalla actual en tres, aunque advirtió que podría ser "abrumador" ([00:24:19](#00:24:19)). Leticia Uribe aceptó que la visualización simultánea se implemente en una \*\*pantalla independiente\*\* ([00:25:43](#00:25:43)).

* **Flujo de Pacientes en la Clínica (Piso Clínico)**: Al agendar una cita, el sistema genera un pase de entrada que puede llegar al teléfono del usuario o ser impreso. Frank Saavedra propuso usar un lector de código QR con el pase para que la secretaria identifique al paciente sin buscarlo, aunque Leticia Uribe confirmó que el acceso alternativo con el número de expediente también es necesario. La interfaz de "Piso Clínico" permite al personal indicar el estatus del paciente (llegó, en sala de espera, en consultorio, validación de estudios) ([00:25:43](#00:25:43)). La transición del paciente por la rutina clínica (enfermería, médico general, estudios) se refleja en el cambio de estatus en esta pantalla ([00:27:25](#00:27:25)). Cuando la cita finaliza, el médico debe cambiar el estatus a "por validar" ([00:28:41](#00:28:41)).

* **Definición de Roles y Tareas en el Examen Médico**: La atención en el consultorio se divide por roles ([00:30:25](#00:30:25)). Leticia Uribe explicó que la enfermera realiza la primera parte del examen, incluyendo la toma de signos vitales (presión arterial, oxigenación, temperatura, peso, talla) y la agudeza visual. El médico realiza la exploración física ([00:28:41](#00:28:41)) ([00:31:37](#00:31:37)). Leticia Uribe notó que en el sistema actual, la \*\*Somatometría\*\* y la \*\*Agudeza Visual\*\* aparecen bajo "Sala y Estudios", lo cual está bien, pero propuso que Agudeza Visual se pase explícitamente a la sección de "Sala" (enfermería) ([00:30:25](#00:30:25)). Frank Saavedra acordó mover Agudeza Visual a Sala ([00:31:37](#00:31:37)).

* **Clasificación Terminológica del Proceso Inicial**: Leticia Uribe cuestionó el uso del término \*\*"Triaje"\*\* en la sección de Somatometría, ya que el Triaje se utiliza para clasificar la urgencia en consultas médicas. Dado que el sistema en desarrollo es para estudios de nuevo ingreso o periódicos, Leticia Uribe sugirió reemplazar "Triaje" por solo \*\*"Somatometría"\*\*. Frank Saavedra aceptó el cambio. Leticia Uribe propuso reservar el concepto de clasificación (Triaje) para un futuro módulo de consultas o atención de urgencias ([00:31:37](#00:31:37)).

* **Integración de Baterías de Exámenes y Perfiles de Puesto/Empresa**: Discutieron el flujo de los estudios clínicos, que se realizan en la clínica (toma de sangre, orina, etc.) ([00:33:19](#00:33:19)). Leticia Uribe explicó el concepto de \*\*"Batería de Exámenes"\*\*: las pruebas que se realizan a un paciente dependen de su ocupación y la exposición a riesgos. Por ejemplo, un administrativo tiene un perfil de exámenes (médico, biometría), mientras que un trabajador expuesto a manejo de cargas tiene otro (radiografía de columna, laboratorios). Actualmente, el sistema utiliza una papeleta electrónica y física con casillas de verificación (checkboxes) para marcar los estudios que ya se realizaron (ej., audiometría), ya que las pruebas de laboratorio no arrojan resultados inmediatos ([00:34:44](#00:34:44)).

* **Implementación de Pruebas Individuales en el Piso Clínico**: Leticia Uribe preguntó si el paso de "consultorio" en el Piso Clínico se refería solo al examen médico general o si se desglosarían todas las pruebas según el perfil del colaborador, ya que las pruebas son realizadas por diferentes personas. Frank Saavedra y Leticia Uribe concluyeron que lo más óptimo es que el sistema muestre \*\*todos los pasos o pruebas de acuerdo al perfil asignado por puesto de trabajo y empresa\*\*, y que el personal pueda ir \*\*palomeando\*\* cada prueba a medida que se realiza ([00:36:30](#00:36:30)) ([00:56:04](#00:56:04)).

* **Estructura de Perfiles por Puesto y Cliente (Modelo Sodexo)**: Frank Saavedra intentó aclarar si los exámenes dependen del puesto o de la empresa, o de ambos. Leticia Uribe explicó que en el caso de clientes como Sodexo, existen dos variables: perfil de puesto \*\*y\*\* cliente más perfil de puesto. Sodexo provee servicio a múltiples clientes (ej., Procter, Banamex, Safrán) ([00:38:18](#00:38:18)). Para cada cliente, Sodexo maneja diferentes perfiles de puesto (ej., ayudantes de cocina, administrativos, mantenimiento), y las pruebas a realizar dependen del riesgo asociado a ese perfil/cliente ([00:40:14](#00:40:14)). Por ejemplo, el perfil "Banamex Querétaro" podría requerir solo tres pruebas, mientras que el perfil "Prócter Milenio" podría requerir una lista mucho más extensa ([00:41:57](#00:41:57)).

* **Acceso y Revisión de Estudios del SIM (Sistema de Información Médica)**: Leticia Uribe intentó mostrar a Frank Saavedra una papeleta de exámenes del sistema SIM actual (Sistema de Información Médica) que utilizan para ejemplificar la integración de pruebas, solicitando a Frank Saavedra que buscara los accesos que le había proporcionado Alan ([00:41:57](#00:41:57)). Tras una búsqueda fallida de los accesos por parte de Frank Saavedra ([00:43:45](#00:43:45)), Leticia Uribe compartió su pantalla del SIM para demostrar el flujo de atención en recepción ([00:51:41](#00:51:41)).

* **Flujo Actual de Atención y Asignación de Perfiles de Puesto (SIM)**: Leticia Uribe mostró que en el SIM, el recepcionista registra al paciente (nombre, fecha de nacimiento, género, teléfono), y el sistema genera el RFC con homoclave ([00:51:41](#00:51:41)). Luego se selecciona la empresa y el perfil con el que se atenderá el paciente. La secretaria sabe qué perfil asignar porque la empresa lo indica previamente por correo electrónico al solicitar la cita ([00:53:11](#00:53:11)). Leticia Uribe mostró el perfil "Safran" de la empresa Sodexo, que tiene un perfil único para todos sus colaboradores, sin necesidad de ramificaciones por puesto de trabajo ([00:54:34](#00:54:34)). El flujo de atención de Safran incluye laboratorios (muestras fecales, raspado de exudado faríngeo), somatometría, agudeza visual y examen médico con el doctor ([00:56:04](#00:56:04)).

* : 1\.  Trabajar en la sección de \*\*empresas cliente\*\* para agregar los perfiles.  
  2\.  Incorporar todos los estudios que Leticia Uribe tiene actualmente en el SIM\\\~=CITATION:32=\\\~.  
  3\.  Asegurarse de que el flujo de Piso Clínico muestre las pruebas individualmente según el perfil, con una opción para palomear su realización\\\~=CITATION:31=\\\~.  
  4\.  Realizar una prueba del sistema una vez que los perfiles y estudios estén integrados\\\~=CITATION:32=\\\~.

* **Clasificación y Barrido de Estudios (Público General)**: Leticia Uribe aclaró que ya limpiaron la base de datos de estudios junto con Yacky para evitar subir información innecesaria, y que compartirá esa lista ([00:57:29](#00:57:29)). Explicó que si un paciente viene a la clínica y no pertenece a ninguna empresa ("público en general"), la recepción debe seleccionar "sin perfil" y buscar las pruebas específicas que el paciente desea en una lista extensa. Por ello, Leticia Uribe y Yacky clasificaron los estudios en categorías como Laboratorio, Generales, Imagen y Ambulancia, para facilitar la búsqueda ([00:58:39](#00:58:39)).

* **Clasificación y Limpieza de Datos de Estudios**: LETICIA URIBE informó que la base de datos de estudios ha sido clasificada y limpiada, con los nombres correctos establecidos, y está organizada por tipo de estudio, incluyendo laboratorios, estudios generales y estudios de imagen (aunque los estudios de imagen aún están incompletos, mencionando RXD, Corona, \*crape\* y lateral) ([01:00:29](#01:00:29)). También se incluyeron datos de ambulancia en lo que se ha limpiado ([01:02:08](#01:02:08)).

* **Datos Pendientes de Clasificación y Limpieza**: Se señaló que la columna inicial de la base de datos limpia aún le faltan todas las clasificaciones de rayos X y deben limpiarse antes de enviarse. LETICIA URIBE propuso enviar el archivo inmediatamente a FRANK SAAVEDRA, pidiéndole que ignorara las columnas incompletas y prometiendo enviarlas una vez que se completara la limpieza. FRANK SAAVEDRA aceptó esta propuesta ([01:02:08](#01:02:08)).

* **Campo Editable para Análisis Bacteriológicos en Estudios de Laboratorio**: En la sección de laboratorio de la base de datos, LETICIA URIBE añadió una columna adicional para incluir un campo editable que especificaría el tipo de análisis bacteriológico, en caso de existir una papeleta. El propósito de este campo es evitar crear un análisis separado para cada tipo de prueba bacteriológica (como de superficies inertes, agua o alimentos). FRANK SAAVEDRA sugirió reemplazar el campo editable por una casilla de verificación (\*checkbox\*) adicional, ya que los campos editables podrían generar errores ([01:02:08](#01:02:08)). LETICIA URIBE confirmó que la explicación sobre los perfiles, la batería de estudios o el puesto de trabajo del colaborador ahora estaba más clara, a lo que FRANK SAAVEDRA estuvo de acuerdo, reconociendo que era una de las partes más complejas del proceso ([01:03:45](#01:03:45)).

* **Solicitud de Envío Inmediato del Archivo**: FRANK SAAVEDRA solicitó a LETICIA URIBE que le enviara el archivo inmediatamente por WhatsApp o por el medio que prefiriera, para poder trabajar en ello "en caliente" (de inmediato). Indicó que esto era crucial para evitar el olvido y para confirmar si las ideas que tenía funcionarían ([01:03:45](#01:03:45)).

* **Presentación de la Base de Datos de Perfiles del SIM**: LETICIA URIBE procedió a mostrar otra base de datos de perfiles que está actualmente en el sistema SIM ([01:03:45](#01:03:45)). Antes de mostrarla, preguntó por el correo electrónico actualizado de \*Jacki\*, y después de una confirmación (que el nuevo es el de "coordinador clínico"), presentó la base de datos ([01:05:07](#01:05:07)).

* **Estructura de la Base de Datos de Clientes y Perfiles Actuales**: LETICIA URIBE explicó que las bases de datos de clientes y perfiles necesitan ser limpiadas, pero contienen la información que está actualmente en el sistema ([01:05:07](#01:05:07)). La base de datos de clientes incluye información como la razón social y el RFC, la cual es extraída de un formulario de la página web (aunque actualmente la administración la transcribe, y se necesita actualizar el formulario y la página web para automatizar la extracción de la información fiscal del cliente) ([01:08:30](#01:08:30)).

* **Detalles de la Base de Datos de Perfiles**: La base de datos de perfiles incluye el ID del perfil, el estado (si está activo o no), la descripción, el nombre del contacto al que se envía el resultado, el tiempo de entrega del resultado, el formato de entrega (físico, electrónico o ambos), el género del paciente, el puesto del colaborador, la empresa, el tipo de proyecto, los correos electrónicos de envío, el teléfono de contacto, el tipo de examen, el formato de entrega del examen, el ID del examen, los exámenes por prueba, y el asesor que atiende al cliente. LETICIA URIBE enfatizó la importancia de clasificar por género, ya que existen perfiles exclusivos, citando como ejemplo que un perfil femenino podría incluir una prueba de embarazo y uno masculino un perfil prostático ([01:08:30](#01:08:30)). Toda la información detallada en esta base de datos es la misma que se muestra en una pantalla específica ([01:10:36](#01:10:36)).

* **Migración de Perfiles al Nuevo Sistema**: FRANK SAAVEDRA preguntó si los perfiles existentes en la base de datos se deben dar de alta tal como están o si se deben volver a dar de alta. LETICIA URIBE propuso que se mantuviera la base de datos, recordando que ya le había enviado un documento Word describiendo la base de perfiles ideal ([01:10:36](#01:10:36)). El plan es que Alan y LETICIA URIBE limpien la base de datos de perfiles, y una vez que esté limpia, la compartirán con FRANK SAAVEDRA para que la suba al nuevo sistema, evitando así "subir basura" ([01:12:25](#01:12:25)).

* **Plan de Acción y Cierre**: Ambos acordaron que la información presentada estaba muy clara para el lunes. LETICIA URIBE preguntó a FRANK SAAVEDRA si debía informarle a Alan sobre los cambios, pero FRANK SAAVEDRA indicó que no era necesario verle ([01:12:25](#01:12:25)). LETICIA URIBE informó que estará fuera la semana siguiente y que cualquier comunicación deberá ser por mensaje a su número personal . FRANK SAAVEDRA se comprometió a responder a cuatro pacientes de LETICIA URIBE mientras ella está ausente .

*Revisa las notas de Gemini para asegurarte de que sean precisas. [Obtén sugerencias y descubre cómo Gemini toma notas](https://support.google.com/meet/answer/14754931)*

*Cómo es la calidad de **estas notas específicas?** [Responde una breve encuesta](https://google.qualtrics.com/jfe/form/SV_9vK3UZEaIQKKE7A?confid=oYGEuAr5YdIV-HkJBzlqDxIYOAIIigIgABgBCA&detailid=detailed&screenshot=false) para darnos tu opinión; por ejemplo, cuán útiles te resultaron las notas.*

# 📖 Transcripción

6 mar 2026

## Reunión del 6 mar 2026 a las 09:35 CST \- Transcripción

### 00:00:00 {#00:00:00}

   
**Frank Saavedra:** vecinos y que ya ocurrió el desafío de trabajadores y adultos Ah.  
**leticia uribe:** Hola,  
**Frank Saavedra:** Hola. Hola.  
**leticia uribe:** ¿cómo estás?  
**Frank Saavedra:** Bien. ¿Y tú?  
**leticia uribe:** Bien también.  
**Frank Saavedra:** Creo tienes to. Creo tienes to.  
**leticia uribe:** No, ¿por qué se escucha?  
**Frank Saavedra:** Sí, se escucha.  
**leticia uribe:** No, este te acaba de escribir Alan que si va a haber reunión.  
**Frank Saavedra:** Ni me acordaba.  
**leticia uribe:** Te estoy diciendo este,  
**Frank Saavedra:** No me acordaba de eso.  
**leticia uribe:** ¿quieres proyectarme tu pantalla para ver lo de las  
**Frank Saavedra:** Sí,  
**leticia uribe:** citas?  
**Frank Saavedra:** ahí va. Ahí ya lo ves. Bueno, esto es lo que llevo avanzado. Te cuento todo, ¿no? Eh, mira, la idea es primero pues se dan de alta las sucursales, ¿no?  
**leticia uribe:** Ahí falta son tres, bueno, cuatro con  
**Frank Saavedra:** Sí, sí, todavía no las do de alta todas.  
**leticia uribe:** móviles.  
**Frank Saavedra:** Bueno, le das alta de sucursal, viene el nombre, la dirección completa, el teléfono, el encargado, apertura, cierre y la capacidad de personal que puedan atender por hora.  
   
 

### 00:06:56 {#00:06:56}

   
**Frank Saavedra:** Es como lo estoy manejando ahorita. Es como tú me decías, sus citas no son lineales, entonces tiene su cierta capacidad de atención,  
**leticia uribe:** Ah,  
**Frank Saavedra:** ¿no?, por hora. Entonces aquí puede variar, no sé, le puedes poner cinco según la sucursal. ¿Cuál es la En cualquier momento la puedes  
**leticia uribe:** esto se puede modificar diario.  
**Frank Saavedra:** modificar?  
**leticia uribe:** Ah, okay,  
**Frank Saavedra:** Este es un ajuste como preestablecido,  
**leticia uribe:** okay.  
**Frank Saavedra:** pero lo puedes modificar tú en cualquier momento. Ajá.  
**leticia uribe:** Todavía no termino de  
**Frank Saavedra:** Mira aquí en la del Prado, 15 pacientes.  
**leticia uribe:** llenar.  
**Frank Saavedra:** Entonces, en base a eso se se va haciendo lo de la gestión de las citas, por eso es importante. Aquí está. Ahora las empresas de las empresas aquí es donde tú las das de alta. Todavía no está completo. Falta todavía que le agregue varias cosas, ¿no? Para nuestros fines es más que suficienturas.  
**leticia uribe:** también quieres el Eso es cuando ya una empresa nos dice que sí,  
**Frank Saavedra:** Ajá. cuando ya es tu  
**leticia uribe:** de habitar, cuánto cliente,  
   
 

### 00:08:17 {#00:08:17}

   
**Frank Saavedra:** cliente.  
**leticia uribe:** tanto es cortes como un Excel por  
**Frank Saavedra:** Y bueno, aquí le asignas la sucursal, ¿no? Esa se la puedes asignar tú en cualquier momento a la empresa.  
**leticia uribe:** aquí.  
**Frank Saavedra:** Ahí, ahí me quedó una duda. ¿Se asignan por empresa o por trabajador?  
**leticia uribe:** por empresa. Justo por eso también quería que me lo explicaras, porque ya que lleguemos al punto de las citas, tengo duda. Ahora aquí eh cualquier empresa me puede mandar a cualquier sucursal.  
**Frank Saavedra:** Ah, sí, eso es posible.  
**leticia uribe:** Entonces no sé si sea mejor en lugar de una lista desplegable un checkbox y que no o que esté para las tres que no se seleccione ninguna.  
**Frank Saavedra:** Sí, mira, después de que das de alta la empresa, pues obviamente el trabajador lo puedes dar de alta,  
**leticia uribe:** M.  
**Frank Saavedra:** lo puedes dar de alta si te dan un listado de empresas o dos, cuando él vaya a acudir, que te llame para hacer su cita o cualquier otra forma. Digo, esas son las dos formas iniciales, ¿no? O que las dé de alta tu vendedor es el el asesor,  
**leticia uribe:** recepcionista.  
**Frank Saavedra:** ¿no?  
**leticia uribe:** Ah, o el recepcionista.  
   
 

### 00:09:46 {#00:09:46}

   
**Frank Saavedra:** Ah, o la recepcionista te llama.  
**leticia uribe:** Hm.  
**Frank Saavedra:** Entonces, nos puede ya dar de alta. Aquí está. Aquí puede dar de alta el trabajador. Registra al trabajador, le pone el nombre.  
**leticia uribe:** Mhm.  
**Frank Saavedra:** su fecha de nacimiento.  
**leticia uribe:** ¿Y qué pasa si el trabajador cambia de empresa?  
**Frank Saavedra:** Puedes tú seleccionar la empresa que quieras.  
**leticia uribe:** Pero no este afecta la base de datos  
**Frank Saavedra:** No afecta absolutamente nada.  
**leticia uribe:** anterior,  
**Frank Saavedra:** El historial del trabajador sigue estando ahí, solamente que ahora va a estar ligado a otra  
**leticia uribe:** pero por ejemplo, vamos a suponer que le hicimos un examen médico cuando el el trabajador pertenecía  
**Frank Saavedra:** empresa.  
**leticia uribe:** a BCORP, Pero eh ahora pertenece a el examen médico de Becorp se queda como Becor.  
**Frank Saavedra:** Así es.  
**leticia uribe:** Okay. Solamente sería actualizar al colaborador.  
**Frank Saavedra:** Hm. Sí.  
**leticia uribe:** ¿Qué pasa cuando eh yo quiero dar de alta un colaborador que existe? ¿Qué me dice el sistema y qué tendría que hacer?  
**Frank Saavedra:** ¿Qué es un colaborador?  
**leticia uribe:** Eh,  
**Frank Saavedra:** Un colaborador, ¿a qué te refieres?  
   
 

### 00:11:14 {#00:11:14}

   
**leticia uribe:** un  
**Frank Saavedra:** Ah,  
**leticia uribe:** trabajador.  
**Frank Saavedra:** ¿cómo? A ver, no te entendí esa pregunta.  
**leticia uribe:** ¿Qué pasa si quiero dar de alta un trabajador que ya existe, que ya tendría en el pasado? ¿Qué me dice el sistema y qué tendría que  
**Frank Saavedra:** Ah, mira,  
**leticia uribe:** hacer?  
**Frank Saavedra:** la idea de que un trabajador, él a él le vamos a dar un ID único, incluso se le va a proporcionar un código QR con el que va a poder registrarse.  
**leticia uribe:** Mhm.  
**Frank Saavedra:** Entonces, él va a tener una credencial permanente. Si vuelve a regresar contigo, es lo mismo, no tiene que hacer nada más.  
**leticia uribe:** Solo se tendría que cambiar de empresa.  
**Frank Saavedra:** Exacto.  
**leticia uribe:** Okay.  
**Frank Saavedra:** Ya no va a haber trabajadores  
**leticia uribe:** Y se y se actualizaría a lo mejor  
**Frank Saavedra:** repetidos.  
**leticia uribe:** probablemente el número telefónico. Okay. Si tú,  
**Frank Saavedra:** Ajá.  
**leticia uribe:** por ejemplo, ahorita intentas dar de alta otra vez a Francisco Saavedra, ¿qué te dice el sistema?  
**Frank Saavedra:** Mm, eso no lo he considerado aquí.  
**leticia uribe:** Okay.  
**Frank Saavedra:** todavía.  
   
 

### 00:12:23 {#00:12:23}

   
**leticia uribe:** Porque yo me estoy imaginando que el sistema te diga que el colaborador ya existe y que solamente te dé la opción de actualizarlo.  
**Frank Saavedra:** Sí, eso puede funcionar.  
**leticia uribe:** ¿Qué pasa si hay dos Leticias Uribe que son diferentes personas?  
**Frank Saavedra:** va a haber un ID identificador. ¿Recuerdas como el RFC tiene tres dígitos identificadores por si hay ¿Cómo se llama?  
**leticia uribe:** homónimos.  
**Frank Saavedra:** Homónimos. Así mismo lo va a asignar.  
**leticia uribe:** Okay. Okay. Y luego ya se dio de alta el  
**Frank Saavedra:** Entonces, si esto lo si llamó y le dijo a la secretaria que lo va a dar de alta,  
**leticia uribe:** trabajador.  
**Frank Saavedra:** entonces la secretaria puede agendar la consulta aquí. Puede agendar ahí la cita.  
**leticia uribe:** Okay. Ahora, aquí veo que la agenda de citas es por trabajador, no por empresa.  
**Frank Saavedra:** Mhm.  
**leticia uribe:** Eh, esta opción no se me hace eh tan viable que sea así por trabajador, porque la lista de trabajadores que atendemos es interminable. Entonces, ¿cómo va a ser? eh en la búsqueda del trabajador.  
**Frank Saavedra:** la búsqueda del trabajador. A ver, tú tienes dos maneras de de hacer citas, ¿no?  
   
 

### 00:14:11

   
**leticia uribe:** Ajám.  
**Frank Saavedra:** Una es masivamente, ¿cierto?  
**leticia uribe:** Eso es para las unidades  
**Frank Saavedra:** Y otra es cuando Y otra es cuando el trabajador te llama para hacer su cita,  
**leticia uribe:** móviles.  
**Frank Saavedra:** ¿cierto?  
**leticia uribe:** Así es.  
**Frank Saavedra:** Bueno, esta está pensada nada más para cuando el trabajador te llama. Todavía no  
**leticia uribe:** Sí, pero la lista es interminable, o sea,  
**Frank Saavedra:** voy.  
**leticia uribe:** atendemos, no sé, 20,000 colaboradores al año. Entonces, cuando tú le das agendar cita, a ver,  
**Frank Saavedra:** Aha.  
**leticia uribe:** espérame un segundo, voy a a ver si tengo abierto todavía el sistema para irlo haciendo y y decirte mi idea. Dame un segundo. Ay, es que no sé dónde lo abrir. Estar aquí. No, no.  
**Frank Saavedra:** Aquí yo estoy suponiendo que es la primera vez que el trabajador va a  
**leticia uribe:** Okay. Ajá. Pero espérame,  
**Frank Saavedra:** agendar.  
**leticia uribe:** deme un minuto. Lo voy a lo voy a hacer. Aquí yo tengo, mira, tú le das agendar cita, ¿no?  
   
 

### 00:15:27 {#00:15:27}

   
**Frank Saavedra:** Aha.  
**leticia uribe:** Y cuando le das cita, la opción para darle cita dice seleccionar trabajador,  
**Frank Saavedra:** Mhm.  
**leticia uribe:** pero tengo miles de trabajadores en la base de datos, entonces no se me hace una buena opción que sea un desplegable de selección del colaborador.  
**Frank Saavedra:** En realidad sí lo es, porque te voy a poner un buscador ahí,  
**leticia uribe:** Sí,  
**Frank Saavedra:** ahí mismo.  
**leticia uribe:** pero para mí mi mi principal digamos  
**Frank Saavedra:** H.  
**leticia uribe:** que filtro o el principal e identificador tendría que ser el cliente o la empresa. Entonces, yo preferiría que la base de datos sea más reducida. Vamos a suponer que en lugar de seleccionar colaborador, primero seleccione la empresa y luego el trabajador para que entonces si tengo 20,000 colaboradores ya nada más tenga los 1000 de la empresa a la que quiero agendar. Sí, me explico.  
**Frank Saavedra:** Perfecto. Sí, lo podemos poner así.  
**leticia uribe:** Y este el buscador pues si sería este si sería idóneo para el tema del colaborador, ¿no? Ahora, hay algo que me preocupa en el tema de eh el error humano al momento de capturar la información del paciente. si le pongo acento, si no le pongo acento, si le pongo este doble espacio, cosas así.  
   
 

### 00:17:23 {#00:17:23}

   
**leticia uribe:** ¿Qué va a hacer el sistema en estos casos?  
**Frank Saavedra:** corregirlo.  
**leticia uribe:** ¿Cómo lo va a hacer?  
**Frank Saavedra:** Hm. con el corrector  
**leticia uribe:** O sea, pero hm para ser más específicos,  
**Frank Saavedra:** ortográfico.  
**leticia uribe:** este, ¿qué pasa si alguien escribe Ramírez con S y otro Ramírez con Z y entonces es el mismo es el mismo paciente, pero este se duplicó el ID porque este alguien lo escribió mal?  
**Frank Saavedra:** Podemos entonces vamos a tener que usar un identificador con el que no cometa errores, que capture su CUR, por ejemplo, porque yo realmente en los errores pues no puedo hacer mucho o  
**leticia uribe:** ¿Ves  
**Frank Saavedra:** cómo sugieres que fuera. Porque a partir de ahí recuerda que el identificador único del trabajador es gener es es generado a partir de sus nombres y apellidos.  
**leticia uribe:** que hay un sistema que no desconozco cómo se llama? Yo lo he hecho para eh mi Afore, para la banca, para algunas aplicaciones en donde te piden poner en la cámara de la computadora la INE  
**Frank Saavedra:** Ajá.  
**leticia uribe:** y trae los datos.  
**Frank Saavedra:** Y escanearla.  
**leticia uribe:** podría extraer los datos tal cual,  
**Frank Saavedra:** Escanearla.  
**leticia uribe:** nombre, este, eh, no sé, dirección, lo que aplique, ¿no?  
   
 

### 00:19:14 {#00:19:14}

   
**Frank Saavedra:** Ajá.  
**leticia uribe:** Eso podría aplicarse o no  
**Frank Saavedra:** Sí, pero ¿quién quién daría de alta la INE?  
**leticia uribe:** el recepción cuando el paciente llegue  
**Frank Saavedra:** ¿Y si hace la cita por teléfono?  
**leticia uribe:** sería como una manera de eh actualizar los datos cuando llegue el paciente.  
**Frank Saavedra:** O sea, el recepcionista tiene que que confirmar los datos.  
**leticia uribe:** Así es,  
**Frank Saavedra:** ¿Y  
**leticia uribe:** correcto.  
**Frank Saavedra:** está bien que haga esos dos pasos o tiene que hacer nada más uno?  
**leticia uribe:** Hm. Yo no creo  
**Frank Saavedra:** Entonces, no tendría caso que lo registrara cuando llama.  
**leticia uribe:** que  
**Frank Saavedra:** Si de todos va a  
**leticia uribe:** sí, sí tiene caso porque sí tiene caso porque aparta el el espacio de la cita.  
**Frank Saavedra:** Okay, entonces tiene que corregir datos.  
**leticia uribe:** Sí, te voy a decir por qué, o sea, digo, ahorita estamos hablando de nombres comunes, pero no te imaginas los nombres que de pronto llegan que te preguntas si realmente su nombre y si sí viene siendo su nombre en una intu,  
**Frank Saavedra:** Mhm.  
**leticia uribe:** ¿no? Entonces este,  
**Frank Saavedra:** Aha.  
**leticia uribe:** pues yo te lo puedo dictar por teléfono, tú me lo puedes eh registrar en el sistema para apartar el espacio de la cita.  
   
 

### 00:21:08 {#00:21:08}

   
**leticia uribe:** Pero cuando llegó resulta que el registro estaba mal porque pues eh no supe cómo se escribía ese nombre, ¿no? Digo, ahorita estoy hablando de un nombre común, pero este sí hay nombres de todo  
**Frank Saavedra:** Sí,  
**leticia uribe:** tipo.  
**Frank Saavedra:** sí lo podemos hacer. Entonces, necesito agregar un pas o más. Agregar. Necesitamos agregar la corroboración de datos cuando el el trabajador  
**leticia uribe:** Mm,  
**Frank Saavedra:** acuda.  
**leticia uribe:** que eso me surge otra duda. En el alta del trabajador también se podría actualizar los datos y no afecta el ID, ¿correcto?  
**Frank Saavedra:** Sí, no, no afecta nada. Oye, ¿por qué me preguntas que si afecta? Es muy raro. No.  
**leticia uribe:** Porque en el sistema actual este si yo modifico un perfil afecta la base de datos anterior. O sea, vamos a suponer que si yo le hacía 10 pruebas hoy, pero el cliente me dice, "A partir de mañana solamente quiero cinco." Este,  
**Frank Saavedra:** se eliminaba.  
**leticia uribe:** la toda la base de datos, pon tú del 24, si yo la llego a descargar, eh, parecería que solamente le hice cinco todo el tiempo hacia atrás y no los 10 que le hacía.  
   
 

### 00:22:43 {#00:22:43}

   
**leticia uribe:** Entonces, yo tengo que generar un nuevo perfil para que no afecte la base de datos  
**Frank Saavedra:** M.  
**leticia uribe:** anterior.  
**Frank Saavedra:** Okay. No es que así no funciona normalmente, pero okay. No, no pasa nada.  
**leticia uribe:** Pues en nuestra normalidad así funciona, entonces ya todo da  
**Frank Saavedra:** Sí, no,  
**leticia uribe:** miedo.  
**Frank Saavedra:** no, eso eso no debería de pasar.  
**leticia uribe:** Pues  
**Frank Saavedra:** Este sí, no, no te preocupes en ese sentido.  
**leticia uribe:** digo,  
**Frank Saavedra:** Y antes de eso, pues vamos a hacer pruebas para que tengas la confianza de empezar a llenarlo.  
**leticia uribe:** mme. ¿Qué más?  
**Frank Saavedra:** Hm. Bueno, vamos a confirmar aquí una cita, ¿no?  
**leticia uribe:** Mhm.  
**Frank Saavedra:** Aquí en la pantalla de citas podemos ver las citas, ya sea de Paseo del Prado o de cualquier sucursal. Esto es para que cualquiera de las recepcionistas que tengas pueda ver las citas en la sucursal donde  
**leticia uribe:** Justo de eso te iba a hacer un un cuestionamiento.  
**Frank Saavedra:** esté.  
**leticia uribe:** ¿Hay alguna manera en la que pudiéramos tener, a lo mejor no todos o o sí, no lo sé, visibilidad en algún punto de las tres agendas?  
   
 

### 00:24:19 {#00:24:19}

   
**Frank Saavedra:** Sí, claro. Tú das de alta a la recepcionista, le asignas la sucursal y solo va a haber las de esa  
**leticia uribe:** No,  
**Frank Saavedra:** sucursal.  
**leticia uribe:** pero me refiero a en una sola pantalla a ver las tres agendas porque va, vamos a suponer que hoy aquí en el Prado tenemos 80 citados, pero no tengo capacidad porque tengo poquitas personas en clínica,  
**Frank Saavedra:** Mhm.  
**leticia uribe:** eh médicos e enfermeras, pero en el Márquez solamente tengo dos citados. Y entonces yo digo, "Ah, bueno, entonces me traigo al personal del marqués para que podamos atender a los 80 de aquí. Entonces, si tengo visibilidad de las tres agendas al mismo  
**Frank Saavedra:** Al mismo tiempo las quieres.  
**leticia uribe:** tiempo, no en esta pantalla, o sea, porque sí es útil que la tenga así por su por su cursal, pero a lo mejor en una pantalla independiente poder tener las simultáneas.  
**Frank Saavedra:** por día nada más.  
**leticia uribe:** por día. Sí, sí. No, por  
**Frank Saavedra:** Ah, sí, sí, yo creo, o sea,  
**leticia uribe:** día.  
**Frank Saavedra:** es muy posible. De hecho, aquí te la podría poner por día. Si te fijas que da mucho espacio, podría dividir la pantalla en tres y no hay ningún problema, nada más que no sería un tanto abrumador  
   
 

### 00:25:43 {#00:25:43}

   
**leticia uribe:** Sí,  
**Frank Saavedra:** verla.  
**leticia uribe:** por eso te digo que no sea necesariamente en esta pantalla, puede ser en una nueva este en donde si tú quieres tener visibilidad de las tres, las tengas o solamente de una, pues la tengas en esta pantalla.  
**Frank Saavedra:** Okay. Mira, aquí ya hizo la cita. Si ves,  
**leticia uribe:** Mhm.  
**Frank Saavedra:** genera un pase de entrada.  
**leticia uribe:** Mhm.  
**Frank Saavedra:** este pase pues le puede le va a llegar o le puede llegar a su teléfono, al usuario o se lo pueden imprimir o algo.  
**leticia uribe:** Mhm.  
**Frank Saavedra:** Y con este pase mi idea es que tengan también ahí un lector de código QR para que la secretaria lo identifique y no lo tenga que buscar.  
**leticia uribe:** Si no tuviéramos un lector con el número de expediente, accesamos.  
**Frank Saavedra:** Exactamente.  
**leticia uribe:** Okay. Mm.  
**Frank Saavedra:** Digo, un lector son muy baratos y muy sencillos. Y aquí en esta pantallita,  
**leticia uribe:** Okay.  
**Frank Saavedra:** ¿viste el botón que piqué? Ese botón quiere decir que ya llegó porque tengo una pantalla de piso clínico.  
**leticia uribe:** Que ya llegó el pacientem.  
**Frank Saavedra:** Ajá. Ya llegó el paciente y la secretaria puede indicar si ya está aquí en sala de espera o si ya entró al consultorio o si sus ya se están validando sus estudios.  
   
 

### 00:27:25 {#00:27:25}

   
**Frank Saavedra:** Si ves,  
**leticia uribe:** Mhm.  
**Frank Saavedra:** si aquí yo le doy Fran Saavedra, pase por favor al consultorio. Ya se recorre aquí. Sí, lo viste.  
**leticia uribe:** No,  
**Frank Saavedra:** Bueno,  
**leticia uribe:** a ver otra vez.  
**Frank Saavedra:** le voy a dar a este de Laura a consultorio. Si  
**leticia uribe:** Ajá.  
**Frank Saavedra:** ves  
**leticia uribe:** Okay,  
**Frank Saavedra:** el consultorio.  
**leticia uribe:** okay. Mm. Aquí,  
**Frank Saavedra:** Ya.  
**leticia uribe:** aquí la idea es que, o sea, tienes una sala de espera,  
**Frank Saavedra:** Ajá.  
**leticia uribe:** pero eh a consultorio vas a poner cada una de las pruebas o simplemente es que pasa a que se le hagan las pruebas.  
**Frank Saavedra:** pasa que se le hagan las pruebas. O sea,  
**leticia uribe:** Okay.  
**Frank Saavedra:** aquí ya no está en sala de espera, ya no está ya no está ahí sentado, pues ya está en la rutina cómo la haga,  
**leticia uribe:** Okay.  
**Frank Saavedra:** ¿no? Que ya pasó a que ya pasó enfermería, que le tomen signos y todo eso y está pasando también con el médico general a que le haga su examen o está pasando a los estudios. Cuando cuando acaba la cita,  
   
 

### 00:28:41 {#00:28:41}

   
**leticia uribe:** E  
**Frank Saavedra:** la idea es que el médico haga un cambio de estatus y ya se cambia que está por validad.  
**leticia uribe:** en consultorio.  
**Frank Saavedra:** Mira, esto esto pasaría ya cuando está en consultorio, ¿no?  
**leticia uribe:** Tú le vas a dar a  
**Frank Saavedra:** No sé si o sea,  
**leticia uribe:** abrir.  
**Frank Saavedra:** ya por ejemplo en su tableta tal vez el primer paso es que pase con una enfermera,  
**leticia uribe:** Ajá.  
**Frank Saavedra:** ¿no?  
**leticia uribe:** que toma los signos  
**Frank Saavedra:** Entonces les da abrir la enfermera y aquí ya está,  
**leticia uribe:** vitales.  
**Frank Saavedra:** ¿no?  
**leticia uribe:** Mm, que es la primera parte del examen.  
**Frank Saavedra:** Aha.  
**leticia uribe:** Ahora se puede preguardar ciertos datos tipo, ah, este, yo hago la parte de agudeza visual que ya la tienes aquí, ¿no? Este,  
**Frank Saavedra:** Mhm.  
**leticia uribe:** pero aquí le faltan algunas cosas que hace la enfermera previo a que pase con el médico, que es, por ejemplo, la toma de presión arterial, este, la oxigenación, la temperatura, este el peso, la talla, este toda esa parte la enfermera previo a que  
**Frank Saavedra:** Aha.  
**leticia uribe:** pase al al médico y Después tienes aquí lo de la exploración física, que por lo que veo falta bastante este, pero puede haber como preguardados,  
   
 

### 00:30:25 {#00:30:25}

   
**Frank Saavedra:** como preguardados  
**leticia uribe:** o sea, porque te digo que una parte la hace la enfermera y otra parte la hace el médico.  
**Frank Saavedra:** que sí, mira, la idea es que sea por que sea por roles, ¿no? Eh, nada más hay que tienes que decirme exactamente cuáles son los que hace la  
**leticia uribe:** Mhm.  
**Frank Saavedra:** enfermera para ponerlos. Por ejemplo, este, cuando pasas a la o enfermería que  
**leticia uribe:** Ese de somatometría yo no lo veo.  
**Frank Saavedra:** tomes,  
**leticia uribe:** ¿En dónde está?  
**Frank Saavedra:** ¿cómo que en dónde está?  
**leticia uribe:** ¿A qué parte te fuiste?  
**Frank Saavedra:** De de somatometría. Me pasaste un archivo donde venía.  
**leticia uribe:** Ah, no, sí, pero en Ah, ya lo vi. Pero, ¿por qué no lo veía primero? No  
**Frank Saavedra:** No sé,  
**leticia uribe:** sé,  
**Frank Saavedra:** te digo que hay algo raro. Tus mensajes de WhatsApp me estaban llegando como retrasados.  
**leticia uribe:** pero solo contigo. Es que somatometría me aparece en sala y estudios y ya en estudios veo lo de agudeza visual. Okay. Ya, ya, ya, ya.  
   
 

### 00:31:37 {#00:31:37}

   
**leticia uribe:** lo por ejemplo eso de sala es lo que hace la enfermera, eso está bien. De hecho, la parte de agudeza visual también la hace la enfermera.  
**Frank Saavedra:** también la hace la  
**leticia uribe:** No sé si Ajá.  
**Frank Saavedra:** enfermera.  
**leticia uribe:** Entonces, no sé si quieras también agregarlo a  
**Frank Saavedra:** Ah,  
**leticia uribe:** Sala y  
**Frank Saavedra:** pues lo paso allá y exploración física,  
**leticia uribe:** eso el  
**Frank Saavedra:** ¿quién lo hace?  
**leticia uribe:** médico.  
**Frank Saavedra:** Entonces, agudeza visual se pasa a sala.  
**leticia uribe:** Ahora es, ¿a qué te refieres con eso de triaje?  
**Frank Saavedra:** M. Pues es que normalmente en Triaje hacen eso. Bueno, al menos ahí en el IMS en triaje te toman todos esos para que te puedan pasar con el médico. Es como una revisión previa.  
**leticia uribe:** Ah, bueno, es que el triage se utiliza solamente para pacientes que van a consulta médica, o sea, como clasificas la urgencia de la consulta.  
**Frank Saavedra:** Okay.  
**leticia uribe:** Entonces, este, pues creo yo que solamente tendría que decir somatometría.  
**Frank Saavedra:** Entonces, le quitamos triaje ahí y solo le ponemos somatometría.  
**leticia uribe:** A lo mejor para para el módulo de consultas o atención de urgencias, este, no sé cómo se vaya a llamar porque no hemos llegado a ese punto, este, porque este es solamente para atención de estudios, ¿no?  
   
 

### 00:33:19 {#00:33:19}

   
**leticia uribe:** estudios de nuevo ingreso o periódicos, pero pues también atendemos consultas para las consultas ya entonces sí ponemos una clasificación de la izquierda.  
**Frank Saavedra:** Okay.  
**leticia uribe:** Entonces,  
**Frank Saavedra:** Oye,  
**leticia uribe:** ajá,  
**Frank Saavedra:** y aquí en cuanto a lo ahorita que llegamos a lo de estudios  
**leticia uribe:** izquierda.  
**Frank Saavedra:** física, eh aquí estos estudios, ¿cómo? Obviamente cuando llegan a la cita se los hacen, ¿no?  
**leticia uribe:** Cuando llegan a la cita. ¿Qué?  
**Frank Saavedra:** Se los hacen algunos,  
**leticia uribe:** Todos.  
**Frank Saavedra:** todos ustedes los hacen ahí. Estos que dice estudios sim clínicos, todos los hacen ahí, ¿no? En la clínica.  
**leticia uribe:** Sí.  
**Frank Saavedra:** En ese en ese instante se los hacen y bueno, en ese rato los puede subir el que atiende, pero estos estudian le toman una muestra de sangre, ¿no? O cosas así.  
**leticia uribe:** Sí. o orina  
**Frank Saavedra:** en ese momento los hacen. Okay. Es que entonces aquí falta un paso, ¿no?  
**leticia uribe:** izquierda  
**Frank Saavedra:** Que indiquemos si los estudios se van a hacer o no se se van a hacer. Por ejemplo, si son estudios Nova, tiene que decir algo como que se hizo toma de sangre para cierto estudio,  
   
 

### 00:34:44 {#00:34:44}

   
**leticia uribe:** es que  
**Frank Saavedra:** No.  
**leticia uribe:** en el SIM. Eh, aquí algo que no vi ahorita. En el SIM se genera una papeleta de atención, es una papeleta electrónica y física. Cada uno de los pacientes de acuerdo a la ocupación que tengan, este, se le realizan ciertos estudios. Si yo estoy expuesta a manejo de cargas, pues se me realiza radiografía de columna, laboratorios, examen médico, etcétera. Si yo soy solamente administrativo, se me realiza examen médico, biometría, ego, no sé, toxicológico y así, ¿no? Entonces, eso es a lo que nosotros pudiéramos llamar batería de exámenes. A ti se te realizan ocho exámenes de acuerdo al puesto de trabajo que tú tienes y a mí se me realizan cinco. Actualmente en el sistema que tenemos hay como unos checkbox en donde si bien el examen se hace en el momento, no se tiene el resultado en el momento como pasa en los laboratorios, o sea, toman una una muestra de sangre, pero después para tener los resultados se tiene que procesar en unos equipos especiales. Entonces, ¿para qué nos sirve esta prepapeleta? pues para ir marcando lo que ya se hizo, o sea, ya se realizó audiometría, le doy ahí en el checkbox, ya se realizó perometría, le doy checkbox el y así eh eh consecutivamente.  
   
 

### 00:36:30 {#00:36:30}

   
**leticia uribe:** Por eso te preguntaba en el paso de piso clínico, cuando tú dices va a consultorio, si se refiere que solamente va a examen médico o si vas a poner todas las pruebas porque tendría que ir caminando así de acuerdo a cada uno de sus perfiles que se  
**Frank Saavedra:** de acuerdo a cada uno de los perfiles que se asignan por  
**leticia uribe:** asignan por puesto de trabajo por empresa.  
**Frank Saavedra:** empresa. Okay. ¿Y cómo sería mejor? ¿Cómo te serviría más a ti que apareciera todo todo los los pasos aquí? ¿Eso te sería más fácil?  
**leticia uribe:** Déjame ver si eh  
**Frank Saavedra:** o que fuera en una sola pantalla todo y que se fuera y que fuera guardando resultados parciales.  
**leticia uribe:** objetivos. Yo consideraría, pero bueno, ahí como ya es más operativo, yo consideraría que fuera en una sola pantalla, ¿no es cierto? eh por pasos eh según las pruebas porque no las hace una sola persona. Pero déjame te enseño en una pantalla lo que te quiero  
**Frank Saavedra:** Okay.  
**leticia uribe:** explicar o lo que estoy tratando de explicarte los perfiles,  
**Frank Saavedra:** A ver, compárteme.  
**leticia uribe:** que me parece que en eso como que todavía siento que no te queda claro cómo lo llevamos.  
   
 

### 00:38:18 {#00:38:18}

   
**Frank Saavedra:** Sií, como a ver, por empresas la empresa tiene ciertos perfiles que autoriza a hacer, ¿no? En en su perfil de empresa viene todos los exámenes que están autorizados, pero esos esos esos autorizados también  
**leticia uribe:** Mm.  
**Frank Saavedra:** dependen del puesto que tenga por empresa, ¿cierto? O sea, son un total y parciales según el puesto o es al  
**leticia uribe:** Mira, por  
**Frank Saavedra:** revés.  
**leticia uribe:** ejemplo, Sobexo es uno de mis clientes. ISODEXO tiene dos variables, una por perfil de puesto y otra por cliente más perfil de puesto. ¿Por qué? Sodexo le brinda eh servicio a Procter, a Banamex, a Coti, a Safrán, a varias empresas. Ajá. Entonces,  
**Frank Saavedra:** ¿Dónde?  
**leticia uribe:** déjame ver aquí. No puedo hacer dibujos aquí en la pantalla, ¿no? Verdad. ¿Dónde está?  
**Frank Saavedra:** Sí, tiene pizarra.  
**leticia uribe:** Nunca he usado aquí la pizarra.  
**Frank Saavedra:** Ni yo nunca us hecho la pizarra, pero deja ver.  
**leticia uribe:** Bueno, a ver si puedo aquí rayarle, ¿no? Este es Sodexo, ¿no?  
   
 

### 00:40:14 {#00:40:14}

   
**leticia uribe:** Y Sodexo le brinda servicio a tres empresas. Ajá. Vamos a poner que este es Procter, vamos a poner que esta es este safrán y vamos a poner que este es Borpo, ¿no?  
**Frank Saavedra:** Aha.  
**leticia uribe:** Pero aparte de que le brinda servicio a esas tres empresas, en esas tres empresas maneja personal de diferentes perfiles, maneja ayudantes de cocina, administrativos, mantenimiento, trabajos en alturas, cocina y así en prócter, ¿no? Y en safrán maneja otros tres y en Bcord manejados. Ajá. Estos son perfiles de puesto,  
**Frank Saavedra:** Mhm.  
**leticia uribe:** que es lo que hace el colaborador en sitio. Y aquí estamos hablando de riesgos en sitio. Y estas son empresas o clientes a los que  
**Frank Saavedra:** He.  
**leticia uribe:** Sodexo les da servicio. Entonces, de acuerdo al riesgo del colaborador, son las pruebas que se le van a hacer. ¿A qué me refiero con pruebas? Aquí en nosotros cuando te decimos que tenemos n pruebas, estas son las pruebas que tenemos dadas de alta. Ajá. Todas estas pruebas son las que nosotros hasta el día de hoy realizamos.  
   
 

### 00:41:57 {#00:41:57}

   
**leticia uribe:** pueden incrementarse incluso diario o no sé,  
**Frank Saavedra:** Gracias.  
**leticia uribe:** una al mes dependiendo como nos las vayan solicitando. Entonces, de todas estas pruebas, yo me voy axo. Me voy a Banamex y yo voy a tener una papeleta que al perfil Banamex Querétaro se le hacen solamente tres pruebas:  
**Frank Saavedra:** para  
**leticia uribe:** electrocardiograma, examen médico y toxicológico. Ajá. Pero si me voy al perfil próxermilenio,  
**Frank Saavedra:** Aha.  
**leticia uribe:** se le hacen todas estas pruebas. Electrocardiograma, espirometría, química sanguínea, toxicológico, examen médico, audiometría, campimetría, rayos X, columna. Déjame ver si te tengo alguna papeleta que te pueda este mostrar porque yo no tengo acceso a esa parte del del Tú tienes el SIM, ¿no? Te dio un acceso Alan.  
**Frank Saavedra:** Sí,  
**leticia uribe:** A ver, métete,  
**Frank Saavedra:** sí tengo.  
**leticia uribe:** métete y yo te muestro una papeleta.  
**Frank Saavedra:** A ver, déjame ver.  
**leticia uribe:** estudio con  
**Frank Saavedra:** Accesos. Espérame.  
**leticia uribe:** Sí, porque yo no tengo esa parte, pero te puedo explicar dónde están.  
   
 

### 00:43:45 {#00:43:45}

   
**leticia uribe:** Bien.  
**Frank Saavedra:** H  
**leticia uribe:** Perfecto. Los públicos utilizados para recibir resultados. Hola. Ok. Ah, okay. Aita es mero trámite de inicio de relación comercial. En dado caso de las atenciones clínicas sí se tiene que hacer como tal el contrato en donde establecemos esto. Yaas nosotros podemos recibir a sus pacientes con los para realizar las pruebas que ustedes nos especifican.  
**Frank Saavedra:** Ah.  
**leticia uribe:** Dentro de esta especificación probablemente tendrán ustedes que compartirnos suar cuando es personal operativo y hacemos estas pruebas. Cuando es un administrativo estas otras cosas, cuando es un concentración de almacén, esa no es es la materia de que cada y en base a eso eh ya ahora sí plasmamos toda la información del computer donde nos especifica que ellos nos pueden mandar ya autorización pacientes durante todo el mes atendemos una vez que concluye ese mes, valgamos la relación de pacientes fundidas para una oito bueno o la generación compra. y sobre facturar hacemos también el tiempo de  
**Frank Saavedra:** Ay, que crees que no encuentro los accesos.  
**leticia uribe:** ponle depami a ver si buscándolos así de de  
**Frank Saavedra:** ¿Cuál es el link? ¿Recuerdas? A ver, pásame el  
   
 

### 00:46:32

   
**leticia uribe:** eh con assure websites.  
**Frank Saavedra:** link.  
**leticia uribe:** Déjame, te lo paso, pero te lo debieron haber pasado como deciamure website. Ya  
**Frank Saavedra:** Ya le enviaste. Mira,  
**leticia uribe:** o a quién se lo mandé.  
**Frank Saavedra:** me acaba de llegar. ¿Por qué?  
**leticia uribe:** No sé, eres tú. Sí, seguramente con Cristina Ramírez va a tener este mismo llamando  
**Frank Saavedra:** No, ¿qué crees que no me aparece? Ni  
**leticia uribe:** es que te debe de aparecer,  
**Frank Saavedra:** así  
**leticia uribe:** ¿no? Así te debe parecer como A ver, déjame ver si yo lo tengo así.  
**Frank Saavedra:** te copiaron a ti y no  
**leticia uribe:** No, espérame.  
**Frank Saavedra:** No.  
**leticia uribe:** Hola. Sí, al menor. Pero nos tiene que firmar el menor y el papá. El consentimiento. Sí, porque van a ir con los datos del menor. Va, de nada. Bye. Ajá. Ah, te iba a buscar la página, ¿verdad?  
**Frank Saavedra:** Ah.  
**leticia uribe:** Gracias. Gracias.  
   
 

### 00:48:55

   
**leticia uribe:** A ver. No, no sé cómo te lo hayan pasado, pero yo no tengo acceso a esa parte. Déjame ver si A ver.  
**Frank Saavedra:** No lo tengo. Qué raro.  
**leticia uribe:** te lo mandó por Whats, No.  
**Frank Saavedra:** A ver si me lo mandó por WhatsApp. Debo de tenerlo ahí.  
**leticia uribe:** Ponle asur nada más a ver si así te aparece.  
**Frank Saavedra:** Sí, me lo envié aquí.  
**leticia uribe:** siempre los manda por WhatsApp, casi toda la information. Por eso a mí me da algo si se me borra su WhatsApp.  
**Frank Saavedra:** Ya te compartí por si no quieres  
**leticia uribe:** A ver, deja, déjame. Sí, justo, déjame lo abro.  
**Frank Saavedra:** enseñar.  
**leticia uribe:** Espérame. La otra vez he estado eh ayudando a un a un este tipo de aquí y no sé qué fregado le piqué y borré el chat con Alan y yo, "No manches, eso me pasa por meterme lo que no me llama. Espérame. Ay, no entra. A, gracias por llamar a Buen día. Hola, buen día.  
   
 

### 00:51:41 {#00:51:41}

   
**leticia uribe:** Soy Omar de Hola. Eh, estoy marcando a la clínica del marqués. No sé por qué. Habla Leti. Se se redireccionó la llamada a mi teléfono. Yo creo que no tienen línea. ¿Cómo ves? De nada. ahí. Y yo, "What the f\*\*\*?" Mira, aquí tienes la parte de los pacientes y aquí cuando tú das de alta a un paciente, oy es que está superlento el internet. Cuando tú das de alta a un paciente, pues tú le pones, no sé, Francisco, ¿no? Francisco si es así.  
**Frank Saavedra:** Sí.  
**leticia uribe:** Marín,  
**Frank Saavedra:** Ah,  
**leticia uribe:** ¿no eres primo de Adriana Marín?  
**Frank Saavedra:** no.  
**leticia uribe:** Ah, no sé por qué se me vino ahorita eso. Fecha de nacimiento. ¿Qué fecha de nacimiento tienes?  
**Frank Saavedra:** Eh,  
**leticia uribe:** Ha,  
**Frank Saavedra:** 1990  
**leticia uribe:** 1990\. Esa ni es tu fecha. Ya, dime cuál.  
**Frank Saavedra:** 14 de septiembre de 1991\.  
**leticia uribe:** Ahora no.  
   
 

### 00:53:11 {#00:53:11}

   
**leticia uribe:** Ay, ya dime.  
**Frank Saavedra:** del HT4.  
**leticia uribe:** Ya estás, viejo.  
**Frank Saavedra:** Por eso querías que te dijera.  
**leticia uribe:** Septiembre.  
**Frank Saavedra:** Sí,  
**leticia uribe:** Okay.  
**Frank Saavedra:** 14\.  
**leticia uribe:** Entonces, pones género masculino, pones un teléfono cualquiera y aquí te genera el RFC con el ID, o sea, la homoclave diferente. La primera parte de tu RFC es igual, solo la homoclave cambia. Mm.  
**Frank Saavedra:** Oh.  
**leticia uribe:** Y aquí tú seleccionas qué empresa, con qué empresa te vas a atender, ¿no? ¿Qué es lo que hace recepción cuando hace una cuando hace la atención de un paciente?  
**Frank Saavedra:** Ese  
**leticia uribe:** Entonces, vamos a suponer que es la misma empresa de la que yo te venía hablando y vamos a seleccionar el perfil con el que yo te voy a atender. Entonces este va a ser  
**Frank Saavedra:** perfil, ¿cómo lo selecciona Leti?  
**leticia uribe:** eh  
**Frank Saavedra:** ¿Cómo sabe cuál cuál asignarle la secretaria?  
**leticia uribe:** porque al momento de que cual fuere que sea la persona que que genera la cita, nos dice con qué perfil se va a atender.  
**Frank Saavedra:** Y eso  
**leticia uribe:** Ahorita te ahorita te enseño un correo electrónico de esta empresa en  
   
 

### 00:54:34 {#00:54:34}

   
**Frank Saavedra:** sabe,  
**leticia uribe:** particular de cuando nos solic Ajá,  
**Frank Saavedra:** la misma empresa te manda el correo y te dice el perfil.  
**leticia uribe:** así es.  
**Frank Saavedra:** Ah,  
**leticia uribe:** Ajá. Va. Entonces aquí yo le doy vista previa del perfil.  
**Frank Saavedra:** B  
**leticia uribe:** Ay, no. Déjame agarrar un perfil que tenga más pruebas. Espérame, es que creo que agarré una empresa que ya ni existe. Es que la empresa cambió de razón sucia. Espérame. Ay, no veo. Ah, creo que es esta. A ver. No, si era la anterior. Espérame. Esto de exosa administrativo. M. Ah, perfil safran. A ver. Y le das vista previa de la papeleta. Este, entonces este es la empresa es Sodexo, su cliente es Afran. Y ese es el perfil. Todos los de Safrán llevan el mismo perfil. Entonces, aquí no necesité hacer como una rama diferente de por puesto de trabajo, porque todos los de Safran llevan el mismo perfil, ¿va?  
   
 

### 00:56:04 {#00:56:04}

   
**leticia uribe:** Estos Estas son las pruebas que se le hacen a Safran. Entonces, el pacientito va a llegar a que le hagan primero los laboratorios, porque si vienen hay uno tiene que entregar sus laboratorios y él va a entregar una muestra de esas fecales para estas dos pruebas y le van a hacer un raspado de exodado faringio este para esta prueba en laboratorio. y después va a pasar a su examen médico, que es donde pasa por la somatometría, el examen de agudeza visual y después pasa con el doctor. Entonces, yo lo que te decía es que nosotros tenemos un checkbox en donde aquí cuando ya esté el checkbox en okay, es quiere decir que ya se le hizo esa prueba. Actualmente el checkbox no está habilitado en el sistema. Lo que se hace es en la papeleta física, porque esta se imprime, en la papeleta física, este se marca con un marcatextos cuando ya se realizó la prueba. Por eso yo te preguntaba que si en la parte de paso a consultorio va a estar cada una de las pruebas según el perfil del colaborador  
**Frank Saavedra:** Yo creo que sí sería lo más sería lo mejor y que vayas ahí también  
**leticia uribe:** y y entonces que ahí ya tengas un check de que ya lo hiciste.  
**Frank Saavedra:** palomeando.  
   
 

### 00:57:29 {#00:57:29}

   
**Frank Saavedra:** Ajá. Entonces, fíjate, entonces necesito trabajar en la parte de voy a trabajar en la parte de empresas cliente, ¿no? Para agregar vez los perfiles y voy a meter todos esos estudios que tienes ahí en SIM, ¿te parece bien?  
**leticia uribe:** Así es, correcto. Los estudios  
**Frank Saavedra:** Y y entonces hacemos una prueba porque en realidad no podemos avanzar si  
**leticia uribe:** que  
**Frank Saavedra:** eso no  
**leticia uribe:** Así es.  
**Frank Saavedra:** está.  
**leticia uribe:** Los estudios, según yo, ya te los habíamos pasado, ¿no?  
**Frank Saavedra:** No me los debes.  
**leticia uribe:** O  
**Frank Saavedra:** Si me dijiste que me los ibas a pasar, pero pero lo saco de ahí del sim. Pongo  
**leticia uribe:** no,  
**Frank Saavedra:** esos  
**leticia uribe:** para porque ya le limpiamos la base de datos este Yacky y yo porque hay unos que no para que no esté subiendo basura.  
**Frank Saavedra:** que no.  
**leticia uribe:** Pues mira,  
**Frank Saavedra:** Okay, Entonces, por  
**leticia uribe:** déjame te déjame te comparto la que hicimos. Espérame, porque incluso los clasificamos porque si te checas. Ay, ay, no sé qué dice. Ay, güey, mi mente ya no te veo.  
   
 

### 00:58:39 {#00:58:39}

   
**leticia uribe:** Espérame. Ya, espérame, déjame te comparto. Mira, aquí pues si tú te checas esta este paciente tiene un perfil porque pertenece a una empresa. Ajá. Pero, ¿qué sucede si un paciente viene a clínica,  
**Frank Saavedra:** Hm.  
**leticia uribe:** no pertenece a ninguna empresa y quiere que se le hagan ciertas pruebas? recepción, selecciona público en general,  
**Frank Saavedra:** Ok.  
**leticia uribe:** selecciona sin perfil y de todas estas pinches pruebas tiene que buscar las pruebas que el pacientito quiere. Ajá. Entonces, lo que ya aquí y yo hicimos en el barrido de la información es lo siguiente. Ay, ay, Diosito santo. Diosito santo. Lo siguiente, clasificamos los estudios de acuerdo a donde pertenecen. Laboratorio, generales, imagen y ambulancia, que son las pruebas que puedes tener en el perfil. Sí,  
**Frank Saavedra:** Mm.  
**leticia uribe:** las estás viendo. Ay,  
**Frank Saavedra:** Síte  
**leticia uribe:** es que otra vez no sé qué hice con mis dos pantallas. Este,  
**Frank Saavedra:** mi pantalla para que no la para que no te  
**leticia uribe:** no, no, no.  
   
 

### 01:00:29 {#01:00:29}

   
**Frank Saavedra:** confundas.  
**leticia uribe:** Ya, ya, ya. Entonces, los clasificamos. Estos ya están limpios y con el nombre que deben de ir. Este, dame un segundo. Buen día, Teti. No sé, me extrañas. No te preocupes. Sale. Bye. Entonces,  
**Frank Saavedra:** ign  
**leticia uribe:** están clasificados por el tipo de estudio que hay. Aquí, por ejemplo, nada más puse una columna. Okay, cancelo. Buen día. Te tiende. Creo que no sé qué pasó con las líneas, que todas las llamadas se están redireccionando a mi extensión. Sí, de hecho, lo siento. Lo sé, lo sé. No, no sé por qué se están redireccionando para acá. Órale, pues. Sale. Bye. Perdóname, Fran. Ah, aquí ya están, estas ya están limpias la base de datos de estas y y lo que sugeríamos era que estén clasificados por eh tipo de estudio. Por ejemplo, aquí te pusimos todos los laboratorios, aquí todos los estudios generales, aquí todos los estudios de imagen.  
   
 

### 01:02:08 {#01:02:08}

   
**leticia uribe:** Bueno, faltan de imagen. De hecho, este, no sé por qué dinámica, pero RXD, Corona, crape y lateral. Okay. Y aquí todo lo de ambulancia. Esto es lo que llevamos limpio, pero de esto en la primera columna nos faltan todas las rayos X. Mira. Nos falta todo esto de clasificar y limpiar, por eso no te lo había mandado. Nos falta esto. No sé si no sé si quieres que te lo pase así y nada más no consideres estas y ya después  
**Frank Saavedra:** Pass.  
**leticia uribe:** estas te las mando cuando las hayamos limpiado. ¿Te parece?  
**Frank Saavedra:** Ok.  
**leticia uribe:** En este en esta primera de laboratorio dejé una columna adicional porque en este estudio eh nos gustaría que si existe una papeleta como la que te mostré, que podamos tener un campo editable que diga qué tipo de análisis bacteriológico es, porque hay varios tipos, hay de de superficies inertes, de agua, de alimentos, Y para no poner un análisis por tipo de bacteriológico, eh queremos que sea un campo editable, pero ya tú nos dices si es posible y si no, pues ya lo cambiamos, ¿va?  
**Frank Saavedra:** Pues mejor nada más también le ponemos un checkbox, ¿no?  
   
 

### 01:03:45 {#01:03:45}

   
**Frank Saavedra:** Adicional para porque editable no se presenta para  
**leticia uribe:** Ajá. Okay. Eh,  
**Frank Saavedra:** errores.  
**leticia uribe:** así te queda un poquito más claro lo que comentamos. siempre de los perfiles o la batería de estudios o el puesto de trabajo del colaborador.  
**Frank Saavedra:** Sí, de hecho es creo que es una de las partes más complejas.  
**leticia uribe:** Sí, sí. Pues seguramente como no es algo que que sea  
**Frank Saavedra:** Este,  
**leticia uribe:** tan habitual, pues este por  
**Frank Saavedra:** mira, malita,  
**leticia uribe:** eso.  
**Frank Saavedra:** mándame de una vez ese ese archivo WhatsApp o por donde tú  
**leticia uribe:** Mm.  
**Frank Saavedra:** quieras, eh, para hacerlo en caliente, ¿no? Para hacerlo de una vez. ahorita que que estoy aquí porque si no se me va a ir y ya tengo muchas ideas y confirmamos que funcionen los  
**leticia uribe:** Y déjame, ahorita te voy a mostrar otra data nada más. Espérame.  
**Frank Saavedra:** de ¿Qué es?  
**leticia uribe:** De la base de datos de perfiles que tenemos actualmente en el SIM.  
**Frank Saavedra:** A ver.  
**leticia uribe:** Espérame nada más. Tienes el correo de Jacki o es que se lo cambiaron y no me lo sé.  
   
 

### 01:05:07 {#01:05:07}

   
**leticia uribe:** ¿Te sabes el nuevo correo de Jacki? Fati. Ah, ya. coordinador clínico, creo, ¿no? Thanks. No, es coordinador clínico. en enero desde aquí. Desde ya aquí. Ay, espérame, espérame, Fran. Eh,  
**Frank Saavedra:** Sí.  
**leticia uribe:** lo puso es el nuevo aquí. Ah, entonces mejor este voy a poner ese porque no sé de quién sea este médico medio supervisor clínico, ¿verdad? Ajá. Ah, ya. Gracias, Fati. A ver, esta base de datos ya te la mandé. Déjame te muestro ahora la de perfiles.  
**Frank Saavedra:** M.  
**leticia uribe:** Aquí está. digo, estas bases de datos se tienen que relájate y cuenta  
**Frank Saavedra:** No veo,  
**leticia uribe:** hasta 10\.  
**Frank Saavedra:** no veo, no veo, no veo. Ya vin  
**leticia uribe:** Estas dos bases de datos se tienen que limpiar, pero este es lo que está actualmente en el sistema. Estas son las bases de datos de clientes y esta es la información que se captura del cliente.  
   
 

### 01:08:30 {#01:08:30}

   
**leticia uribe:** Eh, razón social, RF.  
**Frank Saavedra:** Eso es lo que necesitas.  
**leticia uribe:** Eh,  
**Frank Saavedra:** Eso es lo que  
**leticia uribe:** sí,  
**Frank Saavedra:** necesitas.  
**leticia uribe:** de hecho esto se puede extraer del formulario de la página web sin necesidad de que se transcriba, pero necesitamos actualizar el formulario y actualizar la página. Pero toda esta información nos la deposita el cliente en el formulario de la página web.  
**Frank Saavedra:** Ok.  
**leticia uribe:** Actualmente el de administración la transcribe, es toda su información fiscal. Vale, esto es esta es la base de datos de clientes y esta es la base de datos de perfiles. En la base de perfiles tenemos el ID del perfil, el estatus, si está activo o no, el la descripción del perfil que espam Buen día. Te atiend ¿Qué onda? 116\. Pero esto se puede de nada este el nombre del contacto de la persona a la que se le manda eh el resultado, en cuánto tiempo se tiene que entregar el resultado, el tiempo de entrega si es físico, electrónico, el género de del paciente, este es importante que se dice clasifique porque hay perfiles que que son exclusivos de pacientes hombres o mujeres. Por ejemplo, podemos tener un perfil sodexofrán femenino y sodexofrán masculino.  
   
 

### 01:10:36 {#01:10:36}

   
**leticia uribe:** En el caso del femenino se le puede hacer una prueba de embarazo y en el caso del masculino se le puede hacer un perfil prostático, ¿no? Y son pruebas que solo exclusivamente aplican para hombre o mujer. el puesto del colaborador, si se entrega físico o electrónico o ambos, la empresa, el tipo de proyecto, los correos electrónicos a donde se envían los resultados, el teléfono del contacto, el tiempo de el tipo de examen, el formato de entrega del examen, este es un ID de examen y y aquí vienen ya los exámenes. es que se le hacen este por pruebas y el asesor que atiende ese cliente, que es básicamente toda la información que viene aquí en esta pantalla. Es básicamente ay es básicamente la información que viene. Ah, que la canción es básicamente esta información la que está en esa base de datos.  
**Frank Saavedra:** Okay. Ahora, una pregunta, eh, los perfiles, ¿quieres que los dé alta tal como están ahorita en tu base de datos? ¿Se van a volver a dar de alta? O.  
**leticia uribe:** Yo creo que eh es bueno que dejemos la base.  
**Frank Saavedra:** Oh.  
**leticia uribe:** Ya por ahí te había mandado en en el Word que te mandé cuál era como la base de los perfiles en nuestro mundo ideal.  
   
 

### 01:12:25 {#01:12:25}

   
**leticia uribe:** Te había puesto que llevará el nombre de la empresa, el nombre del contacto al que se envían los resultados. los correos electrónicos. Yo creo que nada más ahorita pongamos la base y este lo que yo le decía a Alan la ocasión anterior que tú veniste es que limpiáramos la base de datos y una vez que se haya limpiado la base de datos, este, te la compartamos para que tú la subas este al nuevo sistema para no subir basura.  
**Frank Saavedra:** Okay,  
**leticia uribe:** di  
**Frank Saavedra:** muy  
**leticia uribe:** repór  
**Frank Saavedra:** bien.  
**leticia uribe:** cómo ves más claro para el  
**Frank Saavedra:** Muy claro,  
**leticia uribe:** lunes.  
**Frank Saavedra:** muy claro.  
**leticia uribe:** Okay. Ludas,  
**Frank Saavedra:** No, ninguna.  
**leticia uribe:** ¿qué hay que hacer? ¿Qué más te tengo que mandar?  
**Frank Saavedra:** Por ahora yo creo que esto es más que suficiente.  
**leticia uribe:** Bueno, pues no sé si quieras este comentarle a Alan o ver si vamos a verlos a ellos y decirle pues que vas a hacer cambios o que show.  
**Frank Saavedra:** Pues es que no tiene caso  
**leticia uribe:** Pues ahora sí que hay tú pues ahí contéstale.  
**Frank Saavedra:** verlos.  
**leticia uribe:** Gracias. De los Ya no te escucho y te veo pausado. No digo y no lo va a regresar. Y este para tú te  
**Frank Saavedra:** Te fuiste. ¿Te fuiste?  
**leticia uribe:** fuiste. No  
**Frank Saavedra:** Sí,  
**leticia uribe:** está  
**Frank Saavedra:** se me fue la luz. A ver. No,  
**leticia uribe:** en sección ella. Entonces le contestas tú a cuatro pacientes míos.  
**Frank Saavedra:** sí, yo le contesto.  
**leticia uribe:** Va, qué va.  
**Frank Saavedra:** Sale. Okay. Va, que va.  
   
 

### La transcripción finalizó después de 01:15:25

*Esta transcripción editable se ha generado por ordenador y puede contener errores. Los usuarios también pueden cambiar el texto después de que se haya generado.*