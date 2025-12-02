import { defineStore } from "pinia";
import { useSupabaseClient } from "#imports";

interface dataUser {
    name: string
}

export const useDataUserStore = defineStore('dataUser', () => {
    const dataUser = ref<dataUser>({
        name: '',
    })
    const isLoading = ref(false);

    const supabase = useSupabaseClient();
    const user = useSupabaseUser();

    const getDataUser = async () => {
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
        dataUser.value.name = data?.username;
    }

    const updateDataUser = async (name: string) => {
        if (!user.value) return

        isLoading.value = true;
        try {
            const response = await supabase
                .from('profiles')
                .update({ username: name })
                .eq('id', user.value.sub)

            if(response.error){
                console.error(response.error)
                return
            }
            dataUser.value.name = name
        } catch (error) {
            console.error('Update error:', error)
        } finally {
            isLoading.value = false;
        }
    };

    const resetStore = () =>{
        dataUser.value.name = '';
    }

    watch(
        () => user.value,
        (newUser) => {
            if (newUser?.sub) {
                getDataUser();
            }
        },
        { immediate: true }
    );

    return {
        dataUser,
        isLoading,
        getDataUser,
        updateDataUser,
        resetStore
    }
});