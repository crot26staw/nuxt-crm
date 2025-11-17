<script lang="ts" setup>
import { useTaskStore } from '~/store/tasks';
import type { Task } from '~/shared/types/TaskItem';

const taskStore = useTaskStore();
taskStore.getTaskItems();

const taskItems = ref<Task[]>(taskStore.tasks);

const taskStatusForModal = ref({
    id: "inbox",
    name: "Входящие",
});
const changeStatusForModal = (object: Task) => {
    taskStatusForModal.value = object;
}

const isModalActive = ref(false);
const changeModalActive = () => {
    isModalActive.value = !isModalActive.value;
}

</script>
<template>
    <div class="AppHome">
        <h1 class="title">Планировка задач</h1>
        <div class="AppHome__wrapper">
            <AppTaskItem v-for="item in taskItems" :key="item.id" :task="item" @change-modal="changeModalActive"
                @change-status="changeStatusForModal" />
        </div>
        <AppTaskModal v-if="isModalActive" @change-modal="changeModalActive" :status="taskStatusForModal" />
    </div>
</template>

<style lang="scss">
.AppHome {
    height: 100%;
    &__wrapper {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        grid-template-rows: 1fr;
        grid-column-gap: 20px;
        grid-row-gap: 0px;
        margin-top: 22px;
        height: 100%;
    }
}
</style>