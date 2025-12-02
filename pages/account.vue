<script lang="ts" setup>
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { useDataUserStore } from '~/store/dataUser';

// profeile avatar
const { avatarUrl, loadProfile, uploadToSupabase } = useAvatarChange();
await loadProfile();

const fileInput = ref<HTMLInputElement | null>(null)
const selectImage = () => {
  fileInput.value?.click();
}

const onFileChange = async (e: Event) => {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  await uploadToSupabase(file)
}

// data user update
const { updateDataUser } = useDataUserStore();
const {dataUser, isLoading } = storeToRefs(useDataUserStore());

// Validate
const { errors, handleSubmit, defineField } = useForm({
  initialValues: {
    name: dataUser.value.name
  },
  validationSchema: yup.object({}),
});

const [name, nameAttrs] = defineField('name');

const onSubmit = handleSubmit(async (values) => {
  await updateDataUser(values.name);
});

</script>

<template>
  <div class="AppAccount">
    <h1 class="title">Страница аккаунта</h1>
    <div class="AppAccount__wrapper">
      <div class="AppAccount__head">
        <div class="AppAccount__avatar" @click="selectImage">
          <div v-if="avatarUrl != ''" class="AppAccount__avatar-label">
            <NuxtImg src="icons/photo.svg" width="24px" class="AppAccount__icon" />
          </div>
          <div class="AppAccount__photo">
            <NuxtImg v-if="avatarUrl != ''" :src="avatarUrl" width="100px" height="100px"
              class="AppAccount__avatar-img" />
            <NuxtImg v-else src="icons/photo.svg" width="24px" class="AppAccount__icon" />
          </div>
          <input type="file" accept="image/*" ref="fileInput" class="hidden" @change="onFileChange" />
        </div>
        <form class="AppAccount__form" @submit.prevent="onSubmit">
          <div class="AppAccount__form-item">
            <p class="AppAccount__form-item-name">Отображаемое имя</p>
            <UiInput type="name" class="AppAccount__input" placeholder="Имя" v-model="name" v-bind="nameAttrs" />
            <p v-if="errors.name" class="text-red-500 text-sm mt-1">{{ errors.name }}</p>
          </div>
          <UiButton as="button" type="submit" :disabled="isLoading" class="btn login-page__btn">
            <span v-if="!isLoading">Сохранить</span>
            <span v-else>⏳ Сохранение...</span>
          </UiButton>
        </form>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
.AppAccount {
  &__wrapper {
    margin-top: 22px;
  }

  &__head {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  &__avatar {
    display: flex;
    flex-direction: column;
    gap: 12px;
    align-items: center;
    cursor: pointer;
    position: relative;
    border-radius: 50%;
    overflow: hidden;

    &:hover .AppAccount__avatar-label {
      opacity: 1;
    }
  }

  &__avatar-label {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 5;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(14, 24, 43, 0.6);
    transition: all 0.3s;
    opacity: 0;
  }

  &__photo {
    width: 100px;
    height: 100px;
    background: rgba(14, 24, 43, 0.6);
    position: relative;
  }

  &__icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
  }

  &__form {
    display: flex;
    align-items: flex-end;
    gap: 20px;
  }

  &__input {
    min-width: 220px;
  }

  &__form-item-name {
    color: rgba(14, 24, 43, 0.6);
  }
}
</style>