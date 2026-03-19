export const useDeleteTaskItem = async (id: number) => {
  const supabase = useSupabaseClient();
  return await supabase
    .from('tasks')
    .delete()
    .eq('id', id);
}
