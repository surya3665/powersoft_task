import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Users, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { useApp } from '@/context/AppContext';
import TaskReferencePreview from '@/components/TaskReferencePreview';
import { TASK_STATUS_STYLES } from '@/lib/taskStatus';
import TaskFormModal from '@/components/TaskFormModal';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProjectById, employees, tasks, addTask, updateTask, deleteTask } = useApp();
  const [taskModal, setTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const project = getProjectById(id || '');

  if (!project) {
    return (
      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-body text-center p-5">
          <h2 className="h4 fw-bold mb-2">Project not found</h2>
          <p className="text-secondary mb-0">The project you are looking for does not exist anymore.</p>
        </div>
      </div>
    );
  }

  const projectTasks = tasks.filter((task) => task.projectId === project.id);
  const assignedEmployees = employees.filter((employee) => project.assignedEmployees.includes(employee.id));

  return (
    <div>
      <button type="button" className="btn btn-link text-secondary px-0 mb-3 d-inline-flex align-items-center gap-2" onClick={() => navigate('/projects')}>
        <ArrowLeft size={16} />
        <span>Back to Projects</span>
      </button>

      <div className="card entity-card border-0 mb-4">
        <div className="card-body p-4 p-md-5">
          <div className="row g-4 align-items-center justify-content-between">
            <div className="col-12 col-xl">
              <div className="d-flex align-items-start gap-3 min-w-0">
                <div className="project-logo">{project.logo}</div>
                <div className="min-w-0">
                  <h2 className="h3 fw-bold mb-2 text-break">{project.title}</h2>
                  <p className="text-secondary mb-0 text-break">{project.description}</p>
                </div>
              </div>
            </div>
            <div className="col-12 col-xl-auto">
              <button
                type="button"
                className="btn btn-primary w-100"
                onClick={() => {
                  setEditingTask(null);
                  setTaskModal(true);
                }}
              >
                <span className="d-inline-flex align-items-center gap-2">
                  <Plus size={16} />
                  <span>Add Task</span>
                </span>
              </button>
            </div>
          </div>

          <div className="d-flex flex-column flex-md-row flex-wrap gap-3 gap-md-4 mt-4 text-secondary">
            <div className="d-flex align-items-center gap-2">
              <Calendar size={16} />
              <span>{format(new Date(project.startDate), 'MMM dd, yyyy')} - {format(new Date(project.endDate), 'MMM dd, yyyy')}</span>
            </div>
            <div className="d-flex align-items-center gap-2">
              <Users size={16} />
              <span>{assignedEmployees.length} members</span>
            </div>
          </div>

          <div className="avatar-stack mt-4">
            {assignedEmployees.map((employee) => (
              <img key={employee.id} src={employee.profileImage} alt={employee.name} title={employee.name} />
            ))}
          </div>
        </div>
      </div>

      <h3 className="h4 fw-bold mb-3">Tasks ({projectTasks.length})</h3>
      <div className="d-grid gap-3">
        {projectTasks.map((task) => {
          const employee = employees.find((item) => item.id === task.assignedEmployee);
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
                        {employee?.name} · ETA: {format(new Date(task.eta), 'MMM dd, yyyy')}
                      </div>
                    </div>
                  </div>

                  <div className="d-flex flex-wrap align-items-center gap-2">
                    <span className={`status-badge ${statusStyle.className}`}>{statusStyle.label}</span>
                    <button
                      type="button"
                      className="btn btn-light btn-sm"
                      onClick={() => {
                        setEditingTask(task);
                        setTaskModal(true);
                      }}
                    >
                      Edit
                    </button>
                    <button type="button" className="btn btn-light btn-sm text-danger" onClick={() => deleteTask(task.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {projectTasks.length === 0 && (
          <div className="card surface-card border-0">
            <div className="card-body text-center py-5">
              <p className="text-secondary mb-0">No tasks yet. Click "Add Task" to create one.</p>
            </div>
          </div>
        )}
      </div>

      {taskModal && (
        <TaskFormModal
          open={taskModal}
          onClose={() => setTaskModal(false)}
          task={editingTask}
          projects={[project]}
          employees={assignedEmployees}
          initialProjectId={project.id}
          lockProject
          onSave={(data) => {
            if (editingTask) updateTask({ ...editingTask, ...data });
            else addTask(data);
            setTaskModal(false);
          }}
        />
      )}
    </div>
  );
};

export default ProjectDetail;
