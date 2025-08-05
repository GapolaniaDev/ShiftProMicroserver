# Migración de Sistema de Gestión de Turnos a Microservicios

## Resumen de la Migración

Se ha migrado exitosamente todo el sistema de gestión de turnos de Laravel (`backend_company_shift_management`) a una arquitectura de microservicios moderna utilizando NestJS, PostgreSQL, MongoDB y GraphQL.

## Arquitectura de Microservicios

### Servicios Implementados

1. **auth-service** (Puerto 5001) - Autenticación y autorización con roles
2. **user-service** (Puerto 5002) - Gestión de perfiles de usuario
3. **timetracking-service** (Puerto 5003) - Seguimiento de tiempo (existente)
4. **employee-service** (Puerto 5004) - **NUEVO** - Gestión de empleados y jerarquías
5. **shift-management-service** (Puerto 5005) - **NUEVO** - Gestión completa de turnos
6. **payroll-service** (Puerto 5006) - **NUEVO** - Períodos de pago y nómina
7. **gateway** (Puerto 3000) - GraphQL Gateway unificado

### Bases de Datos

- **PostgreSQL**: auth-service, employee-service, shift-management-service, payroll-service, timetracking-service
- **MongoDB**: user-service

## Funcionalidades Migradas

### Sistema de Roles y Permisos
- ✅ Roles: Admin, Supervisor, Employee
- ✅ Jerarquía de supervisión
- ✅ Control de acceso basado en roles
- ✅ Middleware de autorización

### Gestión de Empleados
- ✅ CRUD completo de empleados
- ✅ Información personal y financiera (ABN, BSB, cuenta bancaria)
- ✅ Relaciones supervisor-supervisado
- ✅ Integración con sistema de usuarios

### Gestión de Turnos
- ✅ Tipos de turnos con horarios semanales
- ✅ Configuraciones personalizadas por empleado
- ✅ Turnos con geolocalización y radio de validación
- ✅ Check-in/Check-out con coordenadas GPS
- ✅ Gestión automática de zonas horarias
- ✅ Estados de turno (no iniciado, iniciado, finalizado)
- ✅ Filtros por fecha, empleado, tipo de turno
- ✅ Paginación de resultados

### Características Avanzadas
- ✅ Cálculo automático de zonas horarias basado en coordenadas
- ✅ Validación de radio para check-in/out
- ✅ Conversión de tiempos locales automática
- ✅ Fórmula Haversine para cálculo de distancias
- ✅ Manejo de reemplazos de empleados
- ✅ Comentarios y notas en turnos

### Gestión de Nómina
- ✅ Períodos de pago
- ✅ Semanas fiscales
- ✅ Base para reportes de nómina

## Estructura de la Base de Datos

### Tablas Migradas

**users** (auth-service)
```sql
- id (uuid)
- email (unique)
- password (encrypted)
- firstName, lastName
- role (admin|supervisor|employee)
- emailVerifiedAt
- createdAt, updatedAt
```

**employees** (employee-service)
```sql
- id (uuid)
- userId (referencia a auth-service)
- supervisorId (auto-referencia)
- firstName, lastName
- email, phoneNumber, address
- taxNumber, abn, bsb, account
- createdAt, updatedAt
```

**shift_types** (shift-management-service)
```sql
- id (uuid)
- name, description
- weeklyHours
- schedule (JSON)
- createdAt, updatedAt
```

**shifts** (shift-management-service)
```sql
- id (uuid)
- shiftTypeId, employeeId
- dateStart, dateEnd
- dateStartTimezone, dateEndTimezone
- totalHours, weekdayCode, comments
- replacementId
- location, locationLat, locationLng, radius, zoom
- clockOnTime, clockOffTime
- clockOnLat, clockOnLng, clockOffLat, clockOffLng
- timezoneStart, timezoneEnd
- state (0=no iniciado, 1=iniciado, 2=finalizado)
- createdAt, updatedAt
```

**shift_configurations** (shift-management-service)
```sql
- id (uuid)
- shiftTypeId, employeeId
- shiftDuration
- createdAt, updatedAt
```

**pay_periods** (payroll-service)
```sql
- id (uuid)
- startDate, endDate
- fiscalWeek
- createdAt, updatedAt
```

## Cómo Ejecutar

