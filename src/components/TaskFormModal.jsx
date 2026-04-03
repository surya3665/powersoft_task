import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Modal from '@/components/Modal';
import { TASK_STATUSES, TASK_STATUS_LABELS } from '@/lib/taskStatus';

const splitReferenceImages = (value = '') =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

const isValidUrl = (value) => {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

const TaskFormModal = ({
  open,
  onClose,
  task,
  projects,
  employees,
  initialProjectId = '',
  lockProject = false,
  onSave,
}) => {
  const schema = useMemo(() => yup.object({
    projectId: yup
      .string()
      .required('Project is required')
      .test('project-exists', 'Select an existing project', (value) => (
        projects.some((project) => project.id === value)
      )),
    title: yup.string().trim().required('Title is required').max(100),
    description: yup.string().trim().required('Description is required').max(500),
    assignedEmployee: yup
      .string()
      .required('Assign an employee')
      .test('employee-in-project', 'Select an employee assigned to the project', function validate(value) {
        const { projectId } = this.parent;

        if (!projectId || !value) {
          return true;
        }

        const project = projects.find((item) => item.id === projectId);
        return !!project && project.assignedEmployees.includes(value);
      }),
    eta: yup.string().required('ETA is required'),
    status: yup.string().oneOf(TASK_STATUSES).required('Status is required'),
    referenceImages: yup
      .string()
      .trim()
      .required('Reference images are required')
      .test('valid-reference-images', 'Enter valid image URLs separated by commas', (value) => {
        const urls = splitReferenceImages(value);
        return urls.length > 0 && urls.every(isValidUrl);
      }),
  }), [projects]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: task ? {
      projectId: task.projectId,
      title: task.title,
      description: task.description,
      assignedEmployee: task.assignedEmployee,
      eta: task.eta,
      status: task.status,
      referenceImages: task.referenceImages?.join(', ') || '',
    } : {
      projectId: initialProjectId || projects[0]?.id || '',
      title: '',
      description: '',
      assignedEmployee: '',
      eta: '',
      status: 'todo',
      referenceImages: '',
    },
  });

  const selectedProjectId = watch('projectId');
  const selectedEmployeeId = watch('assignedEmployee');
  const selectedProject = projects.find((project) => project.id === selectedProjectId);
  const availableEmployees = employees.filter(
    (employee) => selectedProject?.assignedEmployees.includes(employee.id),
  );

  useEffect(() => {
    if (!availableEmployees.some((employee) => employee.id === selectedEmployeeId)) {
      setValue('assignedEmployee', '', { shouldValidate: true });
    }
  }, [availableEmployees, selectedEmployeeId, setValue]);

  const onSubmit = (data) => {
    onSave({
      ...data,
      referenceImages: splitReferenceImages(data.referenceImages),
    });
  };

  return (
    <Modal open={open} onClose={onClose} title={task ? 'Edit Task' : 'Create Task'}>
      <form onSubmit={handleSubmit(onSubmit)} className="d-grid gap-3">
        <div>
          <label className="form-label fw-semibold">Project *</label>
          <select
            className={`form-select ${errors.projectId ? 'is-invalid' : ''}`}
            {...register('projectId')}
            disabled={lockProject}
          >
            <option value="">Select project</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.title}
              </option>
            ))}
          </select>
          <div className="invalid-feedback">{errors.projectId?.message}</div>
        </div>

        <div>
          <label className="form-label fw-semibold">Title *</label>
          <input
            type="text"
            className={`form-control ${errors.title ? 'is-invalid' : ''}`}
            placeholder="Task title"
            {...register('title')}
          />
          <div className="invalid-feedback">{errors.title?.message}</div>
        </div>

        <div>
          <label className="form-label fw-semibold">Description *</label>
          <textarea
            className={`form-control ${errors.description ? 'is-invalid' : ''}`}
            rows="4"
            placeholder="Task description"
            {...register('description')}
          />
          <div className="invalid-feedback">{errors.description?.message}</div>
        </div>

        <div className="row g-3">
          <div className="col-12 col-md-6">
            <label className="form-label fw-semibold">Assign Employee *</label>
            <select
              className={`form-select ${errors.assignedEmployee ? 'is-invalid' : ''}`}
              {...register('assignedEmployee')}
              disabled={!selectedProjectId}
            >
              <option value="">Select employee</option>
              {availableEmployees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.name}
                </option>
              ))}
            </select>
            <div className="invalid-feedback">{errors.assignedEmployee?.message}</div>
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label fw-semibold">Status *</label>
            <select className={`form-select ${errors.status ? 'is-invalid' : ''}`} {...register('status')}>
              {TASK_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {TASK_STATUS_LABELS[status]}
                </option>
              ))}
            </select>
            <div className="invalid-feedback">{errors.status?.message}</div>
          </div>
        </div>

        <div>
          <label className="form-label fw-semibold">ETA *</label>
          <input
            type="date"
            className={`form-control ${errors.eta ? 'is-invalid' : ''}`}
            {...register('eta')}
          />
          <div className="invalid-feedback">{errors.eta?.message}</div>
        </div>

        <div>
          <label className="form-label fw-semibold">Reference Images *</label>
          <input
            type="text"
            className={`form-control ${errors.referenceImages ? 'is-invalid' : ''}`}
            placeholder="https://img1.jpg, https://img2.jpg"
            {...register('referenceImages')}
          />
          <div className="form-text">Add one or more image URLs separated by commas.</div>
          <div className="invalid-feedback">{errors.referenceImages?.message}</div>
        </div>

        <div className="d-flex flex-column-reverse flex-sm-row justify-content-end gap-2 pt-2">
          <button type="button" className="btn btn-light" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            {task ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default TaskFormModal;
