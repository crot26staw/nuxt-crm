<script lang="ts" setup>
import { useForm } from 'vee-validate';
import * as yup from 'yup';

const { errors, handleSubmit, defineField, resetForm } = useForm({
    validationSchema: yup.object({
        text: yup.string()
            .required('Имя обязательно для заполнения'),
    }),
});
const onSubmit = handleSubmit(async (values) => {
    console.log(values);
    resetForm();
});
const [text, textAttrs] = defineField('text');
</script>
<template>
    <div class="AppTaskChat">
        <div class="AppTaskChat__message"></div>
        <form class="AppTaskChat__form" @submit.prevent="onSubmit">
            <UiInput type="text" placeholder="Сообщение" v-model="text" v-bind="textAttrs" />
            <UiButton as="button" type="submit" class="btn">
                <span>Отправить</span>
            </UiButton>
        </form>
    </div>
</template>
<style lang="scss">
.AppTaskChat {
    margin-top: 22px;
    height: 90%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    &__form{
        display: flex;
        gap: 20px;
    }
}
</style>