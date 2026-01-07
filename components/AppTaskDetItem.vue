<script lang="ts" setup>
import { deleteTaskItem } from "#imports";
import { useTaskStore } from '~/store/tasks';
import type { TaskItem } from "~/shared/types/TaskItem";

const props = defineProps(['taskItem', 'taskId']);
const emits = defineEmits(['onDragStart']);

const supabase = useSupabaseClient();

const taskStore = useTaskStore();
const deleteItem = async (id: number, status: string) => {
    const { error } = await deleteTaskItem(id);

    if (error) {
        console.error(error);
        return;
    }

    taskStore.deleteTaskItem(status, id);
};

const moveToArchive = async (taskItem: TaskItem) => {
    const response = await supabase
        .from('tasks')
        .update({ status: 'archive' })
        .eq('id', taskItem.id)
    if (response.error) {
        console.error(response.error)
    } else {
        taskStore.updateTaskItem(taskItem, 'archive');
    }
}

// manager name
const managerName = ref('');

const loadManagerName = async () => {
    const { data, error } = await supabase
        .from('profiles')
        .select()
        .eq('id', props.taskItem.manager_id)
        .single()

    if (error) {
        console.error('Error loading profile:', error)
        return
    }
    managerName.value = data.username;
}
loadManagerName()

</script>
<template>
    <NuxtLink :to="{ name: 'projects-id', params: { id: taskItem.id } }">
        <div draggable="true" @dragstart="emits('onDragStart', $event, taskItem)" class="AppTaskItem__content">
            <NuxtImg src="icons/plus.svg" width="20px" height="20px" class="AppTaskItem__del"
                @click="deleteItem(taskItem.id, taskId)" />
            <p class="AppTaskItem__name">{{ taskItem.task_name }}</p>
            <p class="AppTaskItem__price">{{ taskItem.price }} руб.</p>
            <p class="AppTaskItem__company">{{ taskItem.company }}</p>
            <p class="AppTaskItem__price">Исполнитель: {{ managerName }}</p>
            <p v-if="taskId === 'for-shipment'" class="AppTaskItem__archive" @click="moveToArchive(taskItem)">В архив
            </p>
        </div>
    </NuxtLink>
</template>