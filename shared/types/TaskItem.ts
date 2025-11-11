
export interface TaskItem {
    id: number,
    task_name: string,
    company: string,
    price: number,
    status: string
}

export interface Task {
    id: string,
    name: string,
    items: TaskItem[]
}