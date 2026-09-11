# Estructura de la Presentación en PowerPoint
**Curso:** Modelamiento y Automatización de Procesos Empresariales (MAPE)  
**Semestre:** 2026-2 | Pontificia Universidad Católica del Perú (PUCP)  
**Docente:** Marco Caldas  
**Entregable:** Presentación de Relevamiento, Documentación y Mejora de Procesos

---

## Esquema de Diapositivas (Slide by Slide)

### Diapositiva 1: Portada
* **Título:** Relevamiento y Documentación de Procesos Empresariales
* **Subtítulo:** Caso de Estudio en Campus Universitario PUCP: *[Nombre del Proceso]*
* **Curso:** Modelamiento y Automatización de Procesos Empresariales (MAPE 2026-2) - Práctica 1
* **Docente:** Marco Caldas
* **Integrantes del Grupo:** Nombres y códigos PUCP
* **Fecha:** Septiembre de 2026

---

### Diapositiva 2: Introducción y Contexto del Proceso
* **Ubicación y Entorno:** Unidad / Oficina / Servicio dentro del campus PUCP donde opera el proceso (ej. Biblioteca Central, Tesorería, DTI, Cafetería Central, Mesa de Partes de Facultad, etc.).
* **Justificación de la Elección:** ¿Por qué se seleccionó este proceso? (Relevancia para la comunidad universitaria, recurrencia, impacto o potencial de mejora).

---

### Diapositiva 3: Ficha Técnica del Proceso (Parte 1 - Puntos 1 y 2)
* **Datos del Involucrado:** Cargo del entrevistado y Área / Departamento al que pertenece.
* **Nombre del Proceso:** Denominación formal del proceso relevado.
* **Objetivo del Proceso:** Qué busca lograr y qué valor genera para el usuario/cliente interno o externo.
* **Alcance:**
  * **Límite Inicial (Trigger):** Evento o necesidad que activa el proceso.
  * **Límite Final:** Resultado que marca el fin de la ejecución.

---

### Diapositiva 4: Participantes y Roles (Parte 1 - Punto 3)
* **Matriz de Actores:**
  * Cliente / Usuario (ej. Alumno, Docente, Personal administrativo).
  * Rol operador directo (Entrevistado).
  * Roles de apoyo / supervisión / aprobación.
  * Áreas externas vinculadas.
* Breve descripción de la responsabilidad de cada rol dentro del flujo.

---

### Diapositiva 5: Entradas, Salidas y Recursos (Parte 1 - Punto 4)
* **Entradas (Inputs):** Solicitudes, requerimientos, datos del usuario, insumos o documentos iniciales.
* **Salidas (Outputs):** Entregables finales, comprobantes, registros actualizados, servicios concretados.
* Diagrama SIPOC o tabla resumen explicativa Entrada $\rightarrow$ Proceso $\rightarrow$ Salida.

---

### Diapositiva 6: Inventario de Documentos y Sistemas (Parte 1 - Puntos 5 y 6)
* **Formatos y Documentos:**
  * Lista de formatos físicos y digitales (fichas, tickets, formularios, reportes).
  * Estado/Uso de cada formato.
* **Sistemas de Información:**
  * Plataformas tecnológicas utilizadas (Campus Virtual, SAP, correo institucional, Google Workspace, sistemas internos específicos).
  * Rol que cumple cada sistema en la ejecución del proceso.

---

### Diapositiva 7: Evidencia de Relevamiento en Campo (Parte 1 - Punto 7)
* **Selfie Obligatorio:** Fotografía clara de los integrantes del grupo junto a la persona entrevistada en su puesto de trabajo.
* **Detalle del levantamiento:** Fecha, hora y lugar exacto del campus donde se realizó la entrevista.
* *(Opcional)* Fotos del entorno de trabajo, formatos impresos o pantallas operativas (cuidando datos sensibles).

---

### Diapositiva 8: Flujograma del Proceso en BPMN 2.0 (Camunda) - Vista General (Parte 2 - Punto 1)
* Captura de pantalla en alta resolución del modelo BPMN 2.0 modelado en **Camunda Modeler**.
* Identificación de:
  * **Pools y Lanes:** Carriles claramente delimitados por rol/área.
  * **Eventos:** Inicio, intermedios (si aplican) y Fin.
  * **Compuertas:** Lógicas de decisión (exclusivas, paralelas, etc.).

---

### Diapositiva 9: Desglose del Flujo y Reglas de Negocio
* Explicación de los tramos clave del flujo BPMN:
  * Camino feliz (Happy Path).
  * Caminos alternativos / excepciones (rechazos, validaciones fallidas, reintentos).
  * Flujos de información e interacción con los sistemas inventariados.

---

### Diapositiva 10: Inventario de Oportunidades de Mejora (Parte 2 - Punto 2)
* Tabla resumen con las problemáticas identificadas:
  * **Mejora 1:** *Descripción del punto de dolor + impacto actual.*
  * **Mejora 2:** *Descripción del punto de dolor + impacto actual.*
  * **Mejora 3:** *Descripción del punto de dolor + impacto actual.*
* Clasificación: (Eliminación de cuellos de botella, digitalización de papel, automatización de notificaciones, reducción de tiempos).

---

### Diapositiva 11: Propuestas de Solución y Visión Futura (TO-BE)
* Solución planteada para cada oportunidad de mejora descrita.
* Beneficios esperados (reducción de tiempo de ciclo, mayor satisfacción del usuario, menor tasa de error humano).

---

### Diapositiva 12: Conclusiones y Aprendizajes
* Principales aprendizajes del levantamiento en campo en el campus PUCP.
* Reflexión sobre la utilidad de la notación BPMN 2.0 en Camunda para estandarizar procesos reales.
* Agradecimientos a la unidad/área intervenida.
