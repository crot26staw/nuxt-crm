<script lang="ts" setup>
import { useSupabaseClient } from "#imports";
import { useTaskStore } from '~/store/tasks';
import type { TaskItem } from "~/shared/types/TaskItem";
import { deleteTaskItem } from "#imports";

const supabase = useSupabaseClient();

const taskStore = useTaskStore();


const props = defineProps(['task']);
const emit = defineEmits(['change-modal', 'change-status']);

const emitChangeModal = () => {
    emit('change-status', props.task);
    emit('change-modal');
}

const deleteItem = async (id: number, status: string) => {
    const { error } = await deleteTaskItem(id);

    if (error) {
        console.error(error);
        return;
    }

    taskStore.deleteTaskItem(status, id);
};

// drag and drop
const isDrag = ref(false);

const onDragStart = (e: DragEvent, taskItem: any) => {
    if (!e.dataTransfer) return;
    e.dataTransfer.setData('task', JSON.stringify(taskItem));
}

const onDrop = (e: DragEvent, taskId: string) => {
    e.preventDefault();
    isDrag.value = false;
    if (!e.dataTransfer) return;
    const droppedData = e.dataTransfer.getData('task');
    const droppedTask = JSON.parse(droppedData);
    updateTaskItem(droppedTask, taskId);
}

const onDragOver = (e: DragEvent) => {
    e.preventDefault();
    isDrag.value = true;
}

const onDragLeave = (e: DragEvent) => {
    e.preventDefault();
    isDrag.value = false;
}

const updateTaskItem = async (taskItem: TaskItem, status: string) => {
    const response = await supabase
        .from('tasks')
        .update({ status: status })
        .eq('id', taskItem.id)
    if (response.error) {
        console.error(response.error)
    } else {
        taskStore.updateTaskItem(taskItem, status);
    }
}

const moveToArchive = async (taskItem: TaskItem) =>{
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

</script>
<template>
    <div :id="task.id" @drop="onDrop($event, task.id)" @dragover="onDragOver" @dragleave="onDragLeave"
        class="AppTaskItem" :class="{ 'dragover': isDrag }">
        <p class="AppTaskItem__title">{{ task.name }}</p>
        <button class="AppTaskItem__btn" @click="emitChangeModal">
            <NuxtImg src="icons/plus.svg" width="40px" />
        </button>
        <div v-for="taskItem in task.items" draggable="true" @dragstart="onDragStart($event, taskItem)"
            class="AppTaskItem__content">
            <NuxtImg src="icons/plus.svg" width="20px" height="20px" class="AppTaskItem__del"
                @click="deleteItem(taskItem.id, task.id)" />
            <p class="AppTaskItem__name">{{ taskItem.task_name }}</p>
            <p class="AppTaskItem__price">{{ taskItem.price }} руб.</p>
            <p class="AppTaskItem__company">{{ taskItem.company }}</p>
            <p v-if="task.id === 'for-shipment'" class="AppTaskItem__archive" @click="moveToArchive(taskItem)">В архив</p>
        </div>
    </div>
</template>
<style lang="scss">
.AppTaskItem {
    &__title {
        text-align: center;
        padding: 8px;
        color: white;
        font-size: 18px;

    }

    &__btn {
        margin: 0 auto;
        margin-top: 12px;
        display: block;
        cursor: pointer;
        transition: all 0.3s;

        :active {
            transform: scale(0.9);
        }
    }

    &__content {
        padding: 8px;
        border: 1px solid #0e182b;
        background: white;
        border-radius: 8px;
        margin-top: 24px;
        cursor: grab;
        position: relative;
        transition: all 0.3s;

        &:hover {
            background: rgba(14, 24, 43, 0.1);
        }
    }

    &__del {
        position: absolute;
        transform: rotate(45deg);
        right: -15px;
        top: -20px;
        cursor: pointer;
    }

    &__name {
        font-size: 24px;
        font-weight: 600;
    }

    &__price {
        margin-top: 4px;
        font-size: 18px;
    }

    &__company {
        font-size: 22px;
        font-weight: 600;
        margin-top: 8px;
    }

    &__archive{
        margin-top: 20px;
        text-align: end;
        cursor: pointer;
        font-size: 22px;
        transition: all 0.3s;
        color: green;

        &:hover{
            color: rgb(1, 168, 1);
        }
    }
}

.dragover {
    background-color: rgba(14, 24, 43, 0.1);
}

#for-shipment .AppTaskItem__title {
    background: #0e182b;
}

#produced .AppTaskItem__title {
    background: rgba(14, 24, 43, 0.8);
}

#in-production .AppTaskItem__title {
    background: rgba(14, 24, 43, 0.7);
}

#by-agreement .AppTaskItem__title {
    background: rgba(14, 24, 43, 0.6);
}

#inbox .AppTaskItem__title {
    background: rgba(14, 24, 43, 0.5);
}
</style>