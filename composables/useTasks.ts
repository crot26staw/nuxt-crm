import { useSupabaseClient } from '#imports'
import type { TaskItem } from '~/shared/types/TaskItem'

export function useTask() {
  const supabase = useSupabaseClient()
  const tasks = ref<TaskItem[]>([]);

  async function loadTask(statusId:string) {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('status', statusId)

    if (error) console.error(error)
    else tasks.value = data
  }

  return { tasks, loadTask }
}
