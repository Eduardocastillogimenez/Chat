export default  createChatGroup = async (resData) => {
    const url = '{{url}}/api/chat/group'; // Reemplaza '{{url}}' con la URL correcta
    const data = {
      name: resData.name,
      users: resData.users, //array de emails de usuarios
    };
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': '{{Authorization}}', // Reemplaza con el token de autorización correcto
        },
        body: JSON.stringify(data),
      });
  
      if (response.ok) {
        const responseData = await response.json();
        console.log('Grupo de chat creado:', responseData);
      } else {
        console.error('Error al crear el grupo de chat:', response.statusText);
      }
    } catch (error) {
      console.error('Error al crear el grupo de chat:', error.message);
    }
  };