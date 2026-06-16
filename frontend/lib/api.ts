// lib/api/client.ts
import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://192.168.100.53:8000';

// Define routes to handle Staff/Guest logic correctly based on your OpenAPI spec
const PUBLIC_ROUTES = ['/api/register', '/api/login', '/api/guest/portal'];
const GUEST_BODY_ROUTES = ['/api/guest/requests'];

export async function fetchApi<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const isPublicRoute = PUBLIC_ROUTES.some(route => endpoint.includes(route));
    const isGuestBodyRoute = GUEST_BODY_ROUTES.some(route => endpoint.includes(route));

    const headers = new Headers(options.headers || {});

    // 1. Always demand JSON from Laravel
    headers.set("Accept", "application/json");

    // 2. Automatically format body requests as JSON
    if (options.body && typeof options.body === "string" && !headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
    }

    // 3. Inject STAFF Sanctum Token (Skip for public routes like login)
    if (!isPublicRoute) {
        const staffToken = Cookies.get("riadkit_staff_token");
        console.log('� Token from cookie:', staffToken); // DEBUG
        
        if (staffToken) {
            headers.set("Authorization", `Bearer ${staffToken}`);
            console.log('✅ Authorization header set'); // DEBUG
        } else {
            console.warn('❌ No token found in cookies'); // DEBUG
        }
    }

    // 4. Handle GUEST Session ID properly according to your OpenAPI spec
    let modifiedEndpoint = endpoint;
    const guestSessionId = Cookies.get("riadkit_session_id");

    if (guestSessionId) {
        if (isGuestBodyRoute) {
            if (options.body && typeof options.body === 'string') {
                try {
                    const body = JSON.parse(options.body);
                    body.session_id = guestSessionId;
                    options.body = JSON.stringify(body);
                } catch (e) {
                    console.warn('Failed to parse body for session_id injection:', e);
                }
            }
        } else if (!endpoint.includes('session_id=')) {
            const separator = endpoint.includes('?') ? '&' : '?';
            modifiedEndpoint = `${endpoint}${separator}session_id=${guestSessionId}`;
        }
    }

    // ✅ CRITICAL: Include credentials for CORS
    const config: RequestInit = { 
        ...options, 
        headers,
        credentials: 'include'  // ✅ THIS IS THE FIX
    };

    try {
        const response = await fetch(`${API_URL}${modifiedEndpoint}`, config);

        // Handle 204 No Content
        if (response.status === 204) return null as any;

        // Safely check if the response is actually JSON
        const contentType = response.headers.get("content-type");
        const isJson = contentType && contentType.includes("application/json");

        let data;
        if (isJson) {
            data = await response.json();
        } else {
            const textError = await response.text();
            console.error("Received HTML instead of JSON:", textError.substring(0, 200));
            data = { message: `Server error: Received HTML (Status ${response.status})` };
        }

        if (!response.ok) {
            console.error(`Fetch error [${endpoint}]:`, response.status, data);

            // Handle Staff Token Expired (401)
            if (response.status === 401) {
                const token = Cookies.get("riadkit_staff_token");
                if (token && typeof window !== "undefined" && window.location.pathname !== '/login') {
                    console.warn("Unauthorized! Wiping token and redirecting...");
                    Cookies.remove("riadkit_staff_token", { path: '/' });
                    if (!window.location.pathname.startsWith('/room/')) {
                        window.location.href = "/login";
                    }
                }
            }

            // Handle Guest Session Expired (403)
            if (response.status === 403) {
                if (typeof window !== "undefined" && window.location.pathname.startsWith('/room/')) {
                    window.dispatchEvent(new CustomEvent('guest-session-expired', {
                        detail: { 
                            message: data.message || 'Your session has expired',
                            status: response.status 
                        }
                    }));
                }
            }

            throw { status: response.status, data, message: data.message || "API Error" };
        }

        return data as T;
    } catch (error: any) {
        console.error(`API Error [${endpoint}]:`, error);
        if (error.status) throw error;
        throw { 
            status: 0, 
            data: null,
            message: error.message || 'Network error or server unreachable'
        };
    }
}