import { CheckCircle2 } from 'lucide-react';

const AuthLayout = ({ title, subtitle, children }) => {
  return (
    <main className="auth-shell">
      <section className="auth-panel">
        <div className="auth-brand">
          <div className="brand-mark">
            <CheckCircle2 size={24} />
          </div>
          <span>TaskBoard</span>
        </div>
        <div className="auth-copy">
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
        {children}
      </section>
    </main>
  );
};

export default AuthLayout;
