<script setup lang="ts">
import InputError from '@/components/InputError.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCategoryForm } from '@/composables/useCategoryForm';
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/vue3';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Categories',
        href: '/categories',
    },
    {
        title: 'Create',
        href: '/categories/create',
    },
];

const { form, submit } = useCategoryForm();
</script>

<template>
    <Head title="Create Category" />

    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="flex h-full flex-1 flex-col gap-6 p-4 md:p-6 lg:p-8">
            <!-- Header Section -->
            <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 class="text-2xl font-semibold tracking-tight text-foreground">Create Category</h2>
                    <p class="text-sm text-muted-foreground">Add a new category to group your products.</p>
                </div>
            </div>

            <!-- Form Section -->
            <div class="max-w-2xl rounded-xl border border-border bg-card p-6 shadow-sm">
                <form @submit.prevent="submit()" class="space-y-6">
                    <!-- Category Name -->
                    <div class="space-y-2">
                        <Label for="name">Category Name</Label>
                        <Input
                            id="name"
                            v-model="form.name"
                            type="text"
                            placeholder="Enter category name"
                            :class="{ 'border-destructive focus-visible:ring-destructive': form.errors.name }"
                        />
                        <InputError :message="form.errors.name" />
                    </div>

                    <!-- Actions -->
                    <div class="flex items-center justify-end gap-4 pt-4">
                        <Button variant="secondary" as-child>
                            <Link :href="route('categories.index')">Cancel</Link>
                        </Button>
                        <Button type="submit" :disabled="form.processing"> Save Category </Button>
                    </div>
                </form>
            </div>
        </div>
    </AppLayout>
</template>
