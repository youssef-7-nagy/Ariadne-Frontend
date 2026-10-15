import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner';
import './profile.css';
import './AdminPanel.css';

import { API_URL } from '../utils/apiUrl';


const API_BASE_URL = `${API_URL}`;

// ==========================================
// HELPERS
// ==========================================

const parseJson = (rawValue, fallback) => {
    try {
        return rawValue ? JSON.parse(rawValue) : fallback;
    } catch {
        return fallback;
    }
};

const readStoredUser = () => parseJson(localStorage.getItem('user'), null);

const getAvatarUrl = (gender) => {
    const normalized = (gender || '').toLowerCase();
    if (normalized === 'female') return 'https://cdn-icons-png.flaticon.com/512/3135/3135768.png';
    return 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';
};

const resolveUrl = (src) => {
    if (!src) return '';
    if (src.startsWith('http') || src.startsWith('blob:') || src.startsWith('data:')) return src;
    return `${API_BASE_URL}${src}`;
};

// ==========================================
// MY PROJECTS TAB
// ==========================================

const MyProjectsTab = ({ userName, userId }) => {
    const [projects, setProjects] = useState([]);
    const clientParam = userId || userName;
    const [isLoading, setIsLoading] = useState(() => !!clientParam);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!clientParam) return;

        const fetchProjects = async () => {
            try {
                const response = await axios.get(
                    `${API_BASE_URL}/api/portfolio/client/${encodeURIComponent(String(clientParam).trim())}`
                );
                if (response.data.success) {
                    setProjects(response.data.data || []);
                } else {
                    setProjects([]);
                }
            } catch {
                setError('Unable to load your projects. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProjects();
    }, [userName]);

    if (isLoading) {
        return (
            <div className="dashboard-card">
                <div className="card-header">
                    <h3>My Projects</h3>
                    <p>Projects we've crafted for you.</p>
                </div>
                <div className="client-projects-loading" style={{ padding: '2rem 0' }}>
                    <LoadingSpinner text="loading" />
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-card">
            <div className="card-header">
                <h3>My Projects</h3>
                <p>
                    {projects.length > 0
                        ? `${projects.length} project${projects.length !== 1 ? 's' : ''} crafted for you`
                        : 'Projects we\'ve crafted for you will appear here.'}
                </p>
            </div>

            {error && <p className="empty-text" style={{ color: '#e63946' }}>{error}</p>}

            {!error && projects.length === 0 && (
                <div className="cp-empty-state">
                    <div className="cp-empty-icon">🎬</div>
                    <h4>No Projects Yet</h4>
                    <p>
                        When we start working on a project for you, it will appear here.
                        You'll be able to track its progress and view the final result.
                    </p>
                    <Link to="/portfolio" className="btn-save" style={{ textDecoration: 'none', display: 'inline-block' }}>
                        Browse Our Portfolio
                    </Link>
                </div>
            )}

            {projects.length > 0 && (
                <div className="cp-grid">
                    {projects.map((project) => {
                        const coverMedia = project.media?.find((m) => m.isFeatured) || project.media?.[0];
                        const fallbackUrl = resolveUrl(coverMedia?.thumbnailUrl || coverMedia?.url);
                        const coverUrl = project.coverImage ? resolveUrl(project.coverImage) : fallbackUrl;

                        return (
                            <Link
                                key={project._id}
                                to={`/portfolio/project/${project.slug}`}
                                className="cp-card"
                            >
                                <div
                                    className="cp-card-thumb"
                                    style={{ backgroundImage: coverUrl ? `url(${coverUrl})` : 'none' }}
                                >
                                    {!coverUrl && <div className="cp-card-thumb-placeholder">🎞️</div>}
                                    <div className="cp-card-overlay">
                                        <span className="cp-view-label">View Project →</span>
                                    </div>
                                </div>
                                <div className="cp-card-body">
                                    {project.category?.name && (
                                        <span className="cp-category-badge">{project.category.name}</span>
                                    )}
                                    <h4 className="cp-card-title">{project.title}</h4>
                                    {project.date && (
                                        <p className="cp-card-date">
                                            {new Date(project.date).toLocaleDateString('en-GB', {
                                                month: 'long',
                                                year: 'numeric',
                                            })}
                                        </p>
                                    )}
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

// ==========================================
// BILLING TAB (My Transactions)
// ==========================================

const BillingTab = ({ userName }) => {
    const [transactions, setTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(() => !!userName);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!userName) return;

        const fetchTransactions = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(
                    `${API_BASE_URL}/transactions/client/${encodeURIComponent(userName.trim())}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                if (response.data.success) {
                    setTransactions(response.data.data || []);
                } else {
                    setTransactions([]);
                }
            } catch {
                setError('Unable to load your billing history. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchTransactions();
    }, [userName]);

    if (isLoading) {
        return (
            <div className="dashboard-card">
                <div className="card-header">
                    <h3>Billing & Transactions</h3>
                    <p>Your payment history and invoices.</p>
                </div>
                <div className="client-projects-loading" style={{ padding: '2rem 0' }}>
                    <LoadingSpinner text="loading" />
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-card">
            <div className="card-header">
                <h3>Billing & Transactions</h3>
                <p>
                    {transactions.length > 0
                        ? `You have ${transactions.length} recorded transaction${transactions.length !== 1 ? 's' : ''}.`
                        : 'Your payment history will appear here.'}
                </p>
            </div>

            {error && <p className="empty-text" style={{ color: '#e63946' }}>{error}</p>}

            {!error && transactions.length === 0 && (
                <div className="cp-empty-state">
                    <div className="cp-empty-icon">💳</div>
                    <h4>No Transactions Yet</h4>
                    <p>
                        When you make payments for services, they will be recorded here for your reference.
                    </p>
                </div>
            )}

            {transactions.length > 0 && (
                <div className="table-responsive">
                    <table className="dashboard-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Category</th>
                                <th>Project / Service</th>
                                <th>Method</th>
                                <th>Amount</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map(t => (
                                <tr key={t._id}>
                                    <td>
                                        {new Date(t.date || t.createdAt).toLocaleDateString()}
                                        <div style={{ fontSize: '0.75rem', color: 'var(--dash-text-light)' }}>
                                            {new Date(t.date || t.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </td>
                                    <td>
                                        {t.category?.name || t.categoryName ? (
                                            <span className="pill" style={{ background: '#e0e7ff', color: '#3730a3', fontWeight: 600 }}>
                                                {t.category?.name || t.categoryName}
                                            </span>
                                        ) : (
                                            <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>-</span>
                                        )}
                                    </td>
                                    <td>
                                        <div>
                                            <strong>{t.project?.title || t.projectName || t.serviceName}</strong>
                                            {t.serviceName && t.serviceName !== (t.project?.title || t.projectName) && (
                                                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{t.serviceName}</div>
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        <span className="pill" style={{ textTransform: 'uppercase', fontSize: '0.75rem' }}>
                                            {t.paymentMethod}
                                        </span>
                                    </td>
                                    <td className="price-text">{t.amount} EGP</td>
                                    <td>
                                        <span className={`badge ${t.paymentMethod === 'visa' ? 'status-success' : 'status-warning'}`}>
                                            {t.paymentMethod === 'visa' ? 'PAID' : 'COMPLETED'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

// ==========================================
// PROFILE COMPONENT (Main)
// ==========================================

const Profile = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [isLoading, setIsLoading] = useState(true);
    const [notice, setNotice] = useState('');
    const [userData, setUserData] = useState(() => readStoredUser());
    const [editForm, setEditForm] = useState({ name: '', phone: '', email: '', companyName: '' });
    const [logoFile, setLogoFile] = useState(null);
    const [logoPreview, setLogoPreview] = useState('');
    const [removeLogo, setRemoveLogo] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const userRole = (userData?.role || 'customer').toLowerCase();
    const firstName = (userData?.name || 'Client').trim().split(/\s+/)[0];
    const resolvedAvatar = resolveUrl(userData?.companyLogo || userData?.logo || userData?.avatar || userData?.photo || userData?.profilePicture);

    useEffect(() => {
        setEditForm({
            name: userData?.name || '',
            phone: userData?.phone || '',
            email: userData?.email || '',
            companyName: userData?.companyName || '',
        });
        const currentLogo = userData?.companyLogo || userData?.logo || userData?.avatar;
        if (currentLogo) {
            setLogoPreview(resolveUrl(currentLogo));
        } else {
            setLogoPreview('');
        }
        setLogoFile(null);
        setRemoveLogo(false);
    }, [userData]);

    useEffect(() => {
        const syncFromStorage = () => {
            setUserData(readStoredUser());
        };
        window.addEventListener('storage', syncFromStorage);
        window.addEventListener('auth-changed', syncFromStorage);
        return () => {
            window.removeEventListener('storage', syncFromStorage);
            window.removeEventListener('auth-changed', syncFromStorage);
        };
    }, []);

    useEffect(() => {
        let isMounted = true;

        const hydrateUser = async () => {
            const token = localStorage.getItem('token');
            const cachedUser = readStoredUser();
            const isGoogleSession = cachedUser?.provider === 'google';

            if (!token) {
                if (isMounted) {
                    setIsLoading(false);
                    navigate('/login', { replace: true });
                }
                return;
            }

            if (isGoogleSession && isMounted) {
                setUserData(cachedUser);
            }

            try {
                const response = await axios.get(`${API_BASE_URL}/api/auth/me`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!isMounted) return;

                const serverUser = response?.data?.data?.user;
                if (serverUser) {
                    const mergedUser = { ...(readStoredUser() || {}), ...serverUser };
                    localStorage.setItem('user', JSON.stringify(mergedUser));
                    setUserData(mergedUser);
                }
            } catch (error) {
                if (!isMounted) return;

                const isUnauthorized = error?.response?.status === 401 || error?.response?.status === 404;
                const latestUser = readStoredUser();
                const isGoogleFallback = latestUser?.provider === 'google';

                if (isGoogleFallback) {
                    setUserData(latestUser);
                    setIsLoading(false);
                    return;
                }

                if (isUnauthorized) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    window.dispatchEvent(new Event('auth-changed'));
                    navigate('/login', { replace: true });
                }
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        hydrateUser();
        return () => { isMounted = false; };
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('auth-changed'));
        navigate('/login', { replace: true });
    };

    const handleLogoChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) {
            setNotice('Logo file must be smaller than 5MB.');
            return;
        }
        setLogoFile(file);
        setRemoveLogo(false);
        const reader = new FileReader();
        reader.onload = () => {
            setLogoPreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleRemoveLogo = () => {
        setLogoFile(null);
        setLogoPreview('');
        setRemoveLogo(true);
    };

    const handleUpdateProfile = async (event) => {
        event.preventDefault();
        const nextName = editForm.name.trim();
        const nextPhone = editForm.phone.trim();
        const nextCompany = (editForm.companyName || '').trim();

        if (!nextName) {
            setNotice('Please enter your name before saving.');
            return;
        }

        setIsSaving(true);
        setNotice('');

        try {
            const token = localStorage.getItem('token');
            let updatedUser = {
                ...(userData || {}),
                name: nextName,
                phone: nextPhone,
                companyName: nextCompany,
            };

            if (token) {
                const formData = new FormData();
                formData.append('name', nextName);
                formData.append('phone', nextPhone);
                formData.append('companyName', nextCompany);

                if (logoFile) {
                    formData.append('companyLogo', logoFile);
                } else if (removeLogo) {
                    formData.append('removeLogo', 'true');
                }

                const res = await axios.put(`${API_BASE_URL}/api/auth/me`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                });

                if (res.data?.data?.user) {
                    updatedUser = { ...updatedUser, ...res.data.data.user };
                }
            } else {
                if (logoPreview && !removeLogo) {
                    updatedUser.companyLogo = logoPreview;
                    updatedUser.avatar = logoPreview;
                } else if (removeLogo) {
                    updatedUser.companyLogo = '';
                    updatedUser.avatar = '';
                }
            }

            localStorage.setItem('user', JSON.stringify(updatedUser));
            window.dispatchEvent(new Event('auth-changed'));
            setUserData(updatedUser);
            setLogoFile(null);
            setRemoveLogo(false);
            setNotice('Profile and company details updated successfully!');
        } catch (err) {
            console.error('Update profile error:', err);
            let fallbackUser = {
                ...(userData || {}),
                name: nextName,
                phone: nextPhone,
                companyName: nextCompany,
            };
            if (logoPreview && !removeLogo) {
                fallbackUser.companyLogo = logoPreview;
                fallbackUser.avatar = logoPreview;
            } else if (removeLogo) {
                fallbackUser.companyLogo = '';
                fallbackUser.avatar = '';
            }
            localStorage.setItem('user', JSON.stringify(fallbackUser));
            window.dispatchEvent(new Event('auth-changed'));
            setUserData(fallbackUser);
            setNotice(err?.response?.data?.message || 'Updated profile locally.');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="dashboard-container">
                <div className="dashboard-content">
                    <div className="dashboard-card" style={{ padding: '3rem 0', display: 'flex', justifyContent: 'center' }}>
                        <LoadingSpinner text="loading" />
                    </div>
                </div>
            </div>
        );
    }

    if (!userData) {
        return (
            <div className="dashboard-container">
                <div className="dashboard-content">
                    <div className="dashboard-card">
                        <p className="empty-text">Please log in to access your profile.</p>
                        <Link className="btn-save" to="/login">Go To Login</Link>
                    </div>
                </div>
            </div>
        );
    }

    // ----------------------------------------
    // TAB RENDERERS
    // ----------------------------------------

    const renderOverview = () => (
        <div className="overview-grid">
            {/* --- HERO WELCOME CARD --- */}
            <div className="dashboard-card full-width split-dashboard slide-up-hero">
                <div className="digital-card-container hover-lift">
                    <div className={`digital-id-card shimmer-card ${userRole === 'admin' ? 'admin-theme' : 'user-theme'}`}>
                        <div className="card-top-row">
                            <div className="card-logo">
                                {resolvedAvatar ? (
                                    <img src={resolvedAvatar} alt="Company Logo" className="card-company-logo-img" />
                                ) : null}
                                <span>{userData?.companyName || 'Ariadne Client'}</span>
                            </div>
                            <div className="card-chip" />
                        </div>
                        <div className="card-middle-row">
                            <h4>{userData?.name || 'Client'}</h4>
                            <span className="card-role-text">
                                {userRole === 'admin' ? 'System Administrator' : 'Creative Partner'}
                            </span>
                        </div>
                        <div className="card-bottom-row">
                            <div className="card-stat">
                                <span>Email</span>
                                <strong>{userData?.email || '-'}</strong>
                            </div>
                            <div className="card-stat right-align">
                                <span>Member since</span>
                                <strong>
                                    {userData?.createdAt
                                        ? new Date(userData.createdAt).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
                                        : 'Active'}
                                </strong>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="quick-actions-container">
                    <div className="qa-header">
                        <h2>
                            Welcome back, {firstName}
                            <span className="wave-emoji">👋</span>
                        </h2>
                        <p>Here's what you can do from your dashboard.</p>
                    </div>

                    <div className="qa-grid">
                        <button className="qa-btn hover-lift" onClick={() => setActiveTab('my-projects')}>
                            <div className="qa-icon" style={{ background: '#e0f2fe', color: '#0284c7' }}>
                                🎬
                            </div>
                            <div className="qa-text">
                                <strong>My Projects</strong>
                                <span>View all projects we've built for you</span>
                            </div>
                        </button>

                        <button className="qa-btn hover-lift" onClick={() => setActiveTab('billing')}>
                            <div className="qa-icon" style={{ background: '#dcfce7', color: '#16a34a' }}>
                                💳
                            </div>
                            <div className="qa-text">
                                <strong>Billing</strong>
                                <span>Check your payment history</span>
                            </div>
                        </button>

                        <button className="qa-btn hover-lift" onClick={() => navigate('/portfolio')}>
                            <div className="qa-icon" style={{ background: '#f3e8ff', color: '#9333ea' }}>
                                🗂️
                            </div>
                            <div className="qa-text">
                                <strong>Our Portfolio</strong>
                                <span>Explore all of our work</span>
                            </div>
                        </button>

                        <button className="qa-btn hover-lift" onClick={() => setActiveTab('settings')}>
                            <div className="qa-icon" style={{ background: '#fef3c7', color: '#d97706' }}>
                                ⚙️
                            </div>
                            <div className="qa-text">
                                <strong>Account Settings</strong>
                                <span>Update your profile details</span>
                            </div>
                        </button>

                        {userRole === 'admin' && (
                            <button className="qa-btn admin-btn hover-lift" onClick={() => navigate('/admin')}>
                                <div className="qa-icon" style={{ background: '#fee2e2', color: '#dc2626' }}>
                                    🛡️
                                </div>
                                <div className="qa-text">
                                    <strong>Admin Panel</strong>
                                    <span>Open administration tools</span>
                                </div>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* --- INFO BANNER --- */}
            <div className="dashboard-card full-width cp-info-banner slide-up-1">
                <div className="cp-info-icon">✨</div>
                <div>
                    <h4>Your projects are just a click away</h4>
                    <p>
                        Every project Ariadne creates for you is catalogued under{' '}
                        <button
                            onClick={() => setActiveTab('my-projects')}
                            style={{ background: 'none', border: 'none', color: 'var(--dash-primary)', fontWeight: 700, cursor: 'pointer', padding: 0, fontSize: 'inherit' }}
                        >
                            My Projects
                        </button>
                        . You can view the final deliverables, browse the media gallery, and share your results anytime.
                    </p>
                </div>
            </div>
        </div>
    );

    const renderMyProjects = () => (
        <MyProjectsTab userName={userData?.name} userId={userData?._id || userData?.id} />
    );

    const renderBilling = () => (
        <BillingTab userName={userData?.name} />
    );

    const renderSettings = () => (
        <div className="dashboard-card">
            <div className="card-header">
                <h3>Account & Company Settings</h3>
                <p>Manage your personal details and company brand identity.</p>
            </div>
            <form onSubmit={handleUpdateProfile} className="settings-form">
                {/* --- COMPANY BRANDING / LOGO UPLOAD --- */}
                <div className="form-group company-logo-upload-group">
                    <label>Company / Brand Logo</label>
                    <div className="company-logo-preview-row">
                        <div className="company-logo-preview-box">
                            {logoPreview ? (
                                <img src={logoPreview} alt="Company Logo Preview" className="company-logo-preview-img" />
                            ) : (
                                <div className="company-logo-initial-fallback">
                                    {(editForm.companyName || editForm.name || 'Y').charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>
                        <div className="company-logo-actions">
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                                <label className="btn-upload-logo-label hover-lift">
                                    <input
                                        type="file"
                                        accept="image/png,image/jpeg,image/webp,image/svg+xml"
                                        onChange={handleLogoChange}
                                        style={{ display: 'none' }}
                                    />
                                    📁 {logoPreview ? 'Change Logo' : 'Upload Logo'}
                                </label>
                                {logoPreview && (
                                    <button
                                        type="button"
                                        className="btn-remove-logo hover-lift"
                                        onClick={handleRemoveLogo}
                                    >
                                        ✕ Remove
                                    </button>
                                )}
                            </div>
                            <span className="logo-upload-hint">
                                Upload your company logo (PNG, JPG, SVG, or WEBP up to 5MB). Displays on your navigation avatar and digital client card.
                            </span>
                        </div>
                    </div>
                </div>

                <div className="form-group">
                    <label>Company / Studio Name</label>
                    <input
                        type="text"
                        placeholder="e.g. Acme Productions or Brand Name"
                        value={editForm.companyName}
                        onChange={(e) => setEditForm((prev) => ({ ...prev, companyName: e.target.value }))}
                    />
                </div>

                <div className="form-group">
                    <label>Full Name</label>
                    <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
                    />
                </div>
                <div className="form-group">
                    <label>Phone Number</label>
                    <input
                        type="text"
                        value={editForm.phone}
                        onChange={(e) => setEditForm((prev) => ({ ...prev, phone: e.target.value }))}
                    />
                </div>
                <div className="form-group">
                    <label>Email (Read-only)</label>
                    <input type="email" value={editForm.email} readOnly />
                </div>
                <p className="empty-text" style={{ textAlign: 'left', padding: 0 }}>
                    Password change is handled via the forgot-password flow.
                </p>
                <button type="submit" className="btn-save pulse-btn" disabled={isSaving}>
                    {isSaving ? 'Saving Changes...' : 'Save Changes'}
                </button>
            </form>
        </div>
    );

    const renderContent = () => {
        if (activeTab === 'my-projects') return renderMyProjects();
        if (activeTab === 'billing') return renderBilling();
        if (activeTab === 'settings') return renderSettings();
        return renderOverview();
    };

    // ----------------------------------------
    // LAYOUT
    // ----------------------------------------
    return (
        <div className="admin-wrapper">
            <aside className="admin-sidebar" style={{ justifyContent: 'space-between' }}>
                <div>
                    <div className="user-profile-snap">
                        <div
                            className="profile-avatar"
                            role="img"
                            aria-label="Profile avatar"
                            onClick={() => setActiveTab('settings')}
                            title="Click to manage company logo in Settings"
                        >
                            {resolvedAvatar ? (
                                <img
                                    src={resolvedAvatar}
                                    alt="Profile avatar"
                                    onError={(e) => {
                                        e.currentTarget.onerror = null;
                                        e.currentTarget.src = getAvatarUrl(userData?.gender);
                                    }}
                                />
                            ) : (
                                <div className="profile-avatar-letter">
                                    {(userData?.companyName || userData?.name || 'Y').charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>
                        <h4>{userData?.companyName || userData?.name || 'Client'}</h4>
                        <span className={`sidebar-role-badge ${userRole === 'admin' ? 'admin' : 'user'}`}>
                            {userRole === 'admin' ? 'Admin' : 'Client'}
                        </span>
                        {userData?.companyName && (
                            <p style={{ fontSize: '0.85rem', color: '#8b5cf6', fontWeight: 600, margin: '4px 0 0' }}>
                                🏢 {userData.companyName}
                            </p>
                        )}
                        <p>{userData?.email || '-'}</p>
                    </div>

                    <nav className="admin-nav">
                        <button
                            className={activeTab === 'overview' ? 'active' : ''}
                            onClick={() => setActiveTab('overview')}
                        >
                            Overview
                        </button>
                        <button
                            className={activeTab === 'my-projects' ? 'active' : ''}
                            onClick={() => setActiveTab('my-projects')}
                        >
                            My Projects
                        </button>
                        <button
                            className={activeTab === 'billing' ? 'active' : ''}
                            onClick={() => setActiveTab('billing')}
                        >
                            Billing
                        </button>
                        <button
                            className={activeTab === 'settings' ? 'active' : ''}
                            onClick={() => setActiveTab('settings')}
                        >
                            Settings
                        </button>
                    </nav>
                </div>

                <button className="btn-logout slide-bg-btn" onClick={handleLogout}>
                    Log Out
                </button>
            </aside>

            <main className="admin-main">
                {notice && (
                    <div className="active-reward-alert" role="status">
                        {notice}
                    </div>
                )}
                {renderContent()}
            </main>
        </div>
    );
};

export default Profile;