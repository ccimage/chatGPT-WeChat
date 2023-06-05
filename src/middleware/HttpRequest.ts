import fetch from "node-fetch";

export function httpGetText(site: string, query?: string): Promise<string> {
    const url = query ? `${site}?${query}` : site;
    return fetch(url).then(res => res.text());
}
export function httpGetJSON(site: string, query?: string): Promise<any> {
    const url = query ? `${site}?${query}` : site;
    return fetch(url).then(res => res.json());
}
export function httpPostWithJSON(url: string, body: any, headers?: any ): Promise<any> {
    if (!headers) headers = {};
    headers["Content-Type"] = "application/json";
    return fetch(url, {
        method: "post",
        body: JSON.stringify(body),
        headers
    }).then(res => res.json());
}

/** 发送请求（默认POST） */
export async function fetchResponse<T = any>(url: string, body: any, method: "GET" | "POST" = "POST"): Promise<[Error | null, T | null]> {
    try {
        const res = await fetch(url, {
            method,
            body: body?JSON.stringify(body):undefined,
            headers: {
                "Content-Type": "application/json",
                "Connection": "keep-alive"
            }
        });
        const ret = await res.json();
        return [null, ret];
    } catch (err) {
        return [err as any, null];
    }
}