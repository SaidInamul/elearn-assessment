import { Method, router, VisitOptions } from '@inertiajs/vue3';
import { useToast } from 'vue-toastification';

const toast = useToast();

/**
 * A reusable API utility to perform Inertia requests with built-in
 * error handling and toast notifications for success and failures.
 */
export function apiRequest(method: Method, url: string, data: any = {}, options: VisitOptions = {}) {
    return new Promise((resolve, reject) => {
        router.visit(url, {
            method,
            data,
            preserveScroll: true,
            ...options,
            onSuccess: (page) => {
                const flash = page.props.flash as Record<string, string> | undefined;

                if (flash?.message) {
                    toast.success(flash.message);
                }

                if (flash?.error) {
                    toast.error(flash.error);
                }

                if (options.onSuccess) {
                    options.onSuccess(page);
                }
                resolve(page);
            },
            onError: (errors) => {
                const errorMessage = Object.values(errors)[0] || 'An unexpected error occurred.';
                toast.error(String(errorMessage));

                if (options.onError) {
                    options.onError(errors);
                }
                reject(errors);
            },
        });
    });
}

/**
 * Convenience method for GET requests
 */
export function apiGet(url: string, data?: any, options?: VisitOptions) {
    return apiRequest('get', url, data, options);
}

/**
 * Convenience method for POST requests
 */
export function apiPost(url: string, data?: any, options?: VisitOptions) {
    return apiRequest('post', url, data, options);
}

/**
 * Convenience method for PUT requests
 */
export function apiPut(url: string, data?: any, options?: VisitOptions) {
    return apiRequest('put', url, data, options);
}

/**
 * Convenience method for DELETE requests
 */
export function apiDelete(url: string, options?: VisitOptions) {
    return apiRequest('delete', url, {}, options);
}
