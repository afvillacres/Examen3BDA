# API TecnoMega

API REST para la compra y venta de productos tecnológicos, desarrollada con **Node.js + Express** y **Redis** como base de datos NoSQL clave–valor.

El proyecto simula tablas mediante prefijos de claves y utiliza **SETs como índices** para permitir la consulta de colecciones completas.

---

## Tecnologías utilizadas

* Node.js
* Express
* Redis
* Middleware `express.json()`
* Middleware `response-time`
* Postman / Thunder Client (pruebas)

---

## Ejecución del proyecto

1. Instalar dependencias:

```bash
npm install
```

2. Asegurarse de que Redis esté activo:

```bash
redis-cli ping
```

Debe responder:

```
PONG
```

3. Ejecutar la API:

```bash
node index.js
```

Salida esperada:

```
API TecnoMega corriendo en http://localhost:3000
Conectado a Redis
```

---

## URL base

```
http://localhost:3000
```

---

## Endpoint 1: Carga masiva (SEED)

### POST /seed

Carga los datos desde el archivo `data/tecnomega.json` en Redis.

**Body:** vacío

**Respuesta esperada:**

```json
{
  "mensaje": "Carga masiva completada",
  "registros": 40,
  "tiempo_ms": 15
}
```

---

## Endpoints de PRODUCTOS

### GET /productos

Lista todos los productos.

### GET /productos/:codigo

Obtiene un producto por su código.

Ejemplo:

```
GET /productos/P001
```

### POST /productos

Crea un nuevo producto.

```json
{
  "codigo": "P010",
  "nombre": "Teclado Mecánico",
  "categoria": "Accesorios",
  "precio": 120,
  "stock": 5
}
```

---

## Endpoints de CLIENTES

### GET /clientes

Lista todos los clientes.

### GET /clientes/:cedula

Obtiene un cliente por cédula o DNI.

```json
GET /clientes/0102030401
```

### POST /clientes

Crea un nuevo cliente.

```json
{
  "cedula": "0999999999",
  "nombres": "Maria Lopez",
  "email": "maria@mail.com",
  "telefono": "098888777",
  "edad": 25,
  "genero": "F"
}
```

---

## Endpoints de PEDIDOS

### GET /pedidos

Lista todos los pedidos.

### GET /pedidos/:codigo

Obtiene un pedido por código.

```json
GET /pedidos/PED001
```

### POST /pedidos

Crea un nuevo pedido.

```json
{
  "codigo": "PED010",
  "clienteId": "0102030401",
  "fecha": "2026-02-06",
  "subtotal": 120,
  "iva": 14.4,
  "total": 134.4,
  "estado": "PAGADO"
}
```

---

## Endpoints de DETALLE DE PEDIDO

### GET /detalle_pedido

Lista todos los detalles de pedidos.

### GET /detalle_pedido/:codigo

Obtiene un detalle de pedido por código.

```json
GET /detalle_pedido/DET001
```

### POST /detalle_pedido

Crea un nuevo detalle de pedido.

```json
{
  "codigo": "DET010",
  "productoId": "P001",
  "cantidad": 2,
  "detalle": "Laptop Lenovo",
  "precioUnit": 850
}
```

---

## Modelo de datos en Redis

* Cada registro se guarda como JSON string.
* Las claves usan el formato:

```
coleccion:id
```

Ejemplo:

```
productos:P001
clientes:0102030401
```

* Cada colección mantiene un índice:

```
productos:index
clientes:index
```

Estos índices son SETs que permiten listar los registros.

