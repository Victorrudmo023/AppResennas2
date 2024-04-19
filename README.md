# Para lanzar el proyecto

En la carpteta raíz del proyecto:

1. `npm install`
2. `npm install concurrently --save-dev`
3. `npm install --save html2pdf.js`
4. `npm install leaflet`
5. `npm start`

Solucionar pdf que solo saca la de la primera

Hacer que barra de arriba se vea por encima del mapa

Pasos
Crear proyecto en firebase App Resennas y sustituir http://localhost:3001 por https://app-resennas-50a9e.firebaseapp.com con el codigo que sea

npm install firebase
npm install -g firebase-tools
firebase login
firebase init(crear dist y borrar)
firebase
npm run build
mover resennas.json a build y sustituir backend por build en --watch build/resennas.json
codigo de firebase.json: 
{
  "hosting": {
    "public": "build",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "/resennas",
        "destination": "/resennas.json"
      },
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
 
firebase deploy


