# Proyecto Web Logia Teófilo Leal N°115

---

## HU-01 — Registro de aspirantes

Como aspirante  
Quiero registrarme en la plataforma ingresando mis datos  
Para solicitar ingreso a la logia de forma organizada  

### Criterios de aceptación
- Debe existir un formulario de registro  
- Debe solicitar nombre, correo, teléfono y motivo  
- Debe validar que los campos no estén vacíos  
- Debe mostrar mensaje de confirmación al enviar  

---

## HU-02 — Login de usuario

Como usuario registrado  
Quiero iniciar sesión con mi correo y contraseña  
Para acceder a mi cuenta dentro del sistema  

### Criterios de aceptación
- Debe existir formulario de login  
- Debe validar credenciales  
- Debe mostrar error si los datos son incorrectos  
- Debe redirigir al panel al iniciar sesión  

---

## HU-03 — Panel de administrador

Como administrador  
Quiero ver la lista de aspirantes registrados  
Para evaluar y gestionar las solicitudes  

### Criterios de aceptación
- Debe mostrar lista de usuarios registrados  
- Debe mostrar nombre, correo y estado  
- Debe permitir aprobar o rechazar solicitudes  

---

## HU-04 — Aprobación de aspirantes

Como administrador  
Quiero aprobar o rechazar aspirantes  
Para controlar el acceso a la logia  

### Criterios de aceptación
- Debe existir botón de aprobar/rechazar  
- Debe cambiar el estado del usuario  
- Debe reflejarse el cambio en la lista  

---

## HU-05 — Visualización de contenido institucional

Como visitante  
Quiero ver información de la logia  
Para conocer su propósito y actividades  

### Criterios de aceptación
- Debe existir página informativa  
- Debe mostrar historia, principios y contacto  
- Debe ser accesible sin login  

---

## HU-06 — Acceso restringido por usuario

Como usuario aprobado  
Quiero acceder a contenido exclusivo  
Para ver información interna de la logia  

### Criterios de aceptación
- Solo usuarios aprobados pueden acceder  
- Usuarios no aprobados no deben ver contenido interno  
- Debe redirigir si no tiene permisos  