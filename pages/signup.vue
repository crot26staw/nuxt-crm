<script lang="ts" setup>
import { useForm } from 'vee-validate';
import * as yup from 'yup';

definePageMeta({
    layout:'auth'
})
const { errors, handleSubmit, defineField, resetForm } = useForm({
    validationSchema: yup.object({
        password: yup.string()
            .matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/,
                'Минимум 8 символов, включая заглавную букву, строчную букву, цифру и спецсимвол'
            )
            .required('Пароль обязательно для заполнения'),
        email: yup.string()
            .email('Введите корректный email адрес')
            .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email должен содержать @ и домен')
            .required('Email обязателен для заполнения'),
    }),
});
const supabase = useSupabaseClient();
let isError = ref<string>('');
const isLoading = ref(false);
const router = useRouter();
const onSubmit = handleSubmit(async (values) => {
    isLoading.value = true
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: values.email,
            password: values.password,
        })
        if (error) {
            console.error('Auth error:', error.message)
            isError.value = error.message
            return
        }
        await router.push('/')
    } catch (err) {
        console.error('Unexpected error:', err);
    } finally {
        isLoading.value = false;
    }
    resetForm();
});
const [email, emailAttrs] = defineField('email');
const [password, passwordAttrs] = defineField('password');
</script>
<template>
    <div class="login-page">
        <form class="login-page__form" @submit.prevent="onSubmit">
            <p class="login-page__title">Введите данные для авторизации</p>
            <div>
                <UiInput type="email" placeholder="Email" v-model="email" v-bind="emailAttrs" />
                <p v-if="errors.email" class="text-red-500 text-sm mt-1">{{ errors.email }}</p>
            </div>
            <div>
                <UiInput type="password" placeholder="Пароль" v-model="password" v-bind="passwordAttrs" />
                <p v-if="errors.password" class="text-red-500 text-sm mt-1">{{ errors.password }}</p>
            </div>
            <UiButton as="button" type="submit" :disabled="isLoading" class="btn login-page__btn">
                <span v-if="!isLoading">Авторизоваться</span>
                <span v-else>⏳ Авторизация...</span>
            </UiButton>
            <NuxtLink to="/login">Зарегистрироваться</NuxtLink>
            <p v-if="isError != ''" class="text-red-500 text-sm mt-1">{{ isError }}</p>
        </form>
    </div>
</template>
<style lang="scss" scoped>
.login-page {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;

    &__form {
        max-width: 420px;
        display: flex;
        flex-direction: column;
        gap: 20px;
        width: 100%;
        padding: 20px;
        border-radius: 32px;
        border: 2px solid var(--foreground);
    }

    &__title {
        font-size: 24px;
        text-align: center;
    }

    &__btn {
        width: 100%;
    }
}
</style>