export const postResenna = async (resenna) => {
    try {
        // Codificar las imágenes en base64
        const logo = await convertImageToBase64(resenna.logo);
        const imagenSituacionBase64 = await convertImageToBase64(resenna.imagenSituacion);
        const imagenDetalleBase64 = await convertImageToBase64(resenna.imagenDetalle);
        const imagenGeneralBase64 = await convertImageToBase64(resenna.imagenGeneral);

        // Crear un nuevo objeto resenna con las imágenes codificadas en base64
        const resennaWithImages = {
            ...resenna,
            logo: logo,
            imagenSituacion: imagenSituacionBase64,
            imagenDetalle: imagenDetalleBase64,
            imagenGeneral: imagenGeneralBase64
        };

        const response = await fetch("http://localhost:3001/resennas", {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(resennaWithImages)
        });

        if (response.status === 201) {
            const data = await response.json();
            return { error: false, data };
        }

        return { error: true, data: "No se ha podido guardar la reseña" };
    } catch (error) {
        return { error: true, data: "Error al procesar la solicitud POST" };
    }
};

export const convertImageToBase64 = (imageFile) => {
    return new Promise((resolve, reject) => {
        if (!imageFile) {
            resolve(null);
        }
        
        const reader = new FileReader();
        reader.readAsDataURL(imageFile);
        reader.onload = () => {
            resolve(reader.result);
        };
        reader.onerror = (error) => {
            reject(error);
        };
    });
};

export const deleteResennna = async (resenna) => {
    const response = await fetch("http://localhost:3001/resennas/" + resenna.id, {
        method: "DELETE"
    });
    
    if (response.status === 200) {
        return {error: false}
    } else {
        return {error: true, data: "No se ha podido borrar la reseña"};
    }
};

export const updateResennna = async (resenna) => {
    try {
      const response = await fetch(`http://localhost:3001/resennas/${resenna.id}`, {
        method: 'PUT',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(resenna)
      });
  
      if (response.status === 200) {
        return { error: false };
      }
  
      return { error: true, data: "No se ha podido actualizar la reseña" };
    } catch (error) {
      return { error: true, data: "Error al procesar la solicitud PUT" };
     
    }
};

export const getResenna = async () => {
    const response = await fetch("http://localhost:3001/resennas");
    return await response.json();
};

export const getResennaOne = async (resennaId) => {
    const response = await fetch(`http://localhost:3001/resennas/${resennaId}`);
    return await response.json();
};
  