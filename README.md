
[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/Fu6E-LL6)
# control-plane

Aplicación **Control Plane** del [Proyecto IAW 2026](https://iaw-2026.github.io/proyecto/) — comisión Eventia.
----
URL: https://etapa-3-control-plane-eventia.vercel.app/
---

Permite tener visibilidad completa sobre clientes, organizadores, eventos, pedidos, entradas y transacciones registradas en la plataforma.

Vistas disponibles
- Clientes: Lista de usuarios compradores registrados con nombre, ID y email.
- Organizadores: Lista de organizadores con nombre, email, estado activo/inactivo y opción de gestión.
- Eventos: Catálogo completo de eventos con organizador, categoría, ubicación, fecha, precio y stock disponible.
- Pedidos: Historial de pedidos con usuario, evento, monto, estado y acción disponible.
- Entradas: Registro de entradas individuales vinculadas a pedidos y eventos.
- Transacciones: Historial de transacciones con estado (aprobada, cancelada, pendiente) y moneda.

Funcionalidades principales
- Desactivar organizador: Desde la vista de Organizadores, cada fila con estado Activo muestra un botón Desactivar. Al pulsarlo, se actualiza el estado del organizador en la plataforma. Los organizadores inactivos tienen el botón deshabilitado para evitar acciones redundantes.
- Devolver entradas de un pedido: Desde la vista de Pedidos, los pedidos con estado PAGADO muestran un botón Devolver. Al pulsarlo, las entradas asociadas se devuelven y el pedido se elimina.


Enunciado completo: <https://iaw-2026.github.io/proyecto/>

