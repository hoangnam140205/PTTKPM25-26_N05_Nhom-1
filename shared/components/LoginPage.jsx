import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Mail, Lock, User } from 'lucide-react';

export default function LoginPage() {
    const navigate = useNavigate();
    const [isSignup, setIsSignup] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLogin = (e) => {
        e.preventDefault();
        // Mock Login Logic
        const users = JSON.parse(localStorage.getItem('restaurantUsers') || '[]');
        const user = users.find(u => u.email === formData.email && u.password === formData.password);

        if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            toast.success(`Welcome back, ${user.name}!`);
            if (user.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/'); // Redirect to customer dashboard
            }
        } else {
            toast.error('Invalid email or password');
        }
    };

    const handleSignup = (e) => {
        e.preventDefault();
        if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        // Mock Signup Logic
        const users = JSON.parse(localStorage.getItem('restaurantUsers') || '[]');
        const userExists = users.some(u => u.email === formData.email);

        if (userExists) {
            toast.error('Email already exists');
        } else {
            const newUser = {
                id: Date.now(),
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: 'customer'
            };
            users.push(newUser);
            localStorage.setItem('restaurantUsers', JSON.stringify(users));
            localStorage.setItem('currentUser', JSON.stringify(newUser));
            toast.success('Account created successfully! Welcome to Symphony.');
            navigate('/');
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundImage: "url('/images/bg-1.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            padding: '2rem'
        }}>
            <div className="glass-panel" style={{ width: '100%', maxWidth: '800px', padding: '2.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{
                            width: '60px', height: '60px',
                            background: 'linear-gradient(135deg, var(--primary-color), #fcd34d)',
                            borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            marginBottom: '1rem'
                        }}>
                            <span style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--bg-dark)' }}>S</span>
                        </div>
                        <h1 className="heading-2" style={{ margin: 0 }}>
                            {isSignup ? 'Create Account' : 'Welcome Back'}
                        </h1>
                        <p className="text-muted">{isSignup ? 'Join Symphony' : 'Login to your account'}</p>
                    </div>
                </div>

                <form onSubmit={isSignup ? handleSignup : handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {isSignup && (
                        <div className="form-group">
                            <div style={{ position: 'relative' }}>
                                <User size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Full Name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    style={{ paddingLeft: '3rem' }}
                                />
                            </div>
                        </div>
                    )}

                    <div className="form-group">
                        <div style={{ position: 'relative' }}>
                            <Mail size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                style={{ paddingLeft: '3rem' }}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <div style={{ position: 'relative' }}>
                            <Lock size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                style={{ paddingLeft: '3rem' }}
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn-primary" style={{ padding: '1rem', fontSize: '1.1rem' }}>
                        {isSignup ? 'Create Account' : 'Login'}
                    </button>
                </form>

                <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                    <button
                        onClick={() => setIsSignup(!isSignup)}
                        className="btn-link"
                        style={{ fontSize: '0.95rem' }}
                    >
                        {isSignup ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
                    </button>
                </div>
            </div>
        </div>
    );
}
