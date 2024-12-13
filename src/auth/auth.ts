export function isAuthenticated(): boolean {
  return localStorage.getItem('isAuthenticated') === 'true';
}

export function signIn(): void {
  localStorage.setItem('isAuthenticated', 'true');
}

export function signOut(): void {
  localStorage.removeItem('isAuthenticated');
}
