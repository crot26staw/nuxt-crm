
export const useAvatarChange = () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  // Получаем аватар
  const avatarUrl = ref('');
  const loadProfile = async () => {
    if (!user.value?.sub) return

    const { data, error } = await supabase
      .from('profiles')
      .select()
      .eq('id', user.value.sub)
      .single()

    if (error) {
      console.error('Error loading profile:', error)
      return
    }
    avatarUrl.value = data?.avatar_url || '';
  }

  // Загрузка аватара на сервер

  const uploadToSupabase = async (file: File) => {
    if (!user.value) return

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
    }
  }

  return {
    avatarUrl,
    loadProfile,
    uploadToSupabase
  }
}