<script lang="ts" setup>
import type { TaskItem } from "~/shared/types/TaskItem";
const route = useRoute()
const taskId = route.params.id
const supabase = useSupabaseClient();

const task = ref<TaskItem | null>(null);
const isError = ref(false);

const getTask = async () => {
    const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', taskId)
        .single()

    if (error) {
        isError.value = true;
        task.value = null;
    } else {
        task.value = data;
    }
}

await getTask();
</script>
<template>
    <p v-if="isError">Ошибка!</p>
    <div v-else class="AppTask">
        <div class="AppTask__titles">
            <h1 class="AppTask__title title">{{ task?.task_name }}</h1>
            <p class="AppTask__subtitle">{{ task?.company }}</p>
        </div>
        
    </div>
</template>
<style lang="scss">
    .AppTask{
        &__titles{
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
    }

</style>