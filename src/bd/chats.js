export const fetchData = async () => {
    const url = 'http://instant-messaging-laravel-chat.test/api/chat'; // Reemplaza '{{url}}' con la URL correcta
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': '{{Authorization}}', // Reemplaza con el token de autorización adecuado
        },
      });
  
      if (response.ok) {
        const responseData = await response.json();
        console.log('Datos obtenidos:', responseData);
        return responseData;
      } else {
        console.error('Error al obtener datos:', response.statusText);
        return null;
      }
    } catch (error) {
      console.error('Error al obtener datos:', error.message);
      return null;
    }
};
  




export const fetchContacts = async () => {
    const url = 'http://instant-messaging-laravel-chat.test/api/chat/contacts'; // Reemplaza '{{url}}' con la URL correcta
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': '{{Authorization}}', // Reemplaza con el token de autorización adecuado
        },
      });
  
      if (response.ok) {
        const responseData = await response.json();
        console.log('Contactos obtenidos:', responseData);
        return responseData;
      } else {
        console.error('Error al obtener contactos:', response.statusText);
        return null;
      }
    } catch (error) {
      console.error('Error al obtener contactos:', error.message);
      return null;
    }
};