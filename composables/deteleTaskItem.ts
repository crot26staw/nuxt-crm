export const deleteTaskItem = async (id: number) => {
  const supabase = useSupabaseClient();
  return await supabase
    .from('tasks')
    .delete()
    .eq('id', id);
}
