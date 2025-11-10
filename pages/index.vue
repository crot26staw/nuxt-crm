<script lang="ts" setup>
import type { TaskHead } from '~/shared/types/TaskItem';
const taskItems = [
    {
        id: "inbox",
        name: "Входящие",
    },
    {
        id: "by-agreement",
        name: "На согласовании",
    },
    {
        id: "in-production",
        name: "В производстве",
    },
    {
        id: "produced",
        name: "Произведено",
    },
    {
        id: "for-shipment",
        name: "К отгрузке",
    },
] as TaskHead[];

const taskStatusForModal = ref({
    id: "inbox",
    name: "Входящие",
});
const changeStatusForModal = (object: TaskHead) =>{
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
            <AppTaskItem v-for="item in taskItems" :key="item.id" :taskHead="item" @change-modal="changeModalActive" @change-status="changeStatusForModal"/>
        </div>
        <AppTaskModal v-if="isModalActive" @change-modal="changeModalActive" :status="taskStatusForModal"/>
    </div>
</template>

<style lang="scss">
.AppHome {
    &__wrapper {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        grid-template-rows: 1fr;
        grid-column-gap: 20px;
        grid-row-gap: 0px;
        margin-top: 22px;
    }
}
</style>