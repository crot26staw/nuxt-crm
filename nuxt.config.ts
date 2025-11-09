
import tailwindcss from '@tailwindcss/vite'
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  modules: ['@nuxtjs/supabase', 'shadcn-nuxt', '@vueuse/nuxt', '@vee-validate/nuxt', '@nuxt/image'],
  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_SECRET_KEY,
    redirect: false,
  },
  shadcn: {
    prefix: 'Ui',
    componentDir: './components/ui'
  },
  css: ['~/assets/css/tailwind.css','~/assets/css/main.css'],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
})