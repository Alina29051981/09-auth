import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { api } from "../../../../lib/api/api";
import { parse } from "cookie";
import { logErrorResponse } from "../../_utils/utils";

interface AxiosLikeError {
  response?: { data?: unknown };
}

function isAxiosLikeError(error: unknown): error is AxiosLikeError {
  return typeof error === "object" && error !== null && "response" in error;
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (accessToken) {
      return NextResponse.json({ success: true });
    }

    if (refreshToken) {
      const apiRes = await api.get("auth/session", {
        headers: {
          Cookie: cookieStore.toString(),
        },
      });

      const setCookie = apiRes.headers["set-cookie"];

      if (setCookie) {
        const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];
        for (const cookieStr of cookieArray) {
          const parsed = parse(cookieStr);

          const options = {
            expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
            path: parsed.Path,
            maxAge: Number(parsed["Max-Age"]),
          };

          if (parsed.accessToken)
            cookieStore.set("accessToken", parsed.accessToken, options);
          if (parsed.refreshToken)
            cookieStore.set("refreshToken", parsed.refreshToken, options);
        }
        return NextResponse.json({ success: true }, { status: 200 });
      }
    }

    return NextResponse.json({ success: false }, { status: 200 });
  } catch (error: unknown) {
    if (isAxiosLikeError(error)) {
      logErrorResponse(error.response?.data);
    } else if (error instanceof Error) {
      logErrorResponse({ message: error.message });
    } else {
      logErrorResponse({ message: "Unknown error" });
    }

    return NextResponse.json({ success: false }, { status: 200 });
  }
}