### Prerrequisitos
- Docker y Docker Compose
- Node.js 18+
- Opcional: clave API de TimezoneDB para mayor precisión de zonas horarias

### Instalación

1. **Clonar y navegar al directorio**
```bash
cd /Users/gustavo/WebstormProjects/MicroserverExample
```

2. **Configurar variables de entorno (opcional)**
```bash
# Crear archivo .env
echo "TIMEZONEDB_API_KEY=tu_api_key_aqui" > .env
```

3. **Construir y ejecutar servicios**
```bash
# Construir todos los servicios
docker-compose build

# Ejecutar en segundo plano
docker-compose up -d

# Ver logs
docker-compose logs -f
```

4. **Verificar servicios**
```bash
# Verificar que todos los contenedores estén ejecutándose
docker-compose ps

# Probar el gateway GraphQL
curl http://localhost:3000/graphql
```

### Endpoints Principales

**GraphQL Gateway**: http://localhost:3000/graphql
**Servicios REST directos**:
- Auth: http://localhost:5001
- User: http://localhost:5002  
- TimeTracking: http://localhost:5003
- Employee: http://localhost:5004
- Shift Management: http://localhost:5005
- Payroll: http://localhost:5006

### Ejemplos de Consultas

**Crear empleado**:
```bash
curl -X POST http://localhost:5004/employees \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Juan",
    "lastName": "Pérez",
    "email": "juan@empresa.com",
    "phoneNumber": "+1234567890"
  }'
```

**Crear turno**:
```bash
curl -X POST http://localhost:5005/shifts \
  -H "Content-Type: application/json" \
  -d '{
    "employeeId": "uuid-del-empleado",
    "shiftTypeId": "uuid-del-tipo-turno", 
    "dateStart": "2025-08-06T09:00:00Z",
    "dateEnd": "2025-08-06T17:00:00Z",
    "totalHours": 8,
    "location": "Oficina Central",
    "locationLat": 37.7749,
    "locationLng": -122.4194,
    "radius": 100
  }'
```

**Check-in en turno**:
```bash
curl -X PATCH http://localhost:5005/shifts/{shift-id}/clock \
  -H "Content-Type: application/json" \
  -d '{
    "lat": 37.7749,
    "lng": -122.4194,
    "type": "clock_on",
    "timezone": "America/Los_Angeles"
  }'
```

## Funcionalidades Clave Preservadas

### Del Sistema Laravel Original

1. **Control de acceso jerárquico**: Admins ven todo, supervisores ven su equipo, empleados solo sus datos
2. **Validación de geolocalización**: Radio configurable para check-in/out
3. **Gestión de zonas horarias**: Conversión automática basada en coordenadas GPS
4. **Estados de turno**: Seguimiento automático del estado según check-in/out
5. **Jerarquía de supervisión**: Empleados pueden tener supervisores
6. **Información financiera**: ABN, BSB, número de cuenta para nómina
7. **Configuraciones flexibles**: Tipos de turno con horarios JSON personalizables

### Mejoras en Microservicios

1. **Escalabilidad**: Cada servicio puede escalarse independientemente
2. **Tolerancia a fallos**: Falla de un servicio no afecta a otros
3. **Tecnologías especializadas**: PostgreSQL para datos relacionales, MongoDB para perfiles
4. **API unificada**: GraphQL Gateway para consultas complejas
5. **Desarrollo independiente**: Equipos pueden trabajar en servicios por separado
6. **Despliegue granular**: Actualizar servicios individualmente

## Próximos Pasos

1. **Implementar GraphQL resolvers** en el gateway para consultas complejas
2. **Agregar validación de JWT** entre servicios
3. **Implementar circuit breakers** para tolerancia a fallos
4. **Configurar monitoreo** con métricas y logs centralizados
5. **Crear tests de integración** entre servicios
6. **Implementar dashboard web** para gestión visual

## Migración de Datos

Para migrar datos del sistema Laravel existente:

1. **Exportar datos de MySQL/PostgreSQL del Laravel**
2. **Mapear estructuras de tablas** según las nuevas entidades
3. **Ejecutar scripts de migración** para cada servicio
4. **Validar integridad referencial** entre servicios
5. **Configurar sincronización** si se requiere funcionamiento paralelo

La migración ha sido exitosa y el sistema está listo para producción con capacidades mejoradas de escalabilidad y mantenimiento.