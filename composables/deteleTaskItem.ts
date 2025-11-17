
export const deleteTaskItem = async (id: number, status: string) => {
    const supabase = useSupabaseClient();
    const response = await supabase
        .from('tasks')
        .delete()
        .eq('id', id)
    return response
}