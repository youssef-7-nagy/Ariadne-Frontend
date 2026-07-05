import { toast } from "react-hot-toast";

const variantClassMap = {
    success: "app-toast-card--success",
    info: "app-toast-card--info",
    warning: "app-toast-card--warning",
    error: "app-toast-card--error",
};

const iconClassMap = {
    success: "app-toast-icon--success",
    info: "app-toast-icon--info",
    warning: "app-toast-icon--warning",
    error: "app-toast-icon--error",
};

const titleMap = {
    success: "Success",
    info: "Information",
    warning: "Warning",
    error: "Error",
};

const extractTitleAndBody = (message, fallbackVariantTitle) => {
    const text = String(message || "").trim();
    const splitMatch = text.match(/^(success|info|warning|error)\s*-\s*(.+)$/i);

    if (splitMatch) {
        const parsedTitle = splitMatch[1].charAt(0).toUpperCase() + splitMatch[1].slice(1).toLowerCase();
        const parsedBody = splitMatch[2].trim();
        return { title: parsedTitle, body: parsedBody };
    }

    return { title: fallbackVariantTitle, body: text };
};

const ToastIcon = ({ variant }) => (
    <svg
        stroke="currentColor"
        viewBox="0 0 24 24"
        fill="none"
        className={`app-toast-icon ${iconClassMap[variant] || iconClassMap.info}`}
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
    >
        <path
            d="M13 16h-1v-4h1m0-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
        />
    </svg>
);

const createToast = (message, variant = "info", duration = 3500, customTitle) => {
    const fallbackTitle = customTitle || titleMap[variant] || titleMap.info;
    const { title, body } = extractTitleAndBody(message, fallbackTitle);

    return toast.custom(
        (t) => (
            <div className={`app-toast-wrap ${t.visible ? "app-toast-enter" : "app-toast-leave"}`}>
                <div
                    role="alert"
                    className={`app-toast-card ${variantClassMap[variant] || variantClassMap.info}`}
                >
                    <div className={`app-toast-icon-shell ${iconClassMap[variant] || iconClassMap.info}`}>
                        <ToastIcon variant={variant} />
                    </div>
                    <div className="app-toast-content">
                        <p className="app-toast-title">{title}</p>
                        <p className="app-toast-body">{body}</p>
                    </div>
                    <button
                        type="button"
                        className="app-toast-close"
                        aria-label="Dismiss alert"
                        onClick={() => toast.dismiss(t.id)}
                    >
                        ×
                    </button>
                </div>
            </div>
        ),
        { duration },
    );
};

export const notify = {
    success: (message, options = {}) => createToast(message, "success", options.duration, options.title),
    info: (message, options = {}) => createToast(message, "info", options.duration, options.title),
    warning: (message, options = {}) => createToast(message, "warning", options.duration, options.title),
    error: (message, options = {}) => createToast(message, "error", options.duration, options.title),
    confirm: (message, options = {}) => {
        const fallbackTitle = options.title || "Confirm Action";
        const variant = options.variant || "warning";
        const { title, body } = extractTitleAndBody(message, fallbackTitle);

        return new Promise((resolve) => {
            toast.custom(
                (t) => (
                    <div className={`app-toast-wrap ${t.visible ? "app-toast-enter" : "app-toast-leave"}`}>
                        <div
                            role="alert"
                            className={`app-toast-card ${variantClassMap[variant] || variantClassMap.info}`}
                            style={{ gridTemplateColumns: "auto 1fr" }}
                        >
                            <div className={`app-toast-icon-shell ${iconClassMap[variant] || iconClassMap.info}`}>
                                <ToastIcon variant={variant} />
                            </div>
                            <div className="app-toast-content" style={{ width: "100%" }}>
                                <p className="app-toast-title">{title}</p>
                                <p className="app-toast-body">{body}</p>
                                <div className="app-toast-confirm-actions">
                                    <button
                                        type="button"
                                        className="app-toast-btn app-toast-btn--confirm"
                                        onClick={() => {
                                            toast.dismiss(t.id);
                                            resolve(true);
                                        }}
                                    >
                                        Confirm
                                    </button>
                                    <button
                                        type="button"
                                        className="app-toast-btn app-toast-btn--cancel"
                                        onClick={() => {
                                            toast.dismiss(t.id);
                                            resolve(false);
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ),
                { duration: Infinity },
            );
        });
    },
    dismiss: (id) => toast.dismiss(id),
};

export default notify;
