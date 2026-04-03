import { createContext, useCallback, useContext, useState } from 'react';
import { dummyEmployees, dummyProjects, dummyTasks } from '@/data/dummy';
import { v4 as uuidv4 } from 'uuid';

const AppContext = createContext(null);

const normalizeAssignedEmployees = (assignedEmployees = []) =>
  Array.from(new Set(assignedEmployees.filter(Boolean)));

const normalizeReferenceImages = (referenceImages = []) =>
  Array.from(new Set(referenceImages.map((item) => item.trim()).filter(Boolean)));

const normalizeTaskPayload = (task) => ({
  ...task,
  referenceImages: normalizeReferenceImages(task.referenceImages || []),
});

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};

export const AppProvider = ({ children }) => {
  const [employees, setEmployees] = useState(dummyEmployees);
  const [projects, setProjects] = useState(dummyProjects);
  const [tasks, setTasks] = useState(dummyTasks);

  const ensureProjectAssignmentsForTasks = useCallback((project) => {
    const taskAssignees = tasks
      .filter((task) => task.projectId === project.id)
      .map((task) => task.assignedEmployee);

    return {
      ...project,
      assignedEmployees: normalizeAssignedEmployees([...project.assignedEmployees, ...taskAssignees]),
    };
  }, [tasks]);

  const addEmployee = useCallback((employee) => {
    const emp = {
      ...employee,
      profileImage: employee.profileImage || `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
    };
    setEmployees((prev) => [...prev, { ...emp, id: uuidv4() }]);
  }, []);

  const updateEmployee = useCallback((emp) => {
    setEmployees((prev) => prev.map((employee) => (employee.id === emp.id ? emp : employee)));
  }, []);

  const deleteEmployee = useCallback((id) => {
    setEmployees((prev) => prev.filter((employee) => employee.id !== id));
    setProjects((prevProjects) => {
      const remainingProjects = prevProjects
        .map((project) => ({
          ...project,
          assignedEmployees: project.assignedEmployees.filter((employeeId) => employeeId !== id),
        }))
        .filter((project) => project.assignedEmployees.length > 0);

      const remainingProjectIds = new Set(remainingProjects.map((project) => project.id));
      setTasks((prevTasks) => prevTasks.filter(
        (task) => task.assignedEmployee !== id && remainingProjectIds.has(task.projectId),
      ));

      return remainingProjects;
    });
  }, []);

  const addProject = useCallback((proj) => {
    setProjects((prev) => [...prev, {
      ...proj,
      assignedEmployees: normalizeAssignedEmployees(proj.assignedEmployees),
      id: uuidv4(),
    }]);
  }, []);

  const updateProject = useCallback((proj) => {
    const normalizedProject = ensureProjectAssignmentsForTasks({
      ...proj,
      assignedEmployees: normalizeAssignedEmployees(proj.assignedEmployees),
    });

    setProjects((prev) => prev.map((project) => (project.id === proj.id ? normalizedProject : project)));
  }, [ensureProjectAssignmentsForTasks]);

  const deleteProject = useCallback((id) => {
    setProjects((prev) => prev.filter((project) => project.id !== id));
    setTasks((prev) => prev.filter((task) => task.projectId !== id));
  }, []);

  const addTask = useCallback((task) => {
    const project = projects.find((item) => item.id === task.projectId);

    if (!project || !project.assignedEmployees.includes(task.assignedEmployee)) {
      return;
    }

    setTasks((prev) => [...prev, { ...normalizeTaskPayload(task), id: uuidv4() }]);
  }, [projects]);

  const updateTask = useCallback((task) => {
    const project = projects.find((item) => item.id === task.projectId);

    if (!project || !project.assignedEmployees.includes(task.assignedEmployee)) {
      return;
    }

    setTasks((prev) => prev.map((currentTask) => (
      currentTask.id === task.id ? normalizeTaskPayload(task) : currentTask
    )));
  }, [projects]);

  const deleteTask = useCallback((id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }, []);

  const getEmployeeById = useCallback((id) => employees.find((employee) => employee.id === id), [employees]);
  const getProjectById = useCallback((id) => projects.find((project) => project.id === id), [projects]);
  const isEmailUnique = useCallback((email, excludeId) => {
    return !employees.some(
      (employee) => employee.email.toLowerCase() === email.toLowerCase() && employee.id !== excludeId,
    );
  }, [employees]);

  return (
    <AppContext.Provider value={{
      employees, projects, tasks,
      addEmployee, updateEmployee, deleteEmployee,
      addProject, updateProject, deleteProject,
      addTask, updateTask, deleteTask,
      getEmployeeById, getProjectById, isEmailUnique,
    }}>
      {children}
    </AppContext.Provider>
  );
};
