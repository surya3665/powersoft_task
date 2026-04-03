import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Calendar, GripVertical } from 'lucide-react';
import { format } from 'date-fns';
import { useApp } from '@/context/AppContext';
import TaskReferencePreview from '@/components/TaskReferencePreview';
import { TASK_STATUSES, TASK_STATUS_STYLES } from '@/lib/taskStatus';

const Dashboard = () => {
  const { tasks, projects, employees, updateTask } = useApp();
  const [projectFilter, setProjectFilter] = useState('');

  const filteredTasks = projectFilter ? tasks.filter((task) => task.projectId === projectFilter) : tasks;

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const taskId = result.draggableId;
    const newStatus = result.destination.droppableId;
    const task = tasks.find((item) => item.id === taskId);

    if (task && task.status !== newStatus) {
      updateTask({ ...task, status: newStatus });
    }
  };

  return (
    <div>
      <div className="row g-3 align-items-end mb-4">
        <div className="col-12 col-lg">
          <h2 className="h3 fw-bold mb-1">Dashboard</h2>
          <p className="text-secondary mb-0">Drag and drop tasks between columns</p>
        </div>
        <div className="col-12 col-lg-auto">
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

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="board-scroller">
          <div className="board-row">
            {TASK_STATUSES.map((status) => {
              const columnTasks = filteredTasks.filter((task) => task.status === status);
              const statusStyle = TASK_STATUS_STYLES[status];

              return (
                <div key={status} className="card board-column border-0 shadow-sm overflow-hidden">
                  <div className="board-column-header" style={{ backgroundColor: statusStyle.soft }}>
                    <div className="d-flex align-items-center justify-content-between gap-2">
                      <h3 className="h6 fw-bold mb-0">{statusStyle.label}</h3>
                      <span className="badge rounded-pill text-bg-light">{columnTasks.length}</span>
                    </div>
                  </div>

                  <Droppable droppableId={status}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="board-column-body"
                        style={{ backgroundColor: snapshot.isDraggingOver ? statusStyle.soft : undefined }}
                      >
                        {columnTasks.map((task, index) => {
                          const employee = employees.find((item) => item.id === task.assignedEmployee);
                          const project = projects.find((item) => item.id === task.projectId);

                          return (
                            <Draggable key={task.id} draggableId={task.id} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  className="card task-card border-0 shadow-sm"
                                  style={{
                                    ...provided.draggableProps.style,
                                    border: snapshot.isDragging ? `1px solid ${statusStyle.accent}` : '1px solid rgba(16, 42, 67, 0.08)',
                                    boxShadow: snapshot.isDragging ? `0 18px 34px ${statusStyle.soft}` : undefined,
                                  }}
                                >
                                  <div className="card-body p-3">
                                    <TaskReferencePreview images={task.referenceImages} alt={task.title} size="card" />

                                    <div className="d-flex align-items-start gap-2">
                                      <button
                                        type="button"
                                        className="btn btn-link btn-sm text-secondary p-0 mt-1"
                                        {...provided.dragHandleProps}
                                        aria-label="Drag task"
                                      >
                                        <GripVertical size={16} />
                                      </button>

                                      <div className="min-w-0 flex-grow-1">
                                        <div className="fw-semibold task-card-title">{task.title}</div>
                                        {project && <div className="small text-primary mt-1">{project.title}</div>}

                                        {employee && (
                                          <div className="d-flex align-items-center gap-2 min-w-0 mt-3">
                                            <img src={employee.profileImage} alt={employee.name} className="task-avatar" />
                                            <span className="small text-secondary text-truncate">{employee.name}</span>
                                          </div>
                                        )}

                                        <div className="d-flex align-items-center gap-2 small text-secondary mt-2">
                                          <Calendar size={14} />
                                          <span>{format(new Date(task.eta), 'MMM dd')}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              );
            })}
          </div>
        </div>
      </DragDropContext>
    </div>
  );
};

export default Dashboard;
