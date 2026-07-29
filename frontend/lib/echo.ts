import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import Cookies from 'js-cookie';

declare global {
  interface Window {
    Pusher: typeof Pusher;
    Echo: InstanceType<typeof Echo>;
  }
}

let echoInstance: InstanceType<typeof Echo> | null = null;
let currentToken: string | undefined = undefined;

export const getEcho = (): InstanceType<typeof Echo> | null => {
  if (typeof window === 'undefined') return null;

  const token = Cookies.get('riadkit_staff_token');

  // If there's no staff token, disconnect any existing instance and return null
  if (!token) {
    if (echoInstance) {
      echoInstance.disconnect();
      echoInstance = null;
      currentToken = undefined;
    }
    return null;
  }

  window.Pusher = Pusher;

  // If instance doesn't exist OR the token changed, create/re-create Echo instance
  if (!echoInstance || currentToken !== token) {
    if (echoInstance) {
      echoInstance.disconnect();
    }

    currentToken = token;
    echoInstance = new Echo({
      broadcaster: 'reverb',
      key: process.env.NEXT_PUBLIC_REVERB_APP_KEY,
      wsHost: process.env.NEXT_PUBLIC_REVERB_HOST ?? 'localhost',
      wsPort: Number(process.env.NEXT_PUBLIC_REVERB_PORT ?? 8080),
      wssPort: Number(process.env.NEXT_PUBLIC_REVERB_PORT ?? 8080),
      forceTLS: (process.env.NEXT_PUBLIC_REVERB_SCHEME ?? 'http') === 'https',
      enabledTransports: ['ws', 'wss'],
      authEndpoint: `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'}/api/broadcasting/auth`,
      auth: {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      },
    });

    window.Echo = echoInstance;
  }

  return echoInstance;
};