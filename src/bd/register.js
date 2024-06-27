const registerUser = async (resData) => {
    const url = process.env.REACT_APP_API_URL + '/auth/register'; // Reemplaza '{{url}}' con la URL correcta
    const data = {
      name: resData.name,
      email: resData.email,
      password: resData.password,
      c_password: resData.confirmPassword,
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
        console.log('Registro exitoso:', responseData);
        return 'ok'
      } else {
        console.error('Error al registrar usuario:', response.statusText);
        return null
      }
    } catch (error) {
      console.error('Error al registrar usuario:', error.message);
      return null
    }
  };
  
  // Llama a la función para registrar al usuario

  export default registerUser
  