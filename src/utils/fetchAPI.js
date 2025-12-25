import { headers } from "next/headers";

const getBaseUrl = () => {
    // Client (browser)
    if (typeof window !== "undefined") {
        return process.env.NEXT_PUBLIC_BASE_URL;
    }

    // Server / build time
    const h = headers();
    const host = h.get("host");
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

    return `${protocol}://${host}/api`;
};

// ---------------------------------------------

export const FetchApi = async ({ url, method = "GET", data = null, token = null }) => {
    try {
        const base_url = getBaseUrl();
        const fullUrl = `${base_url}${url}`;

        const headersObj = {};
        if (!(data instanceof FormData)) {
            headersObj["Content-Type"] = "application/json";
        }
        if (token) headersObj["Authorization"] = `Bearer ${token}`;

        const options = {
            method: method.toUpperCase(),
            headers: headersObj,
            credentials: "include",
            next: { tags: ["priyanshu-portfolio"] },
        };

        if (["POST", "PUT", "PATCH", "DELETE"].includes(method.toUpperCase()) && data) {
            options.body = data instanceof FormData ? data : JSON.stringify(data);
        }

        const response = await fetch(fullUrl, options);

        const contentType = response.headers.get("content-type");
        const parsedData = contentType?.includes("application/json")
            ? await response.json()
            : await response.text();

        return {
            status: response.status,
            success: response.ok,
            data: parsedData,
        };
    } catch (error) {
        console.error("FetchApi Error:", error);
        return {
            status: 500,
            success: false,
            data: { message: "Something went wrong" },
        };
    }
};


