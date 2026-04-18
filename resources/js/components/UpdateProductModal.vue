<script setup lang="ts">
import InputError from '@/components/InputError.vue';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useProductForm } from '@/composables/useProductForm';
import { type Category, type Product } from '@/composables/useProducts';
import { watch } from 'vue';

const props = defineProps<{
    isOpen: boolean;
    product: Product | null;
    categories: Category[];
}>();

const emit = defineEmits<{
    (e: 'update:isOpen', value: boolean): void;
    (e: 'success'): void;
}>();

const { form, submit } = useProductForm();

// Watch for changes to the selected product to populate the form
watch(
    () => props.product,
    (newProduct) => {
        if (newProduct) {
            form.name = newProduct.name;
            form.quantity = newProduct.quantity;
            form.category_id = newProduct.category?.id || '';
            form.clearErrors();
        } else {
            form.reset();
            form.clearErrors();
        }
    },
    { immediate: true },
);

const handleOpenChange = (open: boolean) => {
    emit('update:isOpen', open);
};

const handleUpdate = () => {
    if (!props.product) return;

    submit({
        productId: props.product.id,
        onSuccess: () => {
            emit('update:isOpen', false);
            emit('success');
            form.reset();
        },
    });
};
</script>

<template>
    <Dialog :open="isOpen" @update:open="handleOpenChange">
        <DialogContent class="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Update Product</DialogTitle>
                <DialogDescription> Make changes to your product here. Click save when you're done. </DialogDescription>
            </DialogHeader>

            <form @submit.prevent="handleUpdate" class="space-y-4 py-4">
                <!-- Product Name -->
                <div class="space-y-2">
                    <Label for="update_name">Product Name</Label>
                    <Input
                        id="update_name"
                        v-model="form.name"
                        type="text"
                        placeholder="Enter product name"
                        :class="{ 'border-destructive focus-visible:ring-destructive': form.errors.name }"
                    />
                    <InputError :message="form.errors.name" />
                </div>

                <!-- Quantity -->
                <div class="space-y-2">
                    <Label for="update_quantity">Quantity</Label>
                    <Input
                        id="update_quantity"
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
                    <Label for="update_category_id">Category</Label>
                    <select
                        id="update_category_id"
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

                <DialogFooter class="pt-4">
                    <Button type="button" variant="secondary" @click="handleOpenChange(false)"> Cancel </Button>
                    <Button type="submit" :disabled="form.processing"> Save Changes </Button>
                </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>
</template>
