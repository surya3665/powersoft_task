import { useState } from 'react';
import { Search, Edit2, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { useApp } from '@/context/AppContext';
import TaskReferencePreview from '@/components/TaskReferencePreview';
import { TASK_STATUS_STYLES } from '@/lib/taskStatus';
import TaskFormModal from '@/components/TaskFormModal';

const TasksPage = () => {
  const { tasks, projects, employees, updateTask, deleteTask, addTask } = useApp();
  const [search, setSearch] = useState('');
  const [projectFilter, setProjectFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const filtered = tasks.filter((task) => {
    const matchSearch = task.title.toLowerCase().includes(search.toLowerCase());
    const matchProject = !projectFilter || task.projectId === projectFilter;
    return matchSearch && matchProject;
  });

  const openCreate = () => {
    if (projects.length === 0) return;
    setEditingTask(null);
    setModalOpen(true);
  };

  return (
    <div>
      <div className="row g-3 align-items-end mb-4">
        <div className="col-12 col-lg">
          <h2 className="h3 fw-bold mb-1">Tasks</h2>
          <p className="text-secondary mb-0">{tasks.length} total tasks</p>
        </div>
        <div className="col-12 col-lg-auto">
          <button type="button" className="btn btn-primary w-100" onClick={openCreate} disabled={projects.length === 0}>
            + New Task
          </button>
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-12 col-lg">
          <label className="form-label fw-semibold">Search tasks</label>
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0">
              <Search size={16} />
            </span>
            <input
              type="text"
              className="form-control border-start-0"
              placeholder="Search tasks..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        </div>
        <div className="col-12 col-lg-auto" style={{ minWidth: 220 }}>
          <label className="form-label fw-semibold">Project</label>
          <select className="form-select" value={projectFilter} onChange={(event) => setProjectFilter(event.target.value)}>
            <option value="">All Projects</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="d-grid gap-3">
        {filtered.map((task) => {
          const employee = employees.find((item) => item.id === task.assignedEmployee);
          const project = projects.find((item) => item.id === task.projectId);
          const statusStyle = TASK_STATUS_STYLES[task.status];

          return (
            <div key={task.id} className="card surface-card border-0">
              <div className="card-body p-3 p-md-4">
                <div className="d-flex flex-column flex-md-row justify-content-between gap-3">
                  <div className="d-flex align-items-center gap-3 min-w-0">
                    <TaskReferencePreview images={task.referenceImages} alt={task.title} />
                    {employee && <img src={employee.profileImage} alt={employee.name} className="task-avatar" />}
                    <div className="min-w-0">
                      <div className="fw-semibold text-break">{task.title}</div>
                      <div className="small text-secondary text-break">
                        {project?.title} · {employee?.name} · ETA: {format(new Date(task.eta), 'MMM dd')}
                      </div>
                    </div>
                  </div>

                  <div className="d-flex flex-wrap align-items-center gap-2">
                    <span className={`status-badge ${statusStyle.className}`}>{statusStyle.label}</span>
                    <button
                      type="button"
                      className="btn btn-light btn-sm btn-icon"
                      onClick={() => {
                        setEditingTask(task);
                        setModalOpen(true);
                      }}
                    >
                      <Edit2 size={16} />
                    </button>
                    <button type="button" className="btn btn-light btn-sm btn-icon text-danger" onClick={() => deleteTask(task.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {modalOpen && projects.length > 0 && (
        <TaskFormModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          task={editingTask}
          projects={projects}
          employees={employees}
          initialProjectId={editingTask?.projectId || projectFilter || projects[0]?.id || ''}
          onSave={(data) => {
            if (editingTask) updateTask({ ...editingTask, ...data });
            else addTask(data);
            setModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default TasksPage;
