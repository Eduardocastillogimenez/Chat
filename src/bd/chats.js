export const fetchData = async (authorization) => {
    const url = process.env.REACT_APP_API_URL + '/chat'; // Reemplaza '{{url}}' con la URL correcta
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
  




export const fetchContacts = async (authorization) => {
    const url = process.env.REACT_APP_API_URL + '/chat/contacts'; // Reemplaza '{{url}}' con la URL correcta
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


export const createChat = async (resData, authorization) => {
    const url = process.env.REACT_APP_API_URL + '/chat'; // Reemplaza '{{url}}' con la URL correcta
    const data = {
      name: resData.name,
      is_group_chat: resData.group,
      users:  resData.usersEmail,
    };
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + authorization, // Reemplaza con el token de autorización adecuado
        },
        body: JSON.stringify(data),
      });
  
      if (response.ok) {
        const responseData = await response.json();
        console.log('Grupo de chat creado:', responseData);
        return responseData;
      } else {
        console.error('Error al crear el grupo de chat:', response.statusText);
        return null;
      }
    } catch (error) {
      console.error('Error al crear el grupo de chat:', error.message);
      return null;
    }
};

  

export const deleteChatDB = async (id, authorization) => {
  const url = process.env.REACT_APP_API_URL + '/chat/' + id;


  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + authorization, // Reemplaza con el token de autorización adecuado
      },
    });

    if (response.ok) {
      const responseData = await response.json();
      console.log('La petición DELETE se realizó correctamente', responseData);
      return 'ok';
    } else {
      console.error('Error al realizar la petición DELETE', response.statusText);
      return null;
    }
  } catch (error) {
    console.error('Error en la petición DELETE', error.message);
    return null;
  }
};