const loginUser = async (resData) => {
    const url = 'http://instant-messaging-laravel-chat.test/api/auth/login'; // Reemplaza '{{url}}' con la URL correcta
    const data = {
      email: resData.email,
      password: resData.password,
    };
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      if (response.ok) {
        const responseData = await response.json();
        console.log('Inicio de sesión exitoso:', responseData);
        return responseData;
      } else {
        console.error('Error al iniciar sesión:', response.statusText);
        return null;
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error.message);
      return null;
    }
  };
  
export default loginUser;