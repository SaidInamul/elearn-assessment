<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Skeleton from '@/components/ui/skeleton/Skeleton.vue';
import UpdateCategoryModal from '@/components/UpdateCategoryModal.vue';
import { useCategories, type Category } from '@/composables/useCategories';
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/vue3';
import { ArrowDown, ArrowUp, Plus, Search } from 'lucide-vue-next';
import { onMounted, ref, watch } from 'vue';

const props = defineProps<{
    categories?: { data: Category[] };
}>();

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Categories',
        href: '/categories',
    },
];

const isLoading = ref(true);
const categoryList = ref<Category[]>([]);

const isUpdateModalOpen = ref(false);
const selectedCategory = ref<Category | null>(null);

const openUpdateModal = (category: Category) => {
    selectedCategory.value = category;
    isUpdateModalOpen.value = true;
};

const handleUpdateSuccess = () => {
    router.reload({ only: ['categories'] });
};

const {
    searchQuery,
    sortColumn,
    sortDirection,
    currentPage,
    itemsPerPage,
    filteredAndSortedCategories,
    totalPages,
    paginatedCategories,
    handleSort,
} = useCategories(categoryList, 6);

watch(
    () => props.categories,
    (newCategories) => {
        if (newCategories?.data) {
            categoryList.value = newCategories.data;
            isLoading.value = false;
        }
    },
    { immediate: true },
);

onMounted(() => {
    if (!props.categories) {
        router.reload({ only: ['categories'] });
    }
});
</script>

<template>
    <Head title="Categories" />

    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="flex h-full flex-1 flex-col gap-6 p-4 md:p-6 lg:p-8">
            <!-- Header Section -->
            <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 class="text-2xl font-semibold tracking-tight text-foreground">Categories</h2>
                    <p class="text-sm text-muted-foreground">Manage your product categories.</p>
                </div>
                <Button as-child class="w-full md:w-auto">
                    <Link :href="route('categories.create')">
                        <Plus class="mr-2 h-4 w-4" />
                        Add Category
                    </Link>
                </Button>
            </div>

            <!-- Filters and Search Section -->
            <div class="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 md:flex-row md:items-center md:justify-between">
                <div class="relative w-full max-w-sm">
                    <Search class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input v-model="searchQuery" type="text" placeholder="Search categories..." class="w-full pl-9" />
                </div>
            </div>

            <!-- Table Section -->
            <div class="overflow-hidden rounded-xl border border-border bg-card">
                <div class="overflow-x-auto">
                    <table class="w-full text-left text-sm">
                        <thead class="bg-muted/50 text-muted-foreground">
                            <tr>
                                <th class="px-6 py-4 font-medium">#</th>
                                <th class="cursor-pointer px-6 py-4 font-medium hover:text-foreground" @click="handleSort('name')">
                                    <div class="flex items-center gap-1">
                                        Category Name
                                        <template v-if="sortColumn === 'name'">
                                            <ArrowUp v-if="sortDirection === 'asc'" class="h-3 w-3" />
                                            <ArrowDown v-else class="h-3 w-3" />
                                        </template>
                                    </div>
                                </th>
                                <th class="cursor-pointer px-6 py-4 font-medium hover:text-foreground" @click="handleSort('created_at')">
                                    <div class="flex items-center gap-1">
                                        Created At
                                        <template v-if="sortColumn === 'created_at'">
                                            <ArrowUp v-if="sortDirection === 'asc'" class="h-3 w-3" />
                                            <ArrowDown v-else class="h-3 w-3" />
                                        </template>
                                    </div>
                                </th>
                                <th class="px-6 py-4 text-right font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-border">
                            <template v-if="isLoading">
                                <tr v-for="i in itemsPerPage" :key="'skeleton-' + i" class="transition-colors hover:bg-muted/50">
                                    <td class="px-6 py-4"><Skeleton class="h-4 w-6" /></td>
                                    <td class="px-6 py-4"><Skeleton class="h-4 w-48" /></td>
                                    <td class="px-6 py-4"><Skeleton class="h-4 w-32" /></td>
                                    <td class="px-6 py-4 text-right"><Skeleton class="ml-auto h-4 w-12" /></td>
                                </tr>
                            </template>
                            <template v-else>
                                <tr v-if="filteredAndSortedCategories.length === 0">
                                    <td colspan="4" class="px-6 py-8 text-center text-muted-foreground">No categories found matching your criteria.</td>
                                </tr>
                                <tr v-for="(category, index) in paginatedCategories" :key="category.id" class="transition-colors hover:bg-muted/50">
                                    <td class="px-6 py-4 text-muted-foreground">
                                        {{ (currentPage - 1) * itemsPerPage + index + 1 }}
                                    </td>
                                    <td class="px-6 py-4 font-medium text-foreground">
                                        {{ category.name }}
                                    </td>
                                    <td class="px-6 py-4 text-sm text-muted-foreground">
                                        {{ category.created_at }}
                                    </td>
                                    <td class="px-6 py-4 text-right">
                                        <button
                                            @click="openUpdateModal(category)"
                                            class="text-sm font-medium text-primary transition-colors hover:text-primary/80 hover:underline"
                                        >
                                            Update
                                        </button>
                                    </td>
                                </tr>
                            </template>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Pagination Section -->
            <div v-if="totalPages > 1" class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <p class="text-sm text-muted-foreground">
                    Showing <span class="font-medium text-foreground">{{ (currentPage - 1) * itemsPerPage + 1 }}</span> to
                    <span class="font-medium text-foreground">{{ Math.min(currentPage * itemsPerPage, filteredAndSortedCategories.length) }}</span> of
                    <span class="font-medium text-foreground">{{ filteredAndSortedCategories.length }}</span> results
                </p>
                <div class="flex items-center space-x-2">
                    <Button variant="secondary" size="sm" :disabled="currentPage === 1" @click="currentPage--"> Previous </Button>
                    <div class="hidden items-center gap-1 md:flex">
                        <button
                            v-for="page in totalPages"
                            :key="page"
                            @click="currentPage = page"
                            :class="[
                                'flex h-8 w-8 items-center justify-center rounded-md text-sm font-medium transition-colors',
                                currentPage === page
                                    ? 'bg-primary text-primary-foreground'
                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                            ]"
                        >
                            {{ page }}
                        </button>
                    </div>
                    <Button variant="secondary" size="sm" :disabled="currentPage === totalPages" @click="currentPage++"> Next </Button>
                </div>
            </div>
        </div>

        <UpdateCategoryModal
            v-model:isOpen="isUpdateModalOpen"
            :category="selectedCategory"
            @success="handleUpdateSuccess"
        />
    </AppLayout>
</template>
