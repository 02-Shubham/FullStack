import { ListTodo } from 'lucide-react';

const EmptyState = () => {
  return (
    <div className="empty-state">
      <ListTodo size={32} />
      <h2>No tasks found</h2>
      <p>Create a task or adjust the current filters.</p>
    </div>
  );
};

export default EmptyState;
