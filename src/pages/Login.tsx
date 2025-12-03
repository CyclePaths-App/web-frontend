import api from '../lib/api';

async function handleLogin(e: React.FormEvent) {
  e.preventDefault();

  try {
    const res = await api.post('/auth/login', {
      email,      // from your form state
      password,
    });

    // Your backend returns "accessToken" (we saw it in curl)
    const { accessToken } = res.data;

    // save token for later requests
    localStorage.setItem('authToken', accessToken);

    // navigate to home/dashboard/etc.
  } catch (err) {
    console.error(err);
    // show "invalid email or password" to user
  }
}


