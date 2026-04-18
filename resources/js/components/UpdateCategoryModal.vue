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
import { useCategoryForm } from '@/composables/useCategoryForm';
import { type Category } from '@/composables/useCategories';
import { watch } from 'vue';

const props = defineProps<{
    isOpen: boolean;
    category: Category | null;
}>();

const emit = defineEmits<{
    (e: 'update:isOpen', value: boolean): void;
    (e: 'success'): void;
}>();

const { form, submit } = useCategoryForm();

// Watch for changes to the selected category to populate the form
watch(
    () => props.category,
    (newCategory) => {
        if (newCategory) {
            form.name = newCategory.name;
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
    if (!props.category) return;

    submit({
        categoryId: props.category.id,
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
                <DialogTitle>Update Category</DialogTitle>
                <DialogDescription> Make changes to your category here. Click save when you're done. </DialogDescription>
            </DialogHeader>

            <form @submit.prevent="handleUpdate" class="space-y-4 py-4">
                <!-- Category Name -->
                <div class="space-y-2">
                    <Label for="update_category_name">Category Name</Label>
                    <Input
                        id="update_category_name"
                        v-model="form.name"
                        type="text"
                        placeholder="Enter category name"
                        :class="{ 'border-destructive focus-visible:ring-destructive': form.errors.name }"
                    />
                    <InputError :message="form.errors.name" />
                </div>

                <DialogFooter class="pt-4">
                    <Button type="button" variant="secondary" @click="handleOpenChange(false)"> Cancel </Button>
                    <Button type="submit" :disabled="form.processing"> Save Changes </Button>
                </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>
</template>
