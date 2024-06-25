export const fetchChatMessages = async (idMessages, authorization) => {
    const url = 'http://instant-messaging-laravel-chat.test/api/chat/messages?chat_id=' + idMessages; // Reemplaza '{{url}}' con la URL correcta
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + authorization, // Reemplaza con el token de autorización adecuado
        },
      });
  
      if (response.ok) {
        const responseData = await response.json();
        console.log('Mensajes del chat obtenidos:', responseData);
        return responseData;
      } else {
        console.error('Error al obtener mensajes del chat:', response.statusText);
        return null;
      }
    } catch (error) {
      console.error('Error al obtener mensajes del chat:', error.message);
      return null;
    }
};




export const sendMessage = async (resData, authorization) => {
  const url = 'http://instant-messaging-laravel-chat.test/api/chat/message'; // Reemplaza '{{url}}' con la URL correcta
  const data = {
    message: resData.message,
    chat_id: resData.chat_id,
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + authorization, // Reemplaza con el token de autorización adecuado
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const responseData = await response.json();
      console.log('Mensaje enviado:', responseData);
      return responseData;
    } else {
      console.error('Error al enviar el mensaje:', response.statusText);
      return null;
    }
  } catch (error) {
    console.error('Error al enviar el mensaje:', error.message);
    return null;
  }
};
