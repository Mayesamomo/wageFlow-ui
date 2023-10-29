import { useAuthContext } from './useAuthContext'

export const useLogout = () => {
  const { dispatch } = useAuthContext()

  const logout = async () => {
    try {
      // Send a request to the logout API endpoint
      const response = await fetch('/api/auth/logout', {
        method: 'POST', // You may use 'GET' or 'POST' depending on your API
        headers: {
          'Content-Type': 'application/json',
        },
        // You can include additional headers or authentication tokens if needed
      });

      if (response.ok) {
        localStorage.removeItem('user');
        dispatch({ type: 'LOGOUT' });
      } else {
        response.json().then((data) => {
          console.log(data);
        });                                                                                     
      }
    } catch (error) {
     error.json().then((data) => {
        console.log(data);
      });
    }
  };

  return { logout };
}