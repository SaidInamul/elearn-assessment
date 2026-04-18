import { computed, ref, watch, type Ref } from 'vue';

export interface Category {
    id: number;
    name: string;
    created_at: string;
}

export function useCategories(initialCategories: Ref<Category[]> | Category[], itemsPerPage: number = 6) {
    const categoriesData = ref(initialCategories);

    const searchQuery = ref('');
    const sortColumn = ref<keyof Category>('id');
    const sortDirection = ref<'asc' | 'desc'>('desc');
    const currentPage = ref(1);

    // Reset to page 1 whenever search or sort state changes
    watch([searchQuery, sortColumn, sortDirection], () => {
        currentPage.value = 1;
    });

    const filteredAndSortedCategories = computed(() => {
        let result = [...categoriesData.value];

        // Search
        if (searchQuery.value) {
            const query = searchQuery.value.toLowerCase();
            result = result.filter((category) => category.name.toLowerCase().includes(query));
        }

        // Sort
        result.sort((a, b) => {
            let valueA = a[sortColumn.value];
            let valueB = b[sortColumn.value];

            if (valueA < valueB) return sortDirection.value === 'asc' ? -1 : 1;
            if (valueA > valueB) return sortDirection.value === 'asc' ? 1 : -1;
            return 0;
        });

        return result;
    });

    const totalPages = computed(() => Math.ceil(filteredAndSortedCategories.value.length / itemsPerPage));

    const paginatedCategories = computed(() => {
        const start = (currentPage.value - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        return filteredAndSortedCategories.value.slice(start, end);
    });

    const handleSort = (column: keyof Category) => {
        if (sortColumn.value === column) {
            sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
        } else {
            sortColumn.value = column;
            sortDirection.value = 'asc';
        }
    };

    return {
        categoriesData,
        searchQuery,
        sortColumn,
        sortDirection,
        currentPage,
        itemsPerPage,
        filteredAndSortedCategories,
        totalPages,
        paginatedCategories,
        handleSort,
    };
}
