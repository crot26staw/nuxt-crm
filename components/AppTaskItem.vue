<script lang="ts" setup>
import { useTask } from '~/composables/useTasks'
const { tasks, loadTask } = useTask()

const props = defineProps(['taskHead']);
const emit = defineEmits(['change-modal','change-status']);

const emitChangeModal = () =>{
    emit('change-status', props.taskHead);
    emit('change-modal');
}

loadTask(props.taskHead.id)

</script>
<template>
    <div :id="taskHead.id" class="AppTaskItem">
        <p class="AppTaskItem__title">{{ taskHead.name }}</p>
        <button class="AppTaskItem__btn" @click="emitChangeModal">
            <NuxtImg src="icons/plus.svg" width="40px" />
        </button>
        <div v-for="task in tasks" class="AppTaskItem__content">
            <p class="AppTaskItem__name">{{ task.task_name }}</p>
            <p class="AppTaskItem__price">{{ task.price }} руб.</p>
            <p class="AppTaskItem__company">{{ task.company }}</p>
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

    &__content{
        padding: 8px;
        border: 1px solid #0e182b;
        border-radius: 8px;
        margin-top: 20px;
        cursor: grab;
    }

    &__name{
        font-size: 24px;
        font-weight: 600;
    }
    &__price{
        margin-top: 4px;
        font-size: 18px;
    }
    &__company{
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