export const matchRoles = (roles: string[], role: string) => {
  return roles.includes(role);
};

export const checkAdminRole = (role: string) => {
  return role === 'admin';
};
