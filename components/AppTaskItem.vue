<script lang="ts" setup>
import { useSupabaseClient } from "#imports";
import { useTaskStore } from '~/store/tasks';

const supabase = useSupabaseClient();

const taskStore = useTaskStore();

const props = defineProps(['task']);
const emit = defineEmits(['change-modal', 'change-status']);

const emitChangeModal = () => {
    emit('change-status', props.task);
    emit('change-modal');
}

const deleteTaskItem = async (id: number, status: string) => {
    const response = await supabase
        .from('tasks')
        .delete()
        .eq('id', id)
    if(response.error){
        console.error(response.error)
    } else {
        taskStore.deleteTaskItem(status, id);
    }
}

</script>
<template>
    <div :id="task.id" class="AppTaskItem">
        <p class="AppTaskItem__title">{{ task.name }}</p>
        <button class="AppTaskItem__btn" @click="emitChangeModal">
            <NuxtImg src="icons/plus.svg" width="40px" />
        </button>
        <div v-for="taskItem in task.items" draggable="true" class="AppTaskItem__content">
            <NuxtImg src="icons/plus.svg" width="20px" height="20px" class="AppTaskItem__del" @click="deleteTaskItem(taskItem.id, task.id)" />
            <p class="AppTaskItem__name">{{ taskItem.task_name }}</p>
            <p class="AppTaskItem__price">{{ taskItem.price }} руб.</p>
            <p class="AppTaskItem__company">{{ taskItem.company }}</p>
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

        &:hover{
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