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
        {
            id: "archive",
            name: "Архив",
            items: []
        },
    ]);
    const supabase = useSupabaseClient();
    const user = useSupabaseUser();

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

    const getNoArchiveTasks = () => {
        return tasks.value.filter(task => task.id != 'archive');
    }

    const getArchiveTasks = () => {
        return tasks.value.find(task => task.id === 'archive');
    }

    const addTaskItem = (taskItem: TaskItem) => {
        tasks.value.find(task => {
            if (task.id === taskItem.status) {
                task.items.push(taskItem)
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

    const updateTaskItem = (taskItem: TaskItem, status: string) => {
        tasks.value.forEach(task => {
            if (!Array.isArray(task.items)) return;

            const idx = task.items.findIndex(item => item.id === taskItem.id);
            if (idx !== -1) {
                task.items.splice(idx, 1);
            }
        });
        if (status != 'archive') {
            tasks.value.find(task => {
                if (task.id === status) {
                    task.items.push(taskItem);
                }
            })
        }
    }

    watch(
        () => user.value,
        (newUser) => {
            if (newUser?.sub) {
                getTaskItems();
            }
        },
        { immediate: true }
    );

    return {
        tasks,
        getTaskItems,
        getNoArchiveTasks,
        getArchiveTasks,
        addTaskItem,
        deleteTaskItem,
        updateTaskItem
    }
})