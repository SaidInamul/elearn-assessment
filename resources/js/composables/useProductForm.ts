import { useForm } from '@inertiajs/vue3';
import { useToast } from 'vue-toastification';
import { z } from 'zod';

export interface ProductFormData {
    name: string;
    quantity: number | '';
    category_id: number | '';
}

const productSchema = z.object({
    name: z.string().min(1, 'Product Name is required.').max(255, 'Product Name must not exceed 255 characters.'),
    quantity: z.coerce
        .number({
            required_error: 'Quantity is required.',
            invalid_type_error: 'Quantity must be a number.',
        })
        .int('Quantity must be an integer.')
        .min(1, 'Quantity must be at least 1.'),
    category_id: z.coerce
        .number({
            required_error: 'Category is required.',
            invalid_type_error: 'Category must be selected.',
        })
        .min(1, 'Category is required.'),
});

export function useProductForm(initialData?: Partial<ProductFormData>, productId?: number) {
    const toast = useToast();

    // Initialize the Inertia form helper
    const form = useForm<ProductFormData>({
        name: initialData?.name || '',
        quantity: initialData?.quantity || '',
        category_id: initialData?.category_id || '',
    });

    const submit = (options?: { onSuccess?: () => void; productId?: number }) => {
        form.clearErrors();

        const result = productSchema.safeParse(form.data());

        if (!result.success) {
            const formattedErrors = result.error.format();

            if (formattedErrors.name && formattedErrors.name._errors.length > 0) {
                form.setError('name', formattedErrors.name._errors[0]);
            }
            if (formattedErrors.quantity && formattedErrors.quantity._errors.length > 0) {
                form.setError('quantity', formattedErrors.quantity._errors[0]);
            }
            if (formattedErrors.category_id && formattedErrors.category_id._errors.length > 0) {
                form.setError('category_id', formattedErrors.category_id._errors[0]);
            }

            toast.error('Please fill-in the form correctly.');
            return;
        }

        const targetProductId = options?.productId || productId;

        if (targetProductId) {
            // Update an existing product
            form.put(route('products.update', targetProductId), {
                preserveScroll: true,
                onSuccess: (page) => {
                    const flash = page.props.flash as Record<string, string> | undefined;
                    if (flash?.message) toast.success(flash.message);
                    if (options?.onSuccess) options.onSuccess();
                },
                onError: (errors) => {
                    const errorMessage = Object.values(errors)[0] || 'Please fix the validation errors.';
                    toast.error(String(errorMessage));
                },
            });
        } else {
            // Create a new product
            form.post(route('products.store'), {
                preserveScroll: true,
                onSuccess: (page) => {
                    const flash = page.props.flash as Record<string, string> | undefined;
                    if (flash?.message) toast.success(flash.message);
                    if (options?.onSuccess) options.onSuccess();
                },
                onError: (errors) => {
                    const errorMessage = Object.values(errors)[0] || 'Unable to create a new product. Please try again.';
                    toast.error(String(errorMessage));
                },
            });
        }
    };

    return {
        form,
        submit,
    };
}
