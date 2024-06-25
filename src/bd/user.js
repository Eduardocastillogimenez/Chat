export const getUserData = async (authorization) => {
    const url = 'http://instant-messaging-laravel-chat.test/api/user'; // Reemplaza '{{url}}' con la URL correcta
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + authorization, // Reemplaza con el token de autorización adecuado
        },
      });
  
      if (response.ok) {
        const userData = await response.json();
        console.log('Datos del usuario obtenidos:', userData);
        return userData;
      } else {
        console.error('Error al obtener datos del usuario:', response.statusText);
        return null;
      }
    } catch (error) {
      console.error('Error al obtener datos del usuario:', error.message);
      return null;
    }
};


export const updateUserSettings = async (resData,authorization) => {
    const url = 'http://instant-messaging-laravel-chat.test/api/user'; // Reemplaza '{{url}}' con la URL correcta
    const data = new FormData();
    data.append('name', resData.name);
    data.append('theme', resData.theme);
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + authorization, // Reemplaza con el token de autorización adecuado
        },
        body: data,
      });
  
      if (response.ok) {
        console.log('Configuración de usuario actualizada con éxito');
        return 'ok';
      } else {
        console.error('Error al actualizar la configuración de usuario:', response.statusText);
        return null;
      }
    } catch (error) {
      console.error('Error al actualizar la configuración de usuario:', error.message);
      return null;
    }
};
