const getPublicKey = async (authorization) => {
    const url = 'http://instant-messaging-laravel-chat.test/api/encryption/server/public-key'; // Reemplaza '{{url}}' con la URL correcta
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + authorization, // Reemplaza con el token de autorización adecuado
        },
      });
  
      if (response.ok) {
        const publicKey = await response.text();
        console.log('Clave pública obtenida:', publicKey);
      } else {
        console.error('Error al obtener la clave pública:', response.statusText);
      }
    } catch (error) {
      console.error('Error al obtener la clave pública:', error.message);
    }
};

  

const updatePublicKey = async (public_key, authorization) => {
    const url = 'http://instant-messaging-laravel-chat.test/api/encryption/user/public-key'; // Reemplaza '{{url}}' con la URL correcta
    const data = {
      public_key: public_key
    };
  
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + authorization, // Reemplaza con el token de autorización adecuado
        },
        body: JSON.stringify(data),
      });
  
      if (response.ok) {
        console.log('Clave pública actualizada con éxito');
      } else {
        console.error('Error al actualizar la clave pública:', response.statusText);
      }
    } catch (error) {
      console.error('Error al actualizar la clave pública:', error.message);
    }
};

  