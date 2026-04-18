import { computed, ref, watch, type Ref } from 'vue';

export interface Category {
    id: number;
    name: string;
}

export interface Product {
    id: number;
    name: string;
    quantity: number;
    category?: Category;
    created_at: string;
}

export function useProducts(initialProducts: Ref<Product[]> | Product[], itemsPerPage: number = 6) {
    const productsData = ref(initialProducts);

    const searchQuery = ref('');
    const selectedCategory = ref('');
    const sortColumn = ref<keyof Product>('id');
    const sortDirection = ref<'asc' | 'desc'>('asc');
    const currentPage = ref(1);

    // Reset to page 1 whenever search, filter, or sort state changes
    watch([searchQuery, selectedCategory, sortColumn, sortDirection], () => {
        currentPage.value = 1;
    });

    const uniqueCategories = computed(() => {
        const categories = new Map<number, Category>();
        productsData.value.forEach((product) => {
            if (product.category) {
                categories.set(product.category.id, product.category);
            }
        });
        return Array.from(categories.values());
    });

    const filteredAndSortedProducts = computed(() => {
        let result = [...productsData.value];

        // Search
        if (searchQuery.value) {
            const query = searchQuery.value.toLowerCase();
            result = result.filter((product) => product.name.toLowerCase().includes(query));
        }

        // Filter
        if (selectedCategory.value) {
            result = result.filter((product) => product.category?.id.toString() === selectedCategory.value);
        }

        // Sort
        result.sort((a, b) => {
            let valueA = a[sortColumn.value];
            let valueB = b[sortColumn.value];

            if (sortColumn.value === ('category' as any)) {
                valueA = a.category?.name || '';
                valueB = b.category?.name || '';
            }

            if (valueA < valueB) return sortDirection.value === 'asc' ? -1 : 1;
            if (valueA > valueB) return sortDirection.value === 'asc' ? 1 : -1;
            return 0;
        });

        return result;
    });

    const totalPages = computed(() => Math.ceil(filteredAndSortedProducts.value.length / itemsPerPage));

    const paginatedProducts = computed(() => {
        const start = (currentPage.value - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        return filteredAndSortedProducts.value.slice(start, end);
    });

    const handleSort = (column: keyof Product | 'category') => {
        if (sortColumn.value === column) {
            sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
        } else {
            sortColumn.value = column as keyof Product;
            sortDirection.value = 'asc';
        }
    };

    return {
        productsData,
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
    };
}
