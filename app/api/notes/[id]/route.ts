import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { logErrorResponse } from '../../_utils/utils';

type Props = {
  params: { id: string };
};

// Базовий URL твого API
const API_BASE_URL = process.env.API_URL || 'https://example.com/api';

export async function GET(_: Request, { params }: Props) {
  try {
    const cookieStore = cookies();
    const { id } = params;

    const res = await fetch(`${API_BASE_URL}/notes/${id}`, {
      method: 'GET',
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    logErrorResponse({ message: (error as Error).message });
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: Props) {
  try {
    const cookieStore = cookies();
    const { id } = params;

    const res = await fetch(`${API_BASE_URL}/notes/${id}`, {
      method: 'DELETE',
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    logErrorResponse({ message: (error as Error).message });
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: Props) {
  try {
    const cookieStore = cookies();
    const { id } = params;
    const body = await request.json();

    const res = await fetch(`${API_BASE_URL}/notes/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieStore.toString(),
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    logErrorResponse({ message: (error as Error).message });
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
