<script lang="ts" setup>
import { useSupabaseClient, useSupabaseUser } from '#imports'
import { ref } from 'vue'

const supabase = useSupabaseClient()
const user = useSupabaseUser()

const fileInput = ref<HTMLInputElement | null>(null)
const preview = ref('')
const uploading = ref(false)

const selectImage = () => {
  fileInput.value?.click()
}

// Получаем аватар
const avatarUrl = ref('');
const loadProfile = async () => {
  if (!user.value?.sub) return

  const { data, error } = await supabase
    .from('profiles')
    .select('avatar_url')
    .eq('id', user.value.sub)
    .single()

  if (error) {
    console.error('Error loading profile:', error)
    return
  }
  avatarUrl.value = data?.avatar_url || ''
}
loadProfile();

// Загрузка аватара на сервер
const onFileChange = async (e: Event) => {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  preview.value = URL.createObjectURL(file)

  await uploadToSupabase(file)
}

const uploadToSupabase = async (file: File) => {
  if (!user.value) return

  uploading.value = true

  try {
    const fileName = `${user.value.sub}-${Date.now()}`
    const filePath = `${user.value.sub}/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      })

    if (uploadError) throw uploadError

    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath)

    const publicUrl = data.publicUrl

    await supabase
      .from('profiles')
      .update({ avatar_url: publicUrl })
      .eq('id', user.value.sub)
    loadProfile();
  } catch (error) {
    console.error('Upload error:', error)
  } finally {
    uploading.value = false
  }
}

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
            <NuxtImg v-if="avatarUrl != ''" :src="avatarUrl" width="80px" class="AppAccount__avatar-img" />
            <NuxtImg v-else src="icons/photo.svg" width="24px" class="AppAccount__icon" />
          </div>
          <input type="file" accept="image/*" ref="fileInput" class="hidden" @change="onFileChange" />
        </div>
        <p class="AppAccount__name">User</p>
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

    &:hover .AppAccount__avatar-label{
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
    width: 80px;
    height: 80px;
    background: rgba(14, 24, 43, 0.6);
    position: relative;
  }

  &__name {
    font-size: 24px;
    font-weight: 600;
  }

  &__icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
  }
}
</style>