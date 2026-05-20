import { LogOut, RefreshCcw, Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import {
  createTaskRequest,
  deleteTaskRequest,
  listAllTasksRequest,
  listTasksRequest,
  updateTaskRequest,
} from '../api/tasks.js';
import { getApiErrorMessage } from '../api/error.js';
import EmptyState from '../components/EmptyState.jsx';
import TaskForm from '../components/TaskForm.jsx';
import TaskItem from '../components/TaskItem.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const defaultFilters = {
  search: '',
  completed: '',
};

const Dashboard = () => {
  const { logout, user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [filters, setFilters] = useState(defaultFilters);
  const [viewMode, setViewMode] = useState('mine');
  const [editingTask, setEditingTask] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAdmin = user?.role === 'ADMIN';
  const canUseAdminView = isAdmin && viewMode === 'all';

  const queryParams = useMemo(() => {
    const params = {
      page: pagination.page,
      limit: pagination.limit,
    };

    if (filters.completed) {
      params.completed = filters.completed;
    }

    if (filters.search.trim()) {
      params.search = filters.search.trim();
    }

    return params;
  }, [filters, pagination.limit, pagination.page]);

  const loadTasks = async () => {
    setIsLoading(true);

    try {
      const data = canUseAdminView ? await listAllTasksRequest(queryParams) : await listTasksRequest(queryParams);
      setTasks(data.tasks);
      setPagination(data.pagination);
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Unable to load tasks'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [canUseAdminView, queryParams]);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setPagination((current) => ({ ...current, page: 1 }));
    setFilters((current) => ({ ...current, [name]: value }));
  };

  const handleSubmitTask = async (payload) => {
    setIsSubmitting(true);

    try {
      if (editingTask) {
        await updateTaskRequest(editingTask.id, payload);
        toast.success('Task updated');
      } else {
        await createTaskRequest(payload);
        toast.success('Task created');
      }

      setEditingTask(null);
      await loadTasks();
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Unable to save task'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleTask = async (task) => {
    try {
      await updateTaskRequest(task.id, { completed: !task.completed });
      await loadTasks();
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Unable to update task'));
    }
  };

  const handleDeleteTask = async (taskId) => {
    const confirmed = window.confirm('Delete this task?');

    if (!confirmed) {
      return;
    }

    try {
      await deleteTaskRequest(taskId);
      toast.success('Task deleted');
      await loadTasks();
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Unable to delete task'));
    }
  };

  const changePage = (page) => {
    setPagination((current) => ({ ...current, page }));
  };

  return (
    <main className="dashboard-shell">
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">Signed in as {user?.role}</p>
          <h1>{user?.name}'s dashboard</h1>
        </div>
        <button type="button" className="secondary-button" onClick={logout}>
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </header>

      <section className="dashboard-layout">
        <aside className="task-editor">
          <h2>{editingTask ? 'Edit task' : 'New task'}</h2>
          <TaskForm
            initialTask={editingTask}
            isSubmitting={isSubmitting}
            onCancel={() => setEditingTask(null)}
            onSubmit={handleSubmitTask}
          />
        </aside>

        <section className="task-workspace">
          <div className="toolbar">
            <div className="search-box">
              <Search size={18} />
              <input
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search tasks"
              />
            </div>
            <select name="completed" value={filters.completed} onChange={handleFilterChange}>
              <option value="">All status</option>
              <option value="false">Open</option>
              <option value="true">Completed</option>
            </select>
            {isAdmin && (
              <div className="segmented-control">
                <button
                  type="button"
                  className={viewMode === 'mine' ? 'active' : ''}
                  onClick={() => setViewMode('mine')}
                >
                  Mine
                </button>
                <button
                  type="button"
                  className={viewMode === 'all' ? 'active' : ''}
                  onClick={() => setViewMode('all')}
                >
                  All
                </button>
              </div>
            )}
            <button type="button" className="icon-button secondary" onClick={loadTasks} title="Refresh tasks">
              <RefreshCcw size={18} />
            </button>
          </div>

          <div className="summary-row">
            <span>{pagination.total} tasks</span>
            <span>
              Page {pagination.page} of {Math.max(pagination.totalPages, 1)}
            </span>
          </div>

          {isLoading ? (
            <div className="screen-loader compact">Loading tasks...</div>
          ) : tasks.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="task-list">
              {tasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  currentUserId={user.id}
                  onDelete={handleDeleteTask}
                  onEdit={setEditingTask}
                  onToggle={handleToggleTask}
                />
              ))}
            </div>
          )}

          <div className="pagination-row">
            <button
              type="button"
              className="secondary-button"
              disabled={pagination.page <= 1}
              onClick={() => changePage(pagination.page - 1)}
            >
              Previous
            </button>
            <button
              type="button"
              className="secondary-button"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => changePage(pagination.page + 1)}
            >
              Next
            </button>
          </div>
        </section>
      </section>
    </main>
  );
};

export default Dashboard;
