import { useEffect, useState } from 'react';
import { Plus, Search, Edit2, Trash2, Calendar, Users, Eye } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useApp } from '@/context/AppContext';
import Modal from '@/components/Modal';

const ProjectsPage = () => {
  const { projects, employees, addProject, updateProject, deleteProject, tasks } = useApp();
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const navigate = useNavigate();

  const filtered = projects.filter((project) =>
    project.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="row g-3 align-items-end mb-4">
        <div className="col-12 col-lg">
          <h2 className="h3 fw-bold mb-1">Projects</h2>
          <p className="text-secondary mb-0">{projects.length} active projects</p>
        </div>
        <div className="col-12 col-lg-auto">
          <button
            type="button"
            className="btn btn-primary w-100"
            onClick={() => {
              setEditing(null);
              setModalOpen(true);
            }}
          >
            <span className="d-inline-flex align-items-center gap-2">
              <Plus size={16} />
              <span>New Project</span>
            </span>
          </button>
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-12 col-md-6 col-xl-4">
          <label className="form-label fw-semibold">Search projects</label>
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0">
              <Search size={16} />
            </span>
            <input
              type="text"
              className="form-control border-start-0"
              placeholder="Search projects..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="row g-4">
        {filtered.map((project) => {
          const taskCount = tasks.filter((task) => task.projectId === project.id).length;
          const assignedEmployees = employees.filter((employee) => project.assignedEmployees.includes(employee.id));

          return (
            <div className="col-12 col-sm-6 col-xl-4" key={project.id}>
              <div className="card entity-card border-0 h-100">
                <div className="card-body p-4">
                  <div className="d-flex flex-column flex-sm-row justify-content-between gap-3 mb-3">
                    <div className="d-flex align-items-center gap-3 min-w-0">
                      <div className="project-logo">{project.logo}</div>
                      <h3 className="h5 fw-bold mb-0 text-break">{project.title}</h3>
                    </div>
                    <div className="d-flex justify-content-end gap-2">
                      <button type="button" className="btn btn-light btn-sm btn-icon" onClick={() => navigate(`/projects/${project.id}`)}>
                        <Eye size={16} />
                      </button>
                      <button
                        type="button"
                        className="btn btn-light btn-sm btn-icon"
                        onClick={() => {
                          setEditing(project);
                          setModalOpen(true);
                        }}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button type="button" className="btn btn-light btn-sm btn-icon text-danger" onClick={() => setDeleteConfirm(project.id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <p className="text-secondary description-clamp mb-3">{project.description}</p>

                  <div className="d-flex flex-column gap-2 mb-3 text-secondary small">
                    <div className="d-flex align-items-center gap-2">
                      <Calendar size={16} />
                      <span>{format(new Date(project.startDate), 'MMM dd, yyyy')}</span>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <Users size={16} />
                      <span>{assignedEmployees.length} members</span>
                    </div>
                    <div className="fw-semibold text-primary">{taskCount} tasks</div>
                  </div>

                  <div className="avatar-stack mt-3">
                    {assignedEmployees.slice(0, 4).map((employee) => (
                      <img key={employee.id} src={employee.profileImage} alt={employee.name} title={employee.name} />
                    ))}
                    {assignedEmployees.length > 4 && (
                      <span className="avatar-more">+{assignedEmployees.length - 4}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {modalOpen && (
        <ProjectFormModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          project={editing}
          employees={employees}
          projectTasks={tasks.filter((task) => task.projectId === editing?.id)}
          onSave={(data) => {
            if (editing) updateProject({ ...editing, ...data });
            else addProject(data);
            setModalOpen(false);
          }}
        />
      )}

      {deleteConfirm && (
        <Modal open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Delete Project" size="sm">
          <p className="text-secondary mb-4">This will also delete all associated tasks. Continue?</p>
          <div className="d-flex flex-column-reverse flex-sm-row justify-content-end gap-2">
            <button type="button" className="btn btn-light" onClick={() => setDeleteConfirm(null)}>
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => {
                deleteProject(deleteConfirm);
                setDeleteConfirm(null);
              }}
            >
              Delete
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

const ProjectFormModal = ({ open, onClose, project, employees, projectTasks = [], onSave }) => {
  const lockedEmployeeIds = Array.from(new Set(projectTasks.map((task) => task.assignedEmployee)));
  const schema = yup.object({
    title: yup.string().trim().required('Title is required').max(100),
    description: yup.string().trim().required('Description is required').max(500),
    logo: yup.string().trim().required('Logo is required'),
    startDate: yup.string().required('Start date is required'),
    endDate: yup
      .string()
      .required('End date is required')
      .test('end-after-start', 'Start date must be before end date', function validate(value) {
        const { startDate } = this.parent;

        if (!startDate || !value) {
          return true;
        }

        return new Date(startDate) < new Date(value);
      }),
    assignedEmployees: yup
      .array()
      .of(yup.string().required())
      .min(1, 'Assign at least one employee')
      .test(
        'keeps-task-assignees',
        'Reassign or remove active tasks before unassigning those employees',
        (value = []) => lockedEmployeeIds.every((employeeId) => value.includes(employeeId)),
      ),
  });

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: project ? {
      title: project.title,
      description: project.description,
      logo: project.logo,
      startDate: project.startDate,
      endDate: project.endDate,
      assignedEmployees: project.assignedEmployees,
    } : {
      title: '',
      description: '',
      logo: '📁',
      startDate: '',
      endDate: '',
      assignedEmployees: [],
    },
  });

  const selectedEmployees = watch('assignedEmployees') || [];

  useEffect(() => {
    register('assignedEmployees');
  }, [register]);

  const toggleEmployee = (employeeId) => {
    const nextValue = selectedEmployees.includes(employeeId)
      ? selectedEmployees.filter((id) => id !== employeeId)
      : [...selectedEmployees, employeeId];

    setValue('assignedEmployees', nextValue, { shouldValidate: true });
  };

  return (
    <Modal open={open} onClose={onClose} title={project ? 'Edit Project' : 'Create Project'} size="lg">
      <form onSubmit={handleSubmit(onSave)} className="d-grid gap-3">
        <div className="row g-3">
          <div className="col-12 col-md-8">
            <label className="form-label fw-semibold">Title *</label>
            <input type="text" className={`form-control ${errors.title ? 'is-invalid' : ''}`} placeholder="Project name" {...register('title')} />
            <div className="invalid-feedback">{errors.title?.message}</div>
          </div>
          <div className="col-12 col-md-4">
            <label className="form-label fw-semibold">Logo *</label>
            <input type="text" className={`form-control ${errors.logo ? 'is-invalid' : ''}`} placeholder="📁" {...register('logo')} />
            <div className="invalid-feedback">{errors.logo?.message}</div>
          </div>
        </div>

        <div>
          <label className="form-label fw-semibold">Description *</label>
          <textarea className={`form-control ${errors.description ? 'is-invalid' : ''}`} rows="4" placeholder="Project description" {...register('description')} />
          <div className="invalid-feedback">{errors.description?.message}</div>
        </div>

        <div className="row g-3">
          <div className="col-12 col-md-6">
            <label className="form-label fw-semibold">Start Date & Time *</label>
            <input type="datetime-local" className={`form-control ${errors.startDate ? 'is-invalid' : ''}`} {...register('startDate')} />
            <div className="invalid-feedback">{errors.startDate?.message}</div>
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label fw-semibold">End Date & Time *</label>
            <input type="datetime-local" className={`form-control ${errors.endDate ? 'is-invalid' : ''}`} {...register('endDate')} />
            <div className="invalid-feedback">{errors.endDate?.message}</div>
          </div>
        </div>

        <div>
          <div className="form-label fw-semibold">Assign Employees *</div>
          {lockedEmployeeIds.length > 0 && (
            <div className="form-text mb-2">
              Employees with active tasks stay assigned until those tasks are reassigned or deleted.
            </div>
          )}
          <div className="row g-3">
            {employees.map((employee) => {
              const selected = selectedEmployees.includes(employee.id);
              const isLocked = lockedEmployeeIds.includes(employee.id);

              return (
                <div className="col-12 col-sm-6" key={employee.id}>
                  <div className={`form-check-card ${selected ? 'is-selected' : ''}`}>
                    <div className="form-check m-0">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`employee-${employee.id}`}
                        checked={selected}
                        disabled={isLocked && selected}
                        onChange={() => toggleEmployee(employee.id)}
                      />
                      <label className="form-check-label w-100" htmlFor={`employee-${employee.id}`}>
                        <div className="d-flex align-items-center gap-3">
                          <img src={employee.profileImage} alt={employee.name} className="rounded-circle" style={{ width: '2.5rem', height: '2.5rem', objectFit: 'cover' }} />
                          <div>
                            <div className="fw-semibold">{employee.name}</div>
                            <div className="small text-secondary">{employee.position}</div>
                            {isLocked && (
                              <div className="small text-primary mt-1">Assigned to active tasks</div>
                            )}
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {errors.assignedEmployees && <div className="text-danger small mt-2">{errors.assignedEmployees.message}</div>}
        </div>

        <div className="d-flex flex-column-reverse flex-sm-row justify-content-end gap-2 pt-2">
          <button type="button" className="btn btn-light" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            {project ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ProjectsPage;
