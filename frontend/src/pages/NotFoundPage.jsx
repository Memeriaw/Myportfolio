export default function NotFoundPage() {
  return (
    <div className="page-shell centered-shell">
      <div className="auth-card error-card">
        <h1>404</h1>
        <p>The page you are looking for doesn’t exist.</p>
        <a href="/" className="button primary">Back Home</a>
      </div>
    </div>
  );
}
