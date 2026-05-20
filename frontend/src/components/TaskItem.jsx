import { Check, Clock, Edit3, Trash2 } from 'lucide-react';

const TaskItem = ({ task, currentUserId, onDelete, onEdit, onToggle }) => {
  const canManage = task.userId === currentUserId;

  return (
    <article className={`task-item ${task.completed ? 'is-complete' : ''}`}>
      <button
        className="status-toggle"
        type="button"
        onClick={() => canManage && onToggle(task)}
        disabled={!canManage}
        title={task.completed ? 'Mark incomplete' : 'Mark complete'}
      >
        {task.completed ? <Check size={18} /> : <Clock size={18} />}
      </button>
      <div className="task-content">
        <div className="task-heading">
          <h3>{task.title}</h3>
          <span>{task.completed ? 'Done' : 'Open'}</span>
        </div>
        {task.description && <p>{task.description}</p>}
        {task.user && (
          <small>
            Owner: {task.user.name} ({task.user.email})
          </small>
        )}
      </div>
      {canManage && (
        <div className="task-actions">
          <button type="button" className="icon-button secondary" onClick={() => onEdit(task)} title="Edit task">
            <Edit3 size={18} />
          </button>
          <button type="button" className="icon-button danger" onClick={() => onDelete(task.id)} title="Delete task">
            <Trash2 size={18} />
          </button>
        </div>
      )}
    </article>
  );
};

export default TaskItem;
