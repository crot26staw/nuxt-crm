export default defineNuxtRouteMiddleware(async (to) => {
  const supabase = useSupabaseClient()
  const userRef = useSupabaseUser()

  if (userRef.value) {
    if (to.path.startsWith('/login') || to.path.startsWith('/signup')) {
      return navigateTo('/')
    }
    return
  }

  const { data } = await supabase.auth.getSession()
  const user = data?.session?.user

  if (user) {
    if (to.path.startsWith('/login') || to.path.startsWith('/signup')) {
      return navigateTo('/')
    }
    return
  }

  if (!to.path.startsWith('/login') && !to.path.startsWith('/signup')) {
    return navigateTo('/signup')
  }
})
