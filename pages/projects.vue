<script lang="ts" setup>
import { deleteTaskItem } from "#imports";
import type { TaskItem } from "~/shared/types/TaskItem";
const supabase = useSupabaseClient();
const tasks = ref<TaskItem[]>([]);

const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('status', 'archive')
if (error) {
  console.error(error);
} else {
  tasks.value = data;
}

const deleteItem = async (id:number) =>{
    const { error } = await deleteTaskItem(id);

  if (error) {
    console.error(error);
    return;
  }

  tasks.value = tasks.value.filter(item => item.id !== id);
}
</script>
<template>
    <div class="AppProjects">
        <h1 class="title">Выполненные проекты</h1>
        <div class="AppProjects__wrapper">
            <ul class="AppProjects__items">
                <li v-for="taskItem in tasks" :key="taskItem.id" class="AppProjects__item">
                    <p class="AppProjects__name">{{ taskItem.task_name }}</p>
                    <p class="AppProjects__price">{{ taskItem.price }} руб.</p>
                    <p class="AppProjects__company">{{ taskItem.company }}</p>
                    <div class="AppProjects__close" @click="deleteItem(taskItem.id)">
                        <NuxtImg src="icons/plus.svg" width="40px"/>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>
<style lang="scss">
.AppProjects {
    &__wrapper {
        margin-top: 22px;
    }
    &__items{
        display: flex;
        flex-direction: column;
    }
    &__item{
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 60px;
        padding: 16px 0;
        border-bottom: 1px solid #0e182b;

        &:last-child{
            border: none;
        }
    }
    &__name{
        width: 50%;
        font-size: 36px;
        font-weight: 600;
    }
    &__price{
        width: 25%;
        font-size: 20px;
        font-weight: 600;
    }
    &__company{
        width: 25%;
        font-size: 30px;
        font-weight: 600;
    }
    &__close{
        transform: rotate(45deg);
        cursor: pointer;
    }
}
</style>