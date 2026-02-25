import { getPublicApiBaseUrl } from "@/lib/config/env";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

// We intentionally override `body` to allow passing plain objects, which
// will be JSON-stringified by this helper.
export interface JsonFetchOptions extends Omit<RequestInit, "body"> {
	method?: HttpMethod;
	body?: unknown;
	// If true, do not throw on non-2xx; just return the Response.
	rawResponse?: boolean;
}

export async function jsonFetch<TResponse>(
  path: string,
  options: JsonFetchOptions = {},
): Promise<TResponse> {
  const { rawResponse, headers, body, method = "GET", ...rest } = options;

  const baseUrl = getPublicApiBaseUrl().replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = `${baseUrl}${normalizedPath}`;

  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(headers || {}),
    },
    body: body ? (typeof body === "string" ? body : JSON.stringify(body)) : undefined,
    ...rest,
  });

  if (rawResponse) {
    // @ts-expect-error - caller knows they requested the raw Response
    return response;
  }

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`API request failed: ${response.status} ${response.statusText} ${text}`);
  }

  return (await response.json()) as TResponse;
}

