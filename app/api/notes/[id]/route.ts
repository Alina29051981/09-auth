import { NextResponse } from 'next/server';
import { api } from '../../api';
import { cookies } from 'next/headers';
import { logErrorResponse } from '../../_utils/utils';

type Props = {
  params: { id: string };
};

export async function GET({ params }: Props) {
  try {
    const cookieStore = cookies();
    const { id } = params;
    const res = await api.get(`/notes/${id}`, {
      headers: { Cookie: cookieStore.toString() },
    });
    return NextResponse.json(res.data, { status: res.status });
  } catch (error) {
    logErrorResponse({ message: (error as Error).message });
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE({ params }: Props) {
  try {
    const cookieStore = cookies();
    const { id } = params;
    const res = await api.delete(`/notes/${id}`, {
      headers: { Cookie: cookieStore.toString() },
    });
    return NextResponse.json(res.data, { status: res.status });
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
    const res = await api.patch(`/notes/${id}`, body, {
      headers: { Cookie: cookieStore.toString() },
    });
    return NextResponse.json(res.data, { status: res.status });
  } catch (error) {
    logErrorResponse({ message: (error as Error).message });
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
