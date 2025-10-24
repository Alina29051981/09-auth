import { NextResponse } from 'next/server';
import { api } from '../../api';
import { cookies } from 'next/headers';
import { logErrorResponse } from '../../_utils/utils';

interface AxiosLikeError {
  response?: { data?: unknown };
  message: string;
  status?: number;
}

function isAxiosLikeError(error: unknown): error is AxiosLikeError {
  return typeof error === 'object' && error !== null && 'message' in error;
}

export async function POST() {
  try {
    const cookieStore = await cookies();

    const accessToken = cookieStore.get('accessToken')?.value;
    const refreshToken = cookieStore.get('refreshToken')?.value;

    await api.post('auth/logout', null, {
      headers: {
        Cookie: `accessToken=${accessToken}; refreshToken=${refreshToken}`,
      },
    });

    cookieStore.delete('accessToken');
    cookieStore.delete('refreshToken');

    return NextResponse.json({ message: 'Logged out successfully' }, { status: 200 });
  } catch (error: unknown) {
    if (isAxiosLikeError(error)) {
      logErrorResponse(error.response?.data);
      return NextResponse.json(
        { error: error.message ?? 'Axios error', response: error.response?.data },
        { status: error.status ?? 500 }
      );
    } else if (error instanceof Error) {
      logErrorResponse({ message: error.message });
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      logErrorResponse({ message: 'Unknown error' });
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  }
}
