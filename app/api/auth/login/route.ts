import { NextRequest, NextResponse } from 'next/server';
import { api } from '../../api';
import { cookies } from 'next/headers';
import { parse } from 'cookie';
import { logErrorResponse } from '../../_utils/utils';

interface AxiosLikeError {
  response?: { data?: unknown; status?: number };
  message: string;
}

function isAxiosLikeError(error: unknown): error is AxiosLikeError {
  return typeof error === 'object' && error !== null && 'message' in error;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const apiRes = await api.post('auth/login', body);

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
    if (isAxiosLikeError(error) && error.response) {
      logErrorResponse(error.response.data);
      return NextResponse.json(
        { error: error.message, response: error.response.data },
        { status: error.response.status ?? 500 }
      );
    }

    const message = isAxiosLikeError(error) ? error.message : 'Unknown error';
    logErrorResponse({ message });
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
