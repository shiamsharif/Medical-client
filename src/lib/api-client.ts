function apiUrl(path: string): URL {
  const origin =
    typeof window === "undefined"
      ? (process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
        "http://localhost:3000")
      : window.location.origin;

  return new URL(path, `${origin}/`);
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined>;
  accessToken?: string;
};

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const url = apiUrl(path);
  Object.entries(options.query ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== "")
      url.searchParams.set(key, String(value));
  });

  const headers = new Headers(options.headers);
  if (options.body !== undefined)
    headers.set("Content-Type", "application/json");
  if (options.accessToken)
    headers.set("Authorization", `Bearer ${options.accessToken}`);

  let response: Response;
  try {
    response = await fetch(url, {
      ...options,
      headers,
      body:
        options.body === undefined ? undefined : JSON.stringify(options.body),
      credentials: "include",
    });
  } catch {
    throw new ApiError(
      "We could not reach MediCare Connect. Please try again.",
      0,
    );
  }

  const payload: unknown =
    response.status === 204 ? null : await response.json().catch(() => null);
  if (!response.ok) {
    const message =
      typeof payload === "object" &&
      payload &&
      "message" in payload &&
      typeof payload.message === "string"
        ? payload.message
        : "Something went wrong. Please try again.";
    throw new ApiError(message, response.status, payload);
  }
  if (
    typeof payload === "object" &&
    payload !== null &&
    "success" in payload &&
    payload.success === true &&
    "data" in payload
  ) {
    if ("meta" in payload) {
      return { data: payload.data, meta: payload.meta } as T;
    }
    return payload.data as T;
  }
  return payload as T;
}
