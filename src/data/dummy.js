export const dummyEmployees = [
  { id: 'e1', name: 'Lincoln Donin', position: 'Frontend Developer', email: 'lincoln@kleerstudio.com', profileImage: 'https://i.pravatar.cc/150?img=1' },
  { id: 'e2', name: 'Cristofer Siphron', position: 'UI/UX Designer', email: 'cristofer@medley.com', profileImage: 'https://i.pravatar.cc/150?img=2' },
  { id: 'e3', name: 'Marilyn Ekstrom', position: 'Backend Developer', email: 'marilyn@kripton.com', profileImage: 'https://i.pravatar.cc/150?img=3' },
  { id: 'e4', name: 'Charlie Gouse', position: 'Project Manager', email: 'charlie@viewprofile.com', profileImage: 'https://i.pravatar.cc/150?img=4' },
  { id: 'e5', name: 'Marcus Arcond', position: 'DevOps Engineer', email: 'marcus@kleerstudio.com', profileImage: 'https://i.pravatar.cc/150?img=5' },
  { id: 'e6', name: 'Kaiya Rosser', position: 'QA Tester', email: 'kaiya@medley.com', profileImage: 'https://i.pravatar.cc/150?img=6' },
  { id: 'e7', name: 'Kadin Stanton', position: 'Full Stack Developer', email: 'kadin@medley.com', profileImage: 'https://i.pravatar.cc/150?img=7' },
  { id: 'e8', name: 'Davis Arcand', position: 'Data Analyst', email: 'davis@kripton.com', profileImage: 'https://i.pravatar.cc/150?img=8' },
];

export const dummyProjects = [
  { id: 'p1', title: 'E-Commerce Platform', description: 'Building a modern e-commerce platform with React and Node.js', logo: '🛒', startDate: '2024-01-15T09:00', endDate: '2024-06-30T18:00', assignedEmployees: ['e1', 'e2', 'e3', 'e4'] },
  { id: 'p2', title: 'Mobile Banking App', description: 'A secure mobile banking application with real-time transactions', logo: '🏦', startDate: '2024-03-01T09:00', endDate: '2024-09-30T18:00', assignedEmployees: ['e3', 'e5', 'e6', 'e7'] },
  { id: 'p3', title: 'HR Management System', description: 'Internal HR management tool for employee tracking and payroll', logo: '👥', startDate: '2024-02-01T09:00', endDate: '2024-08-31T18:00', assignedEmployees: ['e1', 'e4', 'e7', 'e8'] },
];

export const dummyTasks = [
  { id: 't1', projectId: 'p1', title: 'Design Homepage', description: 'Create the main homepage design with hero section', assignedEmployee: 'e2', eta: '2024-02-15', referenceImages: ['https://picsum.photos/seed/design-homepage/640/420', 'https://picsum.photos/seed/design-homepage-wireframe/640/420'], status: 'completed' },
  { id: 't2', projectId: 'p1', title: 'Setup Auth System', description: 'Implement JWT authentication flow', assignedEmployee: 'e3', eta: '2024-02-28', referenceImages: ['https://picsum.photos/seed/auth-system/640/420'], status: 'in_progress' },
  { id: 't3', projectId: 'p1', title: 'Product Listing Page', description: 'Build the product listing with filters and sorting', assignedEmployee: 'e1', eta: '2024-03-15', referenceImages: ['https://picsum.photos/seed/product-listing/640/420'], status: 'todo' },
  { id: 't4', projectId: 'p1', title: 'Shopping Cart', description: 'Implement shopping cart functionality', assignedEmployee: 'e1', eta: '2024-04-01', referenceImages: ['https://picsum.photos/seed/shopping-cart/640/420'], status: 'todo' },
  { id: 't5', projectId: 'p2', title: 'API Integration', description: 'Connect to banking APIs for transaction processing', assignedEmployee: 'e3', eta: '2024-04-15', referenceImages: ['https://picsum.photos/seed/mobile-banking-api/640/420'], status: 'in_progress' },
  { id: 't6', projectId: 'p2', title: 'Security Audit', description: 'Run security audit on all endpoints', assignedEmployee: 'e6', eta: '2024-05-01', referenceImages: ['https://picsum.photos/seed/security-audit/640/420'], status: 'testing' },
  { id: 't7', projectId: 'p2', title: 'Push Notifications', description: 'Implement push notification system', assignedEmployee: 'e7', eta: '2024-05-15', referenceImages: ['https://picsum.photos/seed/push-notifications/640/420'], status: 'todo' },
  { id: 't8', projectId: 'p3', title: 'Employee Database', description: 'Set up employee database schema and CRUD', assignedEmployee: 'e7', eta: '2024-03-15', referenceImages: ['https://picsum.photos/seed/employee-database/640/420'], status: 'completed' },
  { id: 't9', projectId: 'p3', title: 'Payroll Module', description: 'Build payroll calculation module', assignedEmployee: 'e8', eta: '2024-04-30', referenceImages: ['https://picsum.photos/seed/payroll-module/640/420'], status: 'reopen' },
  { id: 't10', projectId: 'p3', title: 'Leave Management', description: 'Implement leave request and approval workflow', assignedEmployee: 'e1', eta: '2024-05-15', referenceImages: ['https://picsum.photos/seed/leave-management/640/420'], status: 'in_progress' },
];
