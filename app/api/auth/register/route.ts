import { NextRequest, NextResponse } from 'next/server';
import { api } from '../../api';
import { cookies } from 'next/headers';
import { parse } from 'cookie';
import { logErrorResponse } from '../../_utils/utils';

interface AxiosLikeError {
  response?: { data?: unknown };
  message: string;
  status?: number;
}

function isAxiosLikeError(error: unknown): error is AxiosLikeError {
  return typeof error === 'object' && error !== null && 'message' in error;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const apiRes = await api.post('auth/register', body);

    const cookieStore = await cookies();
    const setCookie = apiRes.headers['set-cookie'];

    if (setCookie) {
      const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];
      for (const cookieStr of cookieArray) {
        const parsed = parse(cookieStr);

        const options = {
          expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
          path: parsed.Path,
          maxAge: Number(parsed['Max-Age']),
        };

        if (parsed.accessToken) cookieStore.set('accessToken', parsed.accessToken, options);
        if (parsed.refreshToken) cookieStore.set('refreshToken', parsed.refreshToken, options);
      }
      return NextResponse.json(apiRes.data, { status: apiRes.status });
    }

    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  } catch (error: unknown) {
    if (isAxiosLikeError(error)) {
    
      logErrorResponse(error.response?.data || { message: error.message });
      return NextResponse.json(
        { error: error.message, response: error.response?.data },
        { status: error.status || 500 }
      );
    } else if (error instanceof Error) {
      logErrorResponse({ message: error.message });
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      logErrorResponse({ message: 'Unknown error' });
      return NextResponse.json({ error: 'Unknown error' }, { status: 500 });
    }
  }
}
