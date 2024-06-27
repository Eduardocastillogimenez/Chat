export const fetchChatMessages = async (idMessages, search, authorization) => {
    const url = 'http://instant-messaging-laravel-chat.test/api/chat/messages?chat_id=' + idMessages + (search ? `&search=${search}` : ''); // Reemplaza '{{url}}' con la URL correcta
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


  const formData = new FormData();
  formData.append("chat_id", resData.chat_id);
  if(resData.message) {
    formData.append("message", resData.message);
  }
  if(resData.file) {
    formData.append("file", resData.file);
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + authorization, // Reemplaza con el token de autorización adecuado
        // 'Content-Type': 'multipart/form-data',
      },
      body: formData,
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
