# omartobon.com

Sitio web de **OTO VISUAL FLOW** de Omar Tobon.

Servicios Visuales Estratégicos con IA y Customer Success.

## Servicios

### Customer Success 

En OTO Visual Flow, nuestro servicio de Customer Success se enfoca en:

1. Acompañamos al cliente más allá de la venta. Identificamos puntos críticos de éxito, creamos experiencias memorables y mejoramos la retención y lealtad. Un puente estratégico entre lo que promete tu marca y lo que realmente vive el usuario. 

2. Potenciar equipos de ventas y atención al cliente a través de asesorías y talleres especializados. Diseñamos programas de capacitación para mejorar la motivación, agilizar procesos y, en última instancia, aumentar tus números. Nuestro enfoque práctico y personalizado asegura que tu equipo no solo alcance sus metas, sino que las supere, garantizando la satisfacción y lealtad de tus clientes.

### Creación de Imágenes con IA 

Diseñamos imágenes impactantes, únicas y personalizadas con herramientas de IA para productos, redes, libros, marcas o personajes. Visuales creativos que capturan atención desde el primer segundo. 

### Presentaciones en PowerPoint y Canva 

Desarrollamos presentaciones animadas, narrativas y 100% personalizadas. Diapositivas con storytelling visual para ventas, formación, lanzamientos o portafolios de alto impacto. 

### Prompts Estratégicos de Producto y Marca 

Creamos instrucciones (prompts) inteligentes y adaptadas a cada necesidad para generar contenido visual, productos, Naming, libros, marcas o personajes, piezas de marketing y ventas. 

### Avatares Animados 

Damos vida a tus ideas con avatares únicos y expresivos en formato de video, con voces y diálogos personalizados. 

## Pre-requisitos

- [Git](https://www.atlassian.com/git/tutorials/install-git)
- Make: [Mac](https://formulae.brew.sh/formula/make) | [Windows](https://stackoverflow.com/questions/32127524/how-to-install-and-use-make-in-windows)
- Node version 18+, installed via [NVM (Node Package Manager)](https://nodejs.org/en/download/package-manager) or [NPM and Node](https://nodejs.org/en/download) install.
- PHP version 8.2+

## Instalación

1. Clonar el repositorio:

```bash
git clone https://github.com/omartobon/omartobon.com.git
```

2. Instalar dependencias:

```bash
make install
```

## Desarrollo

1. Ejecutar el sitio:

```bash
make run
```

2. Acceder al sitio:

```
http://localhost:3000
```

## Publicación

1. Configura las variables de entorno en el archivo `.env`.

```bash
cp .env.example .env
nano .env
```

2. Ejecuta el script de publicación:

```bash
make publish
```
