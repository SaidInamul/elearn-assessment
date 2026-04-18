import { useForm } from '@inertiajs/vue3';
import { useToast } from 'vue-toastification';
import { z } from 'zod';

export interface CategoryFormData {
    name: string;
}

const categorySchema = z.object({
    name: z.string().min(1, 'Category Name is required.').max(255, 'Category Name must not exceed 255 characters.'),
});

export function useCategoryForm(initialData?: Partial<CategoryFormData>, categoryId?: number) {
    const toast = useToast();

    // Initialize the Inertia form helper
    const form = useForm<CategoryFormData>({
        name: initialData?.name || '',
    });

    const submit = (options?: { onSuccess?: () => void; categoryId?: number }) => {
        form.clearErrors();

        const result = categorySchema.safeParse(form.data());

        if (!result.success) {
            const formattedErrors = result.error.format();

            if (formattedErrors.name && formattedErrors.name._errors.length > 0) {
                form.setError('name', formattedErrors.name._errors[0]);
            }

            toast.error('Please fill-in the form correctly.');
            return;
        }

        const targetCategoryId = options?.categoryId || categoryId;

        if (targetCategoryId) {
            // Update an existing category
            form.put(route('categories.update', targetCategoryId), {
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
            // Create a new category
            form.post(route('categories.store'), {
                preserveScroll: true,
                onSuccess: (page) => {
                    const flash = page.props.flash as Record<string, string> | undefined;
                    if (flash?.message) toast.success(flash.message);
                    if (options?.onSuccess) options.onSuccess();
                },
                onError: (errors) => {
                    const errorMessage = Object.values(errors)[0] || 'Unable to create a new category. Please try again.';
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
