export const fetchChatMessages = async (idMessages, search, authorization) => {
    const url = process.env.REACT_APP_API_URL + '/chat/messages?chat_id=' + idMessages + (search ? `&search=${search}` : ''); // Reemplaza '{{url}}' con la URL correcta
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
  const url = process.env.REACT_APP_API_URL + '/chat/message'; // Reemplaza '{{url}}' con la URL correcta

  const myHeaders = new Headers();
  myHeaders.append("Accept", "application/json");
  myHeaders.append("Authorization", "Bearer " + authorization);

  const formdata = new FormData();
  
  formdata.append("chat_id", resData.chat_id);
  if(resData.file) {
      formdata.append("file", resData.file);
      formdata.append("message", "{\"ct\":\"lrTWFcUtTzylEY6+2lLyZg==\",\"iv\":\"00ac71c09e0748d766589103ff43d254\",\"s\":\"08a9ae1967f57b81\"}");
  }else{
    formdata.append("message", resData.message);
  }
  

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: formdata,
    redirect: "follow"
  };

  try {
    let response = undefined;
    await fetch(url, requestOptions)
      .then((response) => response.text())
      .then((result) => response = JSON.parse(result))
      .catch((error) => response = error);

    // console.log('response.data',response.data)
    if (response.data) {
      // const responseData = await response.json();
      console.log('Mensaje enviado:', response);
      return response.data;
    } else {
      console.error('Error al enviar el mensaje:', response.statusText);
      return null;
    }
  } catch (error) {
    console.error('Error al enviar el mensaje:', error.message);
    return null;
  }
};
