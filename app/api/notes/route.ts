import { NextRequest, NextResponse } from 'next/server';
import { api } from '../api';
import { cookies } from 'next/headers';
import { logErrorResponse } from '../_utils/utils';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const body = await request.json();

    const res = await api.post('/notes', body, {
      headers: {
        Cookie: cookieStore.toString(),
        'Content-Type': 'application/json',
      },
    });

    return NextResponse.json(res.data, { status: res.status });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    const response = (error as { response?: { data?: unknown; status?: number } })?.response?.data;
    const status = (error as { response?: { status?: number } })?.response?.status ?? 500;

    logErrorResponse({ message, response });
    return NextResponse.json({ error: message, response }, { status });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const body = await request.json();

    const res = await api.patch('/notes', body, {
      headers: { Cookie: cookieStore.toString() },
    });

    return NextResponse.json(res.data, { status: res.status });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    const response = (error as { response?: { data?: unknown; status?: number } })?.response?.data;
    const status = (error as { response?: { status?: number } })?.response?.status ?? 500;

    logErrorResponse({ message, response });
    return NextResponse.json({ error: message, response }, { status });
  }
}

export async function DELETE() {
  try {
    const cookieStore = cookies();

    const res = await api.delete('/notes', {
      headers: { Cookie: cookieStore.toString() },
    });

    return NextResponse.json(res.data, { status: res.status });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    const response = (error as { response?: { data?: unknown; status?: number } })?.response?.data;
    const status = (error as { response?: { status?: number } })?.response?.status ?? 500;

    logErrorResponse({ message, response });
    return NextResponse.json({ error: message, response }, { status });
  }
}
