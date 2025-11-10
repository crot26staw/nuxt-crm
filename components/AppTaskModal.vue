<script lang="ts" setup>
import { useForm } from 'vee-validate';
import * as yup from 'yup';

const props = defineProps(['status']);

const emit = defineEmits(['change-modal']);
const emitChangeModal = () => {
    emit('change-modal');
}

const { errors, handleSubmit, defineField, resetForm } = useForm({
    validationSchema: yup.object({
        name: yup.string()
            .required('Поле обязательно для заполнения'),
        price: yup.string()
            .matches(/^\d+$/, 'Цена содержит только цифры')
            .required('Поле обязателен для заполнения'),
        company: yup.string()
            .required('Поле обязательно для заполнения'),
    }),
});

const supabase = useSupabaseClient();
let isError = ref<string>('');
const isLoading = ref(false);

const onSubmit = handleSubmit(async (values) => {
    isLoading.value = true
    try {
        const { error } = await supabase
            .from('tasks')
            .insert({
                task_name: values.name,
                company: values.company,
                price: values.price,
                status: values.status
            })
        if(error) {
            console.error('Unexpected error:', error);
        }
        emitChangeModal();
    } catch (err) {
        console.error('Unexpected error:', err);
    } finally {
        isLoading.value = false;
    }
    resetForm();
});
const [name, nameAttrs] = defineField('name');
const [price, priceAttrs] = defineField('price');
const [company, companyAttrs] = defineField('company');
const [status, statusAttrs] = defineField('status');

status.value = props.status.id;
</script>
<template>
    <div class="AppTaskModal" @click.self="emitChangeModal">
        <div class="AppTaskModal__wrapper">
            <div class="AppTaskModal__titles">
                <p class="AppTaskModal__title">Задача: {{ props.status.name }}</p>
                <NuxtImg class="AppTaskModal__close" src="icons/plus.svg" width="40px" @click="emitChangeModal" />
            </div>
            <form class="AppTaskModal__form" @submit.prevent="onSubmit">
                <div>
                    <UiInput type="text" placeholder="Задача" v-model="name" v-bind="nameAttrs" />
                    <p v-if="errors.name" class="text-red-500 text-sm mt-1">{{ errors.name }}</p>
                </div>
                <div>
                    <UiInput type="text" placeholder="Цена" v-model="price" v-bind="priceAttrs" />
                    <p v-if="errors.price" class="text-red-500 text-sm mt-1">{{ errors.price }}</p>
                </div>
                <div>
                    <UiInput type="text" placeholder="Организация" v-model="company" v-bind="companyAttrs" />
                    <p v-if="errors.company" class="text-red-500 text-sm mt-1">{{ errors.company }}</p>
                </div>
                <input type="hidden" name="status" v-model="status" v-bind="statusAttrs">
                <UiButton as="button" type="submit" :disabled="isLoading" class="btn login-page__btn">
                    <span v-if="!isLoading">Добавить</span>
                    <span v-else>⏳ Добавление...</span>
                </UiButton>
            </form>
        </div>
    </div>
</template>
<style lang="scss">
.AppTaskModal {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100vh;
    background-color: rgba(14, 24, 43, 0.6);
    display: flex;
    justify-content: center;
    align-items: flex-start;

    &__wrapper {
        margin-top: 20%;
        max-width: 500px;
        width: 100%;
        padding: 20px;
        border-radius: 32px;
        border: 2px solid var(--foreground);
        background: white;
    }

    &__titles {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    &__title {
        font-size: 24px;
        font-weight: 600;
    }

    &__close {
        cursor: pointer;
        transform: rotate(45deg);
        transition: all 0.3s;

        &:active {
            transform: scale(0.9);
        }
    }

    &__form {
        margin-top: 20px;
        display: flex;
        flex-direction: column;
        gap: 12px;
    }
}
</style>