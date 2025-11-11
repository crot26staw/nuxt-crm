import { defineStore } from "pinia";
import type { Task, TaskItem } from "~/shared/types/TaskItem";
import { useSupabaseClient } from "#imports";

export const useTaskStore = defineStore('tasks', () => {
    const tasks = ref<Task[]>([
        {
            id: "inbox",
            name: "Входящие",
            items: []
        },
        {
            id: "by-agreement",
            name: "На согласовании",
            items: []
        },
        {
            id: "in-production",
            name: "В разработке",
            items: []
        },
        {
            id: "produced",
            name: "Разработано",
            items: []
        },
        {
            id: "for-shipment",
            name: "В продакшн",
            items: []
        },
    ]);
    const supabase = useSupabaseClient();

    const getTaskItems = async () => {
        const { data, error } = await supabase
            .from('tasks')
            .select('*')

        if (error) console.error(error)
        else {
            tasks.value.forEach(task => {
                task.items = []
            })
            data.forEach(taskItem => {
                const targetTask = tasks.value.find(task => task.id === taskItem.status)
                if (targetTask) {
                    targetTask.items.push(taskItem)
                }
            })
        }
    }

    const addTaskItem = (task: TaskItem) => {
        tasks.value.find(taskItem => {
            if (taskItem.id === task.status) {
                taskItem.items.push(task)
            }
        })
    }

    const deleteTaskItem = (status: string, id: number) => {
        tasks.value.find(task => {
            if (task.id === status) {
                task.items.forEach((taskItem, idx) => {
                    if (taskItem.id === id) {
                        task.items.splice(idx, 1)
                    }
                })
            }
        })
    }

    return {
        tasks,
        getTaskItems,
        addTaskItem,
        deleteTaskItem
    }
})