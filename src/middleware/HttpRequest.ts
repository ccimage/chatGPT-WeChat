import fetch from "node-fetch"

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
        headers,
    }).then(res => res.json());
}