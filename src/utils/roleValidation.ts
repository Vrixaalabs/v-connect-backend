export function isTopAdmin(user) {
  return user.roles?.includes('TopAdmin');
}

export function isInstitutionalAdmin(user) {
  return user.roles?.includes('InstitutionalAdmin');
}

export function isDepartmentAdmin(user, department: string) {
  return user.roles?.includes(`Admin_${department}`);
}