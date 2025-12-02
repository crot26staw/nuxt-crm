<script lang="ts" setup>
import { useTaskStore } from "~/store/tasks";

const taskStore = useTaskStore();

</script>
<template>
    <div class="AppProjects">
        <h1 class="title">Выполненные проекты</h1>
        <div class="AppProjects__wrapper">
            <div class="AppProjects__items">
                <AppTaskDetItem v-for="taskItem in taskStore.getArchiveTasks()?.items" :key="taskItem.id" :taskItem="taskItem" taskId="archive" />
            </div>
        </div>
    </div>
</template>
<style lang="scss">
.AppProjects {
    &__wrapper {
        margin-top: 22px;
    }

    &__items {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        grid-column-gap: 20px;
        grid-row-gap: 20px;
    }

    &__item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 60px;
        padding: 16px 0;
        border-bottom: 1px solid #0e182b;

        &:last-child {
            border: none;
        }
    }

    &__name {
        width: 50%;
        font-size: 36px;
        font-weight: 600;
    }

    &__price {
        width: 25%;
        font-size: 20px;
        font-weight: 600;
    }

    &__company {
        width: 25%;
        font-size: 30px;
        font-weight: 600;
    }

    &__close {
        transform: rotate(45deg);
        cursor: pointer;
    }
}
</style>