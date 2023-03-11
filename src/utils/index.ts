export const matchRoles = (roles: string[], role: string) => {
  return roles.includes(role);
};

export const checkAdminRole = (role: string) => {
  return role === 'admin';
};

export const calculatePages = (totalPages: number, size: number) => {
  return Math.ceil(totalPages / (size ?? 1));
};
