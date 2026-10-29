ELIBOO — INICIO RÁPIDO

Este paquete contiene una primera versión visual y funcional de la tienda EliBoo para un proyecto Next.js con App Router.

ARCHIVOS A COPIAR A TU PROYECTO:
- app/page.tsx
- app/globals.css
- app/layout.tsx
- public/eliboo-logo.png

PASOS
1. Haz una copia de seguridad de esos archivos si ya tienes contenido.
2. Copia las carpetas/archivos de este paquete a la raíz de tu proyecto Next.js y acepta reemplazar los archivos indicados.
3. Abre una terminal en la carpeta del proyecto y ejecuta: npm run dev
4. Abre http://localhost:3000

ANTES DE RECIBIR PEDIDOS
En app/page.tsx, busca:
const whatsappNumber = '57XXXXXXXXXX';
Y reemplázalo por el número de WhatsApp de la tienda, con indicativo de país, sin +, espacios ni guiones. Ejemplo de formato colombiano: 573001234567 (usa tu número real, no el ejemplo).

IMPORTANTE
- Los productos y precios son demostrativos; reemplázalos por tu inventario real.
- Las imágenes de productos cargan desde URLs externas de Unsplash; para producción es mejor usar fotos propias.
- El carrito funciona en el navegador, pero todavía no guarda pedidos ni inventario en una base de datos.
- Esta versión no incluye panel de administración ni Supabase todavía.
