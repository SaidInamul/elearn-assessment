<script setup lang="ts">
import InputError from '@/components/InputError.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useProductForm } from '@/composables/useProductForm';
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/vue3';

interface Category {
    id: number;
    name: string;
}

defineProps<{
    categories: Category[];
}>();

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Products',
        href: '/products',
    },
    {
        title: 'Create',
        href: '/products/create',
    },
];

const { form, submit } = useProductForm();
</script>

<template>
    <Head title="Create Product" />

    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="flex h-full flex-1 flex-col gap-6 p-4 md:p-6 lg:p-8">
            <!-- Header Section -->
            <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 class="text-2xl font-semibold tracking-tight text-foreground">Create Product</h2>
                    <p class="text-sm text-muted-foreground">Add a new product to your inventory.</p>
                </div>
            </div>

            <!-- Form Section -->
            <div class="max-w-2xl rounded-xl border border-border bg-card p-6 shadow-sm">
                <form @submit.prevent="submit" class="space-y-6">
                    <!-- Product Name -->
                    <div class="space-y-2">
                        <Label for="name">Product Name</Label>
                        <Input
                            id="name"
                            v-model="form.name"
                            type="text"
                            placeholder="Enter product name"
                            :class="{ 'border-destructive focus-visible:ring-destructive': form.errors.name }"
                        />
                        <InputError :message="form.errors.name" />
                    </div>

                    <!-- Quantity -->
                    <div class="space-y-2">
                        <Label for="quantity">Quantity</Label>
                        <Input
                            id="quantity"
                            v-model="form.quantity"
                            type="number"
                            min="1"
                            placeholder="Enter product quantity"
                            :class="{ 'border-destructive focus-visible:ring-destructive': form.errors.quantity }"
                        />
                        <InputError :message="form.errors.quantity" />
                    </div>

                    <!-- Category -->
                    <div class="space-y-2">
                        <Label for="category_id">Category</Label>
                        <select
                            id="category_id"
                            v-model="form.category_id"
                            :class="[
                                'flex h-10 w-full items-center justify-between rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                                form.errors.category_id ? 'border-destructive focus:ring-destructive' : 'border-input focus:ring-ring',
                            ]"
                        >
                            <option value="" disabled>Select a category</option>
                            <option v-for="category in categories" :key="category.id" :value="category.id">
                                {{ category.name }}
                            </option>
                        </select>
                        <InputError :message="form.errors.category_id" />
                    </div>

                    <!-- Actions -->
                    <div class="flex items-center justify-end gap-4 pt-4">
                        <Button variant="secondary" as-child>
                            <Link :href="route('products.index')">Cancel</Link>
                        </Button>
                        <Button type="submit" :disabled="form.processing"> Save Product </Button>
                    </div>
                </form>
            </div>
        </div>
    </AppLayout>
</template>
