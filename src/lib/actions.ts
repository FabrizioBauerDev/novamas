'use server';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    const redirectTo = formData.get('redirectTo') as string;
    await signIn('credentials', {
      ...Object.fromEntries(formData),
      redirectTo: redirectTo || '/dashboard',
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Credenciales invalidas.';
        default:
          return 'Algo salió mal.';
      }
    }
    throw error;
  }
}