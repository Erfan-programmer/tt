"use client"
import { loadUserData } from '@/components/modules/EncryptData/SavedEncryptData';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

if (typeof window !== 'undefined') {
    (window as any).Pusher = Pusher;
}

const token = loadUserData()?.access_token;

const options = {
    broadcaster: 'pusher',
    key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,
    cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER!,
    forceTLS: true,
    authEndpoint: 'https://api.titan.investments/api/broadcasting/auth',
    auth: {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
        },
    },
};

const echo = new Echo(options as any);

export default echo;
