import { useAuth } from "@/contexts/AuthContext";

export default function AuthDebug() {
  const { user, isAuthenticated, userId, token } = useAuth();
  
  const storedUser = localStorage.getItem('user');
  const storedToken = localStorage.getItem('token');
  
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }
  
  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-80 text-white p-4 rounded text-xs font-mono max-w-sm">
      <h4 className="font-bold mb-2">Auth Debug</h4>
      <div>AuthContext:</div>
      <div>- isAuthenticated: {isAuthenticated ? 'true' : 'false'}</div>
      <div>- user: {user ? user.name : 'null'}</div>
      <div>- userId: {userId || 'null'}</div>
      <div>- token: {token ? 'present' : 'null'}</div>
      <div className="mt-2">localStorage:</div>
      <div>- user: {storedUser ? 'exists' : 'null'}</div>
      <div>- token: {storedToken ? 'present' : 'null'}</div>
    </div>
  );
}