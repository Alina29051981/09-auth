export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { api } from '../../api';
import { cookies } from 'next/headers';
import { logErrorResponse } from '../../_utils/utils';

function isAxiosLikeError(error: unknown): error is { response?: { data?: unknown; status?: number }; message: string } {
  return typeof error === 'object' && error !== null && 'message' in error;
}

function buildCookieHeader() {
  const cookieStore = cookies();
 
  return cookieStore.getAll().map(c => `${c.name}=${c.value}`).join('; ');
}

export async function GET() {
  try {
    const cookieHeader = buildCookieHeader();

    const res = await api.get('/users/me', {
      headers: { Cookie: cookieHeader },
    });

    return NextResponse.json(res.data, { status: res.status });
  } catch (error) {
    if (isAxiosLikeError(error)) {
      logErrorResponse(error.response?.data);
      return NextResponse.json(
        { error: error.message, response: error.response?.data },
        { status: error.response?.status || 500 }
      );
    }
    logErrorResponse({ message: (error as Error).message });
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const cookieHeader = buildCookieHeader();
    const body = await request.json();

    const res = await api.patch('/users/me', body, {
      headers: { Cookie: cookieHeader },
    });

    return NextResponse.json(res.data, { status: res.status });
  } catch (error) {
    if (isAxiosLikeError(error)) {
      logErrorResponse(error.response?.data);
      return NextResponse.json(
        { error: error.message, response: error.response?.data },
        { status: error.response?.status || 500 }
      );
    }
    logErrorResponse({ message: (error as Error).message });
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
