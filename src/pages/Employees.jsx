import { useState } from 'react';
import { Edit2, Mail, Plus, Search, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useApp } from '@/context/AppContext';
import Modal from '@/components/Modal';

const EmployeesPage = () => {
  const { employees, addEmployee, updateEmployee, deleteEmployee, isEmailUnique } = useApp();
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const filtered = employees.filter((employee) =>
    employee.name.toLowerCase().includes(search.toLowerCase()) ||
    employee.position.toLowerCase().includes(search.toLowerCase()) ||
    employee.email.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (employee) => {
    setEditing(employee);
    setModalOpen(true);
  };

  return (
    <div>
      <div className="row g-3 align-items-end mb-4">
        <div className="col-12 col-lg">
          <h2 className="h3 fw-bold mb-1">Employees</h2>
          <p className="text-secondary mb-0">{employees.length} team members</p>
        </div>
        <div className="col-12 col-lg-auto">
          <button type="button" className="btn btn-primary w-100" onClick={openCreate}>
            <span className="d-inline-flex align-items-center gap-2">
              <Plus size={16} />
              <span>New Employee</span>
            </span>
          </button>
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-12 col-md-6 col-xl-4">
          <label className="form-label fw-semibold">Search employees</label>
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0">
              <Search size={16} />
            </span>
            <input
              type="text"
              className="form-control border-start-0"
              placeholder="Search employees..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="row g-4">
        {filtered.map((employee) => (
          <div className="col-12 col-sm-6 col-xl-3" key={employee.id}>
            <div className="card entity-card border-0 h-100">
              <div className="card-body p-4">
                <div className="d-flex flex-column flex-sm-row justify-content-between gap-3 mb-3">
                  <div className="d-flex align-items-center gap-3 min-w-0">
                    <img src={employee.profileImage} alt={employee.name} className="employee-avatar" />
                    <div className="min-w-0">
                      <h3 className="h6 fw-bold mb-1 text-truncate">{employee.name}</h3>
                      <div className="small text-primary fw-semibold">{employee.position}</div>
                    </div>
                  </div>

                  <div className="d-flex justify-content-end gap-2">
                    <button type="button" className="btn btn-light btn-sm btn-icon" onClick={() => openEdit(employee)}>
                      <Edit2 size={16} />
                    </button>
                    <button type="button" className="btn btn-light btn-sm btn-icon text-danger" onClick={() => setDeleteConfirm(employee.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="d-flex align-items-start gap-2 min-w-0">
                  <Mail size={16} className="mt-1 flex-shrink-0" />
                  <span className="small text-secondary text-break">{employee.email}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <EmployeeFormModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          employee={editing}
          onSave={(data) => {
            if (editing) {
              updateEmployee({ ...editing, ...data });
            } else {
              addEmployee(data);
            }
            setModalOpen(false);
          }}
          isEmailUnique={isEmailUnique}
        />
      )}

      {deleteConfirm && (
        <Modal open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Delete Employee" size="sm">
          <p className="text-secondary mb-4">
            This removes the employee from assigned projects, deletes their tasks, and removes projects that no longer have any assignees.
          </p>
          <div className="d-flex flex-column-reverse flex-sm-row justify-content-end gap-2">
            <button type="button" className="btn btn-light" onClick={() => setDeleteConfirm(null)}>
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => {
                deleteEmployee(deleteConfirm);
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

const EmployeeFormModal = ({ open, onClose, employee, onSave, isEmailUnique }) => {
  const schema = yup.object({
    name: yup.string().trim().required('Name is required').max(100),
    position: yup.string().trim().required('Position is required').max(100),
    email: yup
      .string()
      .trim()
      .email('Invalid email')
      .max(255)
      .required('Email is required')
      .test('unique-email', 'Email must be unique', (value) => (
        !value || isEmailUnique(value, employee?.id)
      )),
    profileImage: yup
      .string()
      .trim()
      .required('Profile image URL is required')
      .url('Must be a valid URL'),
  });

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: employee ? {
      name: employee.name,
      position: employee.position,
      email: employee.email,
      profileImage: employee.profileImage,
    } : {
      name: '',
      position: '',
      email: '',
      profileImage: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
    },
  });

  return (
    <Modal open={open} onClose={onClose} title={employee ? 'Edit Employee' : 'Add Employee'}>
      <form onSubmit={handleSubmit(onSave)} className="d-grid gap-3">
        <div>
          <label className="form-label fw-semibold">Name *</label>
          <input type="text" className={`form-control ${errors.name ? 'is-invalid' : ''}`} placeholder="Full name" {...register('name')} />
          <div className="invalid-feedback">{errors.name?.message}</div>
        </div>

        <div>
          <label className="form-label fw-semibold">Position *</label>
          <input type="text" className={`form-control ${errors.position ? 'is-invalid' : ''}`} placeholder="Job title" {...register('position')} />
          <div className="invalid-feedback">{errors.position?.message}</div>
        </div>

        <div>
          <label className="form-label fw-semibold">Email *</label>
          <input type="email" className={`form-control ${errors.email ? 'is-invalid' : ''}`} placeholder="email@company.com" {...register('email')} />
          <div className="invalid-feedback">{errors.email?.message}</div>
        </div>

        <div>
          <label className="form-label fw-semibold">Profile Image URL *</label>
          <input type="text" className={`form-control ${errors.profileImage ? 'is-invalid' : ''}`} placeholder="https://..." {...register('profileImage')} />
          <div className="invalid-feedback">{errors.profileImage?.message}</div>
        </div>

        <div className="d-flex flex-column-reverse flex-sm-row justify-content-end gap-2 pt-2">
          <button type="button" className="btn btn-light" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            {employee ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EmployeesPage;
