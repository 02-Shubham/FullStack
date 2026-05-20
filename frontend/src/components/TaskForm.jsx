import { Save, X } from 'lucide-react';
import { useEffect, useState } from 'react';

const emptyForm = {
  title: '',
  description: '',
  completed: false,
};

const TaskForm = ({ initialTask, isSubmitting, onCancel, onSubmit }) => {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (initialTask) {
      setForm({
        title: initialTask.title,
        description: initialTask.description || '',
        completed: initialTask.completed,
      });
      return;
    }

    setForm(emptyForm);
  }, [initialTask]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      title: form.title.trim(),
      description: form.description.trim() || undefined,
      completed: form.completed,
    });

    if (!initialTask) {
      setForm(emptyForm);
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <label>
          <span>Title</span>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Prepare weekly report"
            required
            minLength={2}
          />
        </label>
        <label>
          <span>Description</span>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Add useful context"
            rows={3}
          />
        </label>
      </div>
      <div className="form-actions">
        <label className="checkbox-row">
          <input name="completed" type="checkbox" checked={form.completed} onChange={handleChange} />
          <span>Completed</span>
        </label>
        <div className="button-row">
          {initialTask && (
            <button type="button" className="icon-button secondary" onClick={onCancel} title="Cancel edit">
              <X size={18} />
            </button>
          )}
          <button type="submit" className="primary-button" disabled={isSubmitting}>
            <Save size={18} />
            <span>{initialTask ? 'Save task' : 'Create task'}</span>
          </button>
        </div>
      </div>
    </form>
  );
};

export default TaskForm;
