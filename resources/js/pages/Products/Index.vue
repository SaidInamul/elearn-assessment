<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Skeleton from '@/components/ui/skeleton/Skeleton.vue';
import UpdateProductModal from '@/components/UpdateProductModal.vue';
import { useProducts, type Category, type Product } from '@/composables/useProducts';
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/vue3';
import { ArrowDown, ArrowUp, Plus, Search } from 'lucide-vue-next';
import { onMounted, ref, watch } from 'vue';

const props = defineProps<{
    products?: { data: Product[] };
    categories?: Category[];
}>();

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Products',
        href: '/products',
    },
];

const isLoading = ref(true);
const productList = ref<Product[]>([]);

const isUpdateModalOpen = ref(false);
const selectedProduct = ref<Product | null>(null);

const openUpdateModal = (product: Product) => {
    selectedProduct.value = product;
    isUpdateModalOpen.value = true;
};

const handleUpdateSuccess = () => {
    router.reload({ only: ['products'] });
};

const {
    searchQuery,
    selectedCategory,
    sortColumn,
    sortDirection,
    currentPage,
    itemsPerPage,
    uniqueCategories,
    filteredAndSortedProducts,
    totalPages,
    paginatedProducts,
    handleSort,
} = useProducts(productList, 6);

watch(
    () => props.products,
    (newProducts) => {
        if (newProducts?.data) {
            productList.value = newProducts.data;
            isLoading.value = false;
        }
    },
    { immediate: true },
);

onMounted(() => {
    if (!props.products) {
        router.reload({ only: ['products'] });
    }
});
</script>

<template>
    <Head title="Products" />

    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="flex h-full flex-1 flex-col gap-6 p-4 md:p-6 lg:p-8">
            <!-- Header Section -->
            <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 class="text-2xl font-semibold tracking-tight text-foreground">Products</h2>
                    <p class="text-sm text-muted-foreground">Manage your product inventory and categories.</p>
                </div>
                <Button as-child class="w-full md:w-auto">
                    <Link :href="route('products.create')">
                        <Plus class="mr-2 h-4 w-4" />
                        Add Product
                    </Link>
                </Button>
            </div>

            <!-- Filters and Search Section -->
            <div class="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 md:flex-row md:items-center md:justify-between">
                <div class="relative w-full max-w-sm">
                    <Search class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input v-model="searchQuery" type="text" placeholder="Search products..." class="w-full pl-9" />
                </div>
                <div class="w-full md:w-48">
                    <select
                        v-model="selectedCategory"
                        class="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <option value="">All Categories</option>
                        <option v-for="category in uniqueCategories" :key="category.id" :value="category.id.toString()">
                            {{ category.name }}
                        </option>
                    </select>
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
                                        Product Name
                                        <template v-if="sortColumn === 'name'">
                                            <ArrowUp v-if="sortDirection === 'asc'" class="h-3 w-3" />
                                            <ArrowDown v-else class="h-3 w-3" />
                                        </template>
                                    </div>
                                </th>
                                <th class="cursor-pointer px-6 py-4 font-medium hover:text-foreground" @click="handleSort('quantity')">
                                    <div class="flex items-center gap-1">
                                        Quantity
                                        <template v-if="sortColumn === 'quantity'">
                                            <ArrowUp v-if="sortDirection === 'asc'" class="h-3 w-3" />
                                            <ArrowDown v-else class="h-3 w-3" />
                                        </template>
                                    </div>
                                </th>
                                <th class="cursor-pointer px-6 py-4 font-medium hover:text-foreground" @click="handleSort('category')">
                                    <div class="flex items-center gap-1">
                                        Category
                                        <template v-if="sortColumn === 'category'">
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
                                    <td class="px-6 py-4"><Skeleton class="h-4 w-12" /></td>
                                    <td class="px-6 py-4"><Skeleton class="h-4 w-24" /></td>
                                    <td class="px-6 py-4"><Skeleton class="h-4 w-32" /></td>
                                    <td class="px-6 py-4 text-right"><Skeleton class="ml-auto h-4 w-12" /></td>
                                </tr>
                            </template>
                            <template v-else>
                                <tr v-if="filteredAndSortedProducts.length === 0">
                                    <td colspan="6" class="px-6 py-8 text-center text-muted-foreground">No products found matching your criteria.</td>
                                </tr>
                                <tr v-for="(product, index) in paginatedProducts" :key="product.id" class="transition-colors hover:bg-muted/50">
                                    <td class="px-6 py-4 text-muted-foreground">
                                        {{ (currentPage - 1) * itemsPerPage + index + 1 }}
                                    </td>
                                    <td class="px-6 py-4 font-medium text-foreground">
                                        {{ product.name }}
                                    </td>
                                    <td class="px-6 py-4">
                                        <span
                                            :class="[
                                                'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium',
                                                product.quantity > 10
                                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
                                            ]"
                                        >
                                            {{ product.quantity }}
                                        </span>
                                    </td>
                                    <td class="px-6 py-4">
                                        <span
                                            v-if="product.category"
                                            class="inline-flex items-center rounded-full bg-primary px-2 py-1 text-xs font-medium text-primary-foreground"
                                        >
                                            {{ product.category.name }}
                                        </span>
                                        <span v-else class="text-xs italic text-muted-foreground">Uncategorized</span>
                                    </td>
                                    <td class="px-6 py-4 text-sm text-muted-foreground">
                                        {{ product.created_at }}
                                    </td>
                                    <td class="px-6 py-4 text-right">
                                        <button
                                            @click="openUpdateModal(product)"
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
                    <span class="font-medium text-foreground">{{ Math.min(currentPage * itemsPerPage, filteredAndSortedProducts.length) }}</span> of
                    <span class="font-medium text-foreground">{{ filteredAndSortedProducts.length }}</span> results
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

        <UpdateProductModal
            v-model:isOpen="isUpdateModalOpen"
            :product="selectedProduct"
            :categories="categories || []"
            @success="handleUpdateSuccess"
        />
    </AppLayout>
</template>
