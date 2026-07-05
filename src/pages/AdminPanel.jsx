import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import axios from 'axios';
import { notify } from '../utils/notify';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { FiCheck, FiChevronLeft, FiChevronRight, FiEdit2, FiImage, FiPlus, FiTrash2, FiUploadCloud, FiX } from "react-icons/fi";
import { WalletIcon, CreditCardIcon } from '../components/TransactionIcons';
import './AdminPanel.css'; 
import './profile.css';
import { PortfolioCMS } from './CMSAdmin';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';


const ORDER_STATUS_WEIGHT = { pending: 0, delivered: 1, completed: 2, cancelled: 3 };
const MAX_UPLOAD_IMAGES = 5;
const normalize = (value) => String(value || "").toLowerCase();
const hasCustomizationNotes = (order) =>
  (order.items || []).some((item) => String(item.specialInstructions || "").trim().length > 0);
const escapeCsv = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;
const ExportFileIcon = () => (
  <svg fill="#fff" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 50 50" aria-hidden="true">
    <path d="M28.8125 .03125L.8125 5.34375C.339844 5.433594 0 5.863281 0 6.34375L0 43.65625C0 44.136719 .339844 44.566406 .8125 44.65625L28.8125 49.96875C28.875 49.980469 28.9375 50 29 50C29.230469 50 29.445313 49.929688 29.625 49.78125C29.855469 49.589844 30 49.296875 30 49L30 1C30 .703125 29.855469 .410156 29.625 .21875C29.394531 .0273438 29.105469 -.0234375 28.8125 .03125ZM32 6L32 13L34 13L34 15L32 15L32 20L34 20L34 22L32 22L32 27L34 27L34 29L32 29L32 35L34 35L34 37L32 37L32 44L47 44C48.101563 44 49 43.101563 49 42L49 8C49 6.898438 48.101563 6 47 6ZM36 13L44 13L44 15L36 15ZM6.6875 15.6875L11.8125 15.6875L14.5 21.28125C14.710938 21.722656 14.898438 22.265625 15.0625 22.875L15.09375 22.875C15.199219 22.511719 15.402344 21.941406 15.6875 21.21875L18.65625 15.6875L23.34375 15.6875L17.75 24.9375L23.5 34.375L18.53125 34.375L15.28125 28.28125C15.160156 28.054688 15.035156 27.636719 14.90625 27.03125L14.875 27.03125C14.8125 27.316406 14.664063 27.761719 14.4375 28.34375L11.1875 34.375L6.1875 34.375L12.15625 25.03125ZM36 20L44 20L44 22L36 22ZM36 27L44 27L44 29L36 29ZM36 35L44 35L44 37L36 37Z"></path>
  </svg>
);

const getAvatarUrl = (gender) => {
    const normalized = (gender || '').toLowerCase();
    if (normalized === 'female') return 'https://cdn-icons-png.flaticon.com/512/3135/3135768.png';
    return 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';
};

const AdminPanel = () => {
  // Use local storage instead of Redux
  const [userData] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user')) || {};
    } catch {
      return {};
    }
  });
  const token = localStorage.getItem("token");
  
  // --- STATE ---
  const [activeTab, setActiveTab] = useState('overview'); 
  const [selectedMetric, setSelectedMetric] = useState('orders'); 

  // --- DATA ---
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [cars, setCars] = useState([]);
  const [packages, setPackages] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [transactionForm, setTransactionForm] = useState({ clientName: '', serviceName: '', amount: '', paymentMethod: 'cash' });
  const [transactionEditingId, setTransactionEditingId] = useState(null);
  const [isSubmittingTransaction, setIsSubmittingTransaction] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [fetchError, setFetchError] = useState("");
  const [loading, setLoading] = useState({
    users: false,
    bookings: false,
    orders: false,
    packages: false,
    categories: false,
    cars: false,
    transactions: false,
  });
  const [statusBusyId, setStatusBusyId] = useState("");

  // Orders operations controls
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");
  const [orderPaymentFilter, setOrderPaymentFilter] = useState("all");
  const [orderCustomizationFilter, setOrderCustomizationFilter] = useState("all");
  const [orderSortBy, setOrderSortBy] = useState("newest");

  // --- MENU/SERVICES FORM ---
  const [editingId, setEditingId] = useState(null); 
  const [formData, setFormData] = useState({ title: "", description: "", price: "", stock: "", category: "wash" });
  const [selectedImages, setSelectedImages] = useState([]);
  const [isDragActive, setIsDragActive] = useState(false);
  const imagesRef = useRef();

  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const clientDropdownRef = useRef(null);
  const categoryDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (clientDropdownRef.current && !clientDropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
        setShowCategoryDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const userRole = (userData?.role || 'admin').toLowerCase();

  // --- COLORS ---
  const COLORS = ['#4361ee', '#3a0ca3', '#f72585', '#4cc9f0', '#10b981', '#f59e0b'];

  const setLoadingFor = useCallback((keys, value) => {
    setLoading((prev) => {
      const next = { ...prev };
      keys.forEach((key) => {
        next[key] = value;
      });
      return next;
    });
  }, []);

  const syncFileInputWithSelection = useCallback((files) => {
    if (!imagesRef.current) return;
    try {
      const transfer = new DataTransfer();
      files.forEach((file) => transfer.items.add(file));
      imagesRef.current.files = transfer.files;
    } catch {
      if (files.length === 0) {
        imagesRef.current.value = "";
      }
    }
  }, []);

  const clearMenuUploadFiles = useCallback(() => {
    setSelectedImages([]);
    setIsDragActive(false);
    if (imagesRef.current) {
      imagesRef.current.value = "";
    }
  }, []);

  const setMenuUploadFiles = useCallback((incomingFiles) => {
    const rawFiles = Array.from(incomingFiles || []);
    if (!rawFiles.length) {
      clearMenuUploadFiles();
      return;
    }

    const imageFiles = rawFiles.filter((file) => String(file.type || "").startsWith("image/"));
    if (rawFiles.length !== imageFiles.length) {
      notify.warning("Warning - Only image files are allowed.");
    }

    const limitedFiles = imageFiles.slice(0, MAX_UPLOAD_IMAGES);
    if (imageFiles.length > MAX_UPLOAD_IMAGES) {
      notify.info(`Info - Only the first ${MAX_UPLOAD_IMAGES} images were selected.`);
    }

    setSelectedImages(limitedFiles);
    syncFileInputWithSelection(limitedFiles);
  }, [clearMenuUploadFiles, syncFileInputWithSelection]);

  const imagePreviews = useMemo(() => {
    return selectedImages.map((file, index) => ({
      id: `${file.name}-${file.lastModified}-${index}`,
      name: file.name,
      size: file.size,
      url: URL.createObjectURL(file),
    }));
  }, [selectedImages]);

  useEffect(() => {
    return () => {
      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [imagePreviews]);

  const formatFileSize = useCallback((bytes) => {
    if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  }, []);

  // --- FETCH DATA ---
  const fetchData = useCallback(async (tabName = activeTab) => {
    if (!token) return;

    const config = { headers: { Authorization: `Bearer ${token}` } };
    const loadingMap = {
      overview: ["users", "bookings", "orders", "packages", "cars", "categories"],
      users: ["users"],
      cars: ["cars"],
      bookings: ["bookings"],
      orders: ["orders"],
      packages: ["packages"],
      transactions: ["transactions", "categories"],
    };

    setFetchError("");
    setLoadingFor(loadingMap[tabName] || [], true);

    try {
      if (tabName === "overview") {
        const [usersRes, transactionsRes, categoriesRes] = await Promise.all([
          axios.get(`${API_URL}/api/auth/users`, config).catch(() => ({ data: { data: [] }})),
          axios.get(`${API_URL}/transactions`, config).catch(() => ({ data: { data: [] }})),
          axios.get(`${API_URL}/api/admin/categories`, config).catch(() => ({ data: { data: [] }})),
        ]);
        setUsers(usersRes.data.data || []);
        setTransactions(transactionsRes.data.data || []);
        setCategories(categoriesRes.data.data || []);
      } else if (tabName === "users") {
        const usersRes = await axios.get(`${API_URL}/api/auth/users`, config);
        setUsers(usersRes.data.data || []);
      } else if (tabName === "transactions") {
        const [transactionsRes, categoriesRes] = await Promise.all([
          axios.get(`${API_URL}/transactions`, config),
          axios.get(`${API_URL}/api/admin/categories`, config),
        ]);
        setTransactions(transactionsRes.data.data || []);
        setCategories(categoriesRes.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching data", error);
      setFetchError(error.response?.data?.message || "Failed to load data. Please try again.");
    } finally {
      setLoadingFor(loadingMap[tabName] || [], false);
    }
  }, [activeTab, setLoadingFor, token]);

  useEffect(() => {
    fetchData(activeTab);
  }, [activeTab, fetchData]);

  // --- CHART DATA GENERATOR ---
  const getChartData = () => {
    let data = [];
    if (selectedMetric === 'users') {
        data = [
            { name: 'Admins', value: users.filter(u => u.role === 'admin').length },
            { name: 'Users', value: users.filter(u => u.role === 'user').length },
        ];
    } else if (selectedMetric === 'transactions') {
        data = [
            { name: 'Cash', value: transactions.filter(t => t.paymentMethod === 'cash').length },
            { name: 'Visa', value: transactions.filter(t => t.paymentMethod === 'visa').length },
        ];
    }
    return data.filter(d => d.value > 0);
  };

  const getChartTitle = () => {
      if (selectedMetric === 'users') return "User Roles Breakdown";
      if (selectedMetric === 'transactions') return "Payment Methods";
      return "";
  };

  const formatConfirmedDateTime = (dateValue) => {
    if (!dateValue) return "-";
    const parsedDate = new Date(dateValue);
    if (Number.isNaN(parsedDate.getTime())) return "-";

    return parsedDate.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatReservationSchedule = (reservation) => {
    const reservationDate = reservation?.date ? formatConfirmedDateTime(reservation.date) : "-";
    if (!reservation?.time) return reservationDate;
    return `${reservationDate} (${reservation.time})`;
  };

  const getBrandLogoUrl = (brandName) => {
      if (!brandName) return null;
      const normalizedBrand = String(brandName).toLowerCase().trim().replace(/\s+/g, '-');
      return `/logos/${normalizedBrand}.png`;
  };

  const resolveReservationVehicle = (reservation) => {
      const car = reservation?.vehicle?.car;
      if (car && car.brand) {
          return (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img 
                      src={getBrandLogoUrl(car.brand)} 
                      alt={car.brand} 
                      style={{ width: '28px', height: '28px', objectFit: 'contain' }}
                      onError={(e) => { e.target.style.display = 'none'; }}
                  />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <strong>{car.brand}</strong>
                      <span>{car.model}</span>
                      <span style={{ color: '#64748b' }}>{car.year}</span>
                      <span className="badge" style={{ backgroundColor: '#e2e8f0', color: '#0f172a', padding: '2px 8px', fontSize: '0.7rem' }}>{car.plateNumber}</span>
                  </div>
              </div>
          );
      }
      return reservation?.vehicle?.label || reservation?.vehicleTypeLabel || reservation?.vehicle?.type || "-";
  };

  const normalizedSearch = useMemo(() => normalize(searchTerm).trim(), [searchTerm]);

  const filteredUsers = useMemo(() => {
    if (!normalizedSearch) return users;
    return users.filter((user) =>
      `${user._id} ${user.name} ${user.email} ${user.role}`.toLowerCase().includes(normalizedSearch)
    );
  }, [users, normalizedSearch]);

  const filteredBookings = useMemo(() => {
    if (!normalizedSearch) return bookings;
    return bookings.filter((booking) =>
      `${booking._id} ${booking.userName || booking.name || ""} ${booking.date || ""} ${booking.time || ""} ${booking.vehicle?.label || booking.vehicle?.type || booking.vehicleTypeLabel || ""} ${booking.washPackage?.name || ""} ${booking.status || ""}`
        .toLowerCase()
        .includes(normalizedSearch)
    );
  }, [bookings, normalizedSearch]);

  const filteredCars = useMemo(() => {
    if (!normalizedSearch) return cars;
    return cars.filter((car) =>
      `${car.type} ${car.brand} ${car.model} ${car.plateNumber} ${car.user?.name || ""}`
        .toLowerCase()
        .includes(normalizedSearch)
    );
  }, [cars, normalizedSearch]);

  const filteredOrders = useMemo(() => {
    const filtered = orders.filter((order) => {
      const orderStatus = normalize(order.status);
      const paymentMethod = normalize(order.paymentMethod || "cash");
      const noteExists = hasCustomizationNotes(order);

      if (orderStatusFilter !== "all" && orderStatus !== orderStatusFilter) return false;
      if (orderPaymentFilter !== "all" && paymentMethod !== orderPaymentFilter) return false;
      if (orderCustomizationFilter === "with-notes" && !noteExists) return false;
      if (orderCustomizationFilter === "without-notes" && noteExists) return false;

      if (!normalizedSearch) return true;

      const itemsText = (order.items || [])
        .map((item) => `${item.title || ""} ${item.specialInstructions || ""}`)
        .join(" ")
        .toLowerCase();

      return `${order._id} ${order.userName || ""} ${itemsText} ${orderStatus} ${paymentMethod}`
        .toLowerCase()
        .includes(normalizedSearch);
    });

    return filtered.sort((a, b) => {
      const aDate = new Date(a.createdAt || 0).getTime();
      const bDate = new Date(b.createdAt || 0).getTime();
      const aTotal = Number(a.totalAmount || 0);
      const bTotal = Number(b.totalAmount || 0);
      const aUser = String(a.userName || "");
      const bUser = String(b.userName || "");

      switch (orderSortBy) {
        case "oldest":
          return aDate - bDate;
        case "total-high":
          return bTotal - aTotal;
        case "total-low":
          return aTotal - bTotal;
        case "user-az":
          return aUser.localeCompare(bUser);
        case "user-za":
          return bUser.localeCompare(aUser);
        case "status":
          return (
            (ORDER_STATUS_WEIGHT[normalize(a.status)] ?? 99) -
            (ORDER_STATUS_WEIGHT[normalize(b.status)] ?? 99)
          );
        case "newest":
        default:
          return bDate - aDate;
      }
    });
  }, [
    orders,
    orderStatusFilter,
    orderPaymentFilter,
    orderCustomizationFilter,
    normalizedSearch,
    orderSortBy,
  ]);

  const orderSummary = useMemo(() => {
    const withNotes = filteredOrders.filter((order) => hasCustomizationNotes(order)).length;
    const totalRevenue = filteredOrders.reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);
    return { count: filteredOrders.length, withNotes, totalRevenue };
  }, [filteredOrders]);

  const downloadOrdersCSV = () => {
    const headers = "Request ID,User,Packages,Custom Notes,Total,Payment,Status,Confirmed Time\n";
    const rows = filteredOrders
      .map((order) => {
        const items = (order.items || []).map((item) => `${item.quantity}x ${item.title}`).join(" | ");
        const notes = (order.items || [])
          .filter((item) => String(item.specialInstructions || "").trim())
          .map((item) => `${item.title}: ${item.specialInstructions}`)
          .join(" | ");

        return [order._id, order.userName || "Guest", items, notes, order.totalAmount, order.paymentMethod || "cash", order.status, formatConfirmedDateTime(order.createdAt)]
          .map(escapeCsv)
          .join(",");
      })
      .join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(`data:text/csv;charset=utf-8,${headers}${rows}`);
    link.download = "service_requests.csv";
    link.click();
    notify.success("Success - Requests exported successfully.");
  };

  const downloadUsersCSV = () => {
    const headers = "User ID,Name,Email,Role\n";
    const rows = filteredUsers
      .map((user) => [user._id, user.name, user.email, user.role].map(escapeCsv).join(","))
      .join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(`data:text/csv;charset=utf-8,${headers}${rows}`);
    link.download = "users_list.csv";
    link.click();
    notify.success("Success - Users exported successfully.");
  };

  const downloadTransactionsCSV = () => {
    const headers = "Transaction ID,Date,Client Name,Service,Amount,Payment Method\n";
    const rows = transactions
      .map((t) => [
        t._id,
        new Date(t.date || t.createdAt).toLocaleDateString(),
        t.clientName,
        t.serviceName,
        t.amount,
        t.paymentMethod
      ].map(escapeCsv).join(","))
      .join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(`data:text/csv;charset=utf-8,${headers}${rows}`);
    link.download = "transactions_list.csv";
    link.click();
    notify.success("Success - Transactions exported successfully.");
  };

  const handleUserRoleChange = async (id, role) => {
    if (userData._id === id) {
      const confirmed = await notify.confirm("Warning - Change your own role?");
      if (!confirmed) return;
    }
    try {
      await axios.put(`${API_URL}/api/auth/users/${id}/role`, { role }, { headers: { Authorization: `Bearer ${token}` } });
      setUsers((prev) => prev.map((user) => (user._id === id ? { ...user, role } : user)));
      notify.success(`Success - Role changed to ${role}.`);
    } catch {
      notify.error("Error - Failed to update user role.");
    }
  };

  const handleMenuSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      if (editingId) {
        await axios.put(`${API_URL}/packages/${editingId}`, formData, config);
        notify.success("Success - Package updated.");
      } else {
        const data = new FormData();
        Object.keys(formData).forEach((key) => data.append(key, formData[key]));
        if (selectedImages.length > 0) {
          selectedImages.forEach((file) => data.append("images", file));
        } else {
          return notify.error("Error - At least one image is required.");
        }
        await axios.post(`${API_URL}/packages`, data, {
          headers: { ...config.headers, "Content-Type": "multipart/form-data" },
        });
        notify.success("Success - Package created.");
      }

      setFormData({ title: "", description: "", price: "", stock: "", category: "wash" });
      setEditingId(null);
      clearMenuUploadFiles();
      fetchData("packages");
    } catch {
      notify.error("Error - Failed to save package.");
    }
  };

  const handleEditClick = (product) => {
    clearMenuUploadFiles();
    setEditingId(product._id);
    setFormData({
      title: product.title,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category,
    });
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    const confirmed = await notify.confirm("Warning - Are you sure you want to delete this package?");
    if (!confirmed) return;
    try {
      await axios.delete(`${API_URL}/packages/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPackages((prev) => prev.filter((pkg) => pkg._id !== id));
      notify.success("Success - Package removed.");
    } catch {
      notify.error("Error - Failed to delete package.");
    }
  };

  const handleMoveProduct = async (index, direction) => {
    if (direction === -1 && index === 0) return;
    if (direction === 1 && index === packages.length - 1) return;

    const reordered = [...packages];
    const temp = reordered[index];
    reordered[index] = reordered[index + direction];
    reordered[index + direction] = temp;
    reordered.forEach((product, orderIndex) => {
      product.order = orderIndex;
    });

    setPackages(reordered);

    try {
      const payload = reordered.map((product) => ({ id: product._id, order: product.order }));
      await axios.put(
        `${API_URL}/packages/reorder`,
        { items: payload },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      notify.success("Success - Package order updated.");
    } catch {
      notify.error("Error - Failed to reorder package.");
      fetchData("packages");
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      setStatusBusyId(orderId);
      await axios.put(
        `${API_URL}/order/${orderId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders((prev) => prev.map((order) => (order._id === orderId ? { ...order, status } : order)));
      notify.success(`Success - Request marked as ${status}.`);
    } catch {
      notify.error("Error - Failed to update request.");
    } finally {
      setStatusBusyId("");
    }
  };

  const updateReservationStatus = async (reservationId, status) => {
    try {
      await axios.put(
        `${API_URL}/reservation/${reservationId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBookings((prev) =>
        prev.map((booking) => (booking._id === reservationId ? { ...booking, status } : booking))
      );
      notify.success(`Success - Reservation set to ${status}.`);
    } catch {
      notify.error("Error - Failed to update reservation.");
    }
  };

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    if (!transactionForm.clientName || !transactionForm.serviceName || !transactionForm.amount) {
      notify.error("Error - Please fill all required fields.");
      return;
    }
    setIsSubmittingTransaction(true);
    try {
      if (transactionEditingId) {
        await axios.put(`${API_URL}/transactions/${transactionEditingId}`, transactionForm, {
          headers: { Authorization: `Bearer ${token}` }
        });
        notify.success("Success - Transaction updated successfully.");
      } else {
        await axios.post(`${API_URL}/transactions`, transactionForm, {
          headers: { Authorization: `Bearer ${token}` }
        });
        notify.success("Success - Transaction recorded successfully.");
      }
      setTransactionForm({ clientName: '', serviceName: '', amount: '', paymentMethod: 'cash' });
      setTransactionEditingId(null);
      fetchData("transactions");
    } catch (err) {
      notify.error("Error - Failed to save transaction.");
      console.error(err);
    } finally {
      setIsSubmittingTransaction(false);
    }
  };

  const handleDeleteTransaction = async (id) => {
    const confirmed = await notify.confirm("Warning - Are you sure you want to delete this transaction?");
    if (!confirmed) return;
    try {
      await axios.delete(`${API_URL}/transactions/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      notify.success("Success - Transaction deleted successfully.");
      setTransactions((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      notify.error("Error - Failed to delete transaction.");
      console.error(err);
    }
  };

  const handleEditTransactionClick = (t) => {
    setTransactionForm({
      clientName: t.clientName,
      serviceName: t.serviceName,
      amount: t.amount,
      paymentMethod: t.paymentMethod || 'cash'
    });
    setTransactionEditingId(t._id);
    setActiveTab('transactions');
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('auth-changed'));
    window.location.href = '/login';
  };

  return (
    <div className="admin-wrapper">
      <aside className="admin-sidebar" style={{ justifyContent: 'space-between' }}>
        <div>
          <div className="user-profile-snap">
            <div className="profile-avatar" style={{ padding: 0, overflow: 'hidden', width: '105px', height: '105px', borderRadius: '50%', margin: '0 auto 15px', border: '4px solid transparent', background: 'linear-gradient(#fff, #fff) padding-box, linear-gradient(135deg, #4361ee 0%, #3a0ca3 100%) border-box', boxShadow: '0 10px 25px rgba(67, 97, 238, 0.25)' }}>
                <img src={getAvatarUrl(userData?.gender)} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <h4>{userData?.name || 'Admin'}</h4>
            <span className={`sidebar-role-badge ${userRole === 'admin' ? 'admin' : 'user'}`}>
              {userRole === 'admin' ? 'System Administrator' : 'Staff'}
            </span>
            <p>{userData?.email || '-'}</p>
          </div>
          <nav className="admin-nav">
              {['overview','users','transactions', 'categories', 'projects'].map(t => (
                  <button key={t} className={activeTab === t ? 'active' : ''} onClick={() => setActiveTab(t)}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
              ))}
          </nav>
        </div>
        <button className="btn-logout slide-bg-btn" onClick={handleLogout}>Log Out</button>
      </aside>

      <main className="admin-main">
        {activeTab !== 'overview' && activeTab !== 'packages' && activeTab !== 'categories' && activeTab !== 'projects' && (
             <div className="admin-header-actions">
                <input
                  type="text"
                  placeholder={activeTab === "orders" ? "Search request ID, user, item, or note" : "Search"}
                  className="search-bar"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="admin-header-buttons">
                  <button className="btn-export btn-refresh" onClick={() => fetchData(activeTab)}>Refresh</button>
                  {activeTab === 'orders' && (
                    <button className="container-btn-file" onClick={downloadOrdersCSV}>
                      <ExportFileIcon />
                      Export Requests
                    </button>
                  )}
                  {activeTab === 'users' && (
                    <button className="container-btn-file" onClick={downloadUsersCSV}>
                      <ExportFileIcon />
                      Export Users
                    </button>
                  )}
                  {activeTab === 'transactions' && (
                    <button className="container-btn-file" onClick={downloadTransactionsCSV}>
                      <ExportFileIcon />
                      Export Transactions
                    </button>
                  )}
                </div>
             </div>
        )}

        {/* OVERVIEW */}
        {activeTab === 'overview' && (
            <div className="overview-container">
                {fetchError ? (
                  <div className="admin-state-card error">
                    <h3>Failed to load dashboard data</h3>
                    <p>{fetchError}</p>
                    <button className="btn-save" style={{width: 'auto', marginTop: 15, padding: '10px 20px'}} onClick={() => fetchData("overview")}>Retry</button>
                  </div>
                ) : (loading.users || loading.bookings || loading.orders || loading.products) ? (
                  <>
                    <div className="stats-grid">
                      {Array.from({ length: 4 }).map((_, idx) => (
                        <div key={idx} className="stat-box stat-skeleton"></div>
                      ))}
                    </div>
                    <div className="chart-section chart-skeleton"></div>
                  </>
                ) : (
                  <>
                    <div className="stats-grid">
                        <div className={`stat-box purple ${selectedMetric==='users'?'active-metric':''}`} onClick={()=>setSelectedMetric('users')}><h3>{users.length}</h3><p>Users</p></div>
                        <div className={`stat-box blue ${selectedMetric==='transactions'?'active-metric':''}`} onClick={()=>setSelectedMetric('transactions')}><h3>{transactions.length}</h3><p>Transactions</p></div>
                    </div>

                    <div className="digital-card-container hover-lift" style={{ marginTop: '20px', maxWidth: '400px' }}>
                        <div className={`digital-id-card shimmer-card ${userRole === 'admin' ? 'admin-theme' : 'user-theme'}`}>
                            <div className="card-top-row">
                                <div className="card-logo">Administrative Identity</div>
                                <div className="card-chip" />
                            </div>

                            <div className="card-middle-row">
                                <h4>{userData?.name || 'Administrator'}</h4>
                                <span className="card-role-text">
                                    {userRole === 'admin' ? 'System Administrator' : 'Staff'}
                                </span>
                            </div>

                            <div className="card-bottom-row">
                                <div className="card-stat">
                                    <span>Email Address</span>
                                    <strong>{userData?.email || '-'}</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {getChartData().length > 0 && (
                        <div className="chart-section">
                            <h3>{getChartTitle()}</h3>
                            <div className="chart-wrapper">
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie data={getChartData()} cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#8884d8" paddingAngle={5} dataKey="value">
                                            {getChartData().map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend verticalAlign="bottom" height={36}/>
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )}
                  </>
                )}
            </div>
        )}

        {/* BOOKINGS */}
        {activeTab === 'bookings' && (
            <div className="panel-section">
                <h2>Reservations</h2>
                {loading.bookings ? (
                  <div className="admin-skeleton-table">
                    {Array.from({ length: 6 }).map((_, idx) => <div key={idx} className="admin-skeleton-row"></div>)}
                  </div>
                ) : fetchError ? (
                  <div className="admin-state-card error">
                    <h3>Failed to load reservations</h3>
                    <p>{fetchError}</p>
                    <button className="btn-save" style={{width: 'auto', marginTop: 15, padding: '10px 20px'}} onClick={() => fetchData("bookings")}>Retry</button>
                  </div>
                ) : filteredBookings.length === 0 ? (
                  <div className="admin-state-card">
                    <h3>No reservations found</h3>
                    <p>Try changing the search term.</p>
                  </div>
                ) : (
                  <div style={{overflowX: 'auto'}}>
                    <table className="admin-table">
                        <thead><tr><th>Name</th><th>Date</th><th>Vehicle</th><th>Status</th><th>Action</th></tr></thead>
                        <tbody>
                            {filteredBookings.map(b => (
                                <tr key={b._id}>
                                  <td>{b.userName || b.name || '-'}</td>
                                  <td>{formatReservationSchedule(b)}</td>
                                  <td>{resolveReservationVehicle(b)}</td>
                                  <td><span className={`badge ${normalize(b.status)}`}>{normalize(b.status) || 'pending'}</span></td>
                                  <td>
                                    <button
                                      className="btn-icon check"
                                      onClick={() => updateReservationStatus(b._id, 'accepted')}
                                      title="Accept reservation"
                                      aria-label="Accept reservation"
                                    >
                                      <FiCheck />
                                    </button>
                                    <button
                                      className="btn-icon cross"
                                      onClick={() => updateReservationStatus(b._id, 'rejected')}
                                      title="Reject reservation"
                                      aria-label="Reject reservation"
                                    >
                                      <FiX />
                                    </button>
                                  </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                  </div>
                )}
            </div>
        )}

        {/* ORDERS */}
        {activeTab === 'orders' && (
            <div className="panel-section">
                <div className="orders-title-row">
                  <h2>Package Requests</h2>
                  <div className="orders-summary-pills">
                    <span className="orders-summary-pill">{orderSummary.count} filtered</span>
                    <span className="orders-summary-pill">{orderSummary.withNotes} with notes</span>
                    <span className="orders-summary-pill">{orderSummary.totalRevenue.toFixed(2)} EGP</span>
                  </div>
                </div>

                <div className="orders-toolbar">
                  <div className="orders-filter-group">
                    <label>Status</label>
                    <select value={orderStatusFilter} onChange={(e) => setOrderStatusFilter(e.target.value)}>
                      <option value="all">All</option>
                      <option value="pending">Pending</option>
                      <option value="delivered">Delivered / Ongoing</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div className="orders-filter-group">
                    <label>Payment</label>
                    <select value={orderPaymentFilter} onChange={(e) => setOrderPaymentFilter(e.target.value)}>
                      <option value="all">All</option>
                      <option value="cash">Cash</option>
                      <option value="visa">Visa</option>
                    </select>
                  </div>

                  <div className="orders-filter-group">
                    <label>Customization</label>
                    <select value={orderCustomizationFilter} onChange={(e) => setOrderCustomizationFilter(e.target.value)}>
                      <option value="all">All</option>
                      <option value="with-notes">With notes</option>
                      <option value="without-notes">Without notes</option>
                    </select>
                  </div>

                  <div className="orders-filter-group">
                    <label>Sort by</label>
                    <select value={orderSortBy} onChange={(e) => setOrderSortBy(e.target.value)}>
                      <option value="newest">Newest</option>
                      <option value="oldest">Oldest</option>
                      <option value="total-high">Total: High to low</option>
                      <option value="total-low">Total: Low to high</option>
                      <option value="user-az">User: A to Z</option>
                      <option value="user-za">User: Z to A</option>
                      <option value="status">Status</option>
                    </select>
                  </div>

                  <button
                    className="orders-reset-btn"
                    onClick={() => {
                      setOrderStatusFilter("all");
                      setOrderPaymentFilter("all");
                      setOrderCustomizationFilter("all");
                      setOrderSortBy("newest");
                      setSearchTerm("");
                    }}
                  >
                    Reset
                  </button>
                </div>

                {loading.orders ? (
                  <div className="admin-skeleton-table">
                    {Array.from({ length: 7 }).map((_, idx) => <div key={idx} className="admin-skeleton-row"></div>)}
                  </div>
                ) : fetchError ? (
                  <div className="admin-state-card error">
                    <h3>Failed to load requests</h3>
                    <p>{fetchError}</p>
                    <button className="btn-save" style={{width: 'auto', marginTop: 15, padding: '10px 20px'}} onClick={() => fetchData("orders")}>Retry</button>
                  </div>
                ) : filteredOrders.length === 0 ? (
                  <div className="admin-state-card">
                    <h3>No requests found</h3>
                    <p>Try changing filters or search text.</p>
                  </div>
                ) : (
                  <>
                    <div className="orders-desktop-view">
                      <table className="admin-table orders-table">
                          <thead><tr><th>ID</th><th>User</th><th>Packages</th><th>Total</th><th>Payment</th><th>Status</th><th>Confirmed</th><th>Action</th></tr></thead>
                          <tbody>
                              {filteredOrders.map(o => (
                                  <tr key={o._id}>
                                    <td>#{o._id.slice(-6)}</td>
                                    <td>{o.userName || "Guest"}</td>
                                    <td className="order-items-cell">
                                      {(o.items || []).map((item, idx) => (
                                        <div key={item._id || `${o._id}-${idx}`} className="order-item-row">
                                          <span>{item.quantity}x {item.title}</span>
                                          {item.specialInstructions && (
                                            <small className="order-item-custom-note">Note: {item.specialInstructions}</small>
                                          )}
                                        </div>
                                      ))}
                                    </td>
                                    <td>{Number(o.totalAmount || 0).toFixed(2)} EGP</td>
                                    <td><span className="payment-pill">{o.paymentMethod || "cash"}</span></td>
                                    <td><span className={`badge ${o.status}`}>{o.status}</span></td>
                                    <td className="order-confirmed-time">{formatConfirmedDateTime(o.createdAt)}</td>
                                    <td>
                                      <div className="kitchen-actions-cell">
                                        <select
                                          className="status-select"
                                          value={o.status}
                                          onChange={(e) => updateOrderStatus(o._id, e.target.value)}
                                          disabled={statusBusyId === o._id}
                                        >
                                          <option value="pending">Pending</option>
                                          <option value="delivered">Ongoing / Done</option>
                                          <option value="completed">Completed</option>
                                          <option value="cancelled">Cancelled</option>
                                        </select>
                                        <div className="quick-action-group">
                                          <button className="btn-quick neutral" onClick={() => updateOrderStatus(o._id, "delivered")} disabled={statusBusyId === o._id || normalize(o.status) === "delivered"}>Status Done</button>
                                          <button className="btn-quick success" onClick={() => updateOrderStatus(o._id, "completed")} disabled={statusBusyId === o._id || normalize(o.status) === "completed"}>Complete</button>
                                          <button className="btn-quick danger" onClick={() => updateOrderStatus(o._id, "cancelled")} disabled={statusBusyId === o._id || normalize(o.status) === "cancelled"}>Cancel</button>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                    </div>

                    <div className="orders-mobile-view">
                      {filteredOrders.map((order) => (
                        <article key={order._id} className="order-mobile-card">
                          <header className="order-mobile-header">
                            <strong>#{order._id.slice(-6)}</strong>
                            <span className={`badge ${order.status}`}>{order.status}</span>
                          </header>
                          <div className="order-mobile-meta">
                            <span>{order.userName || "Guest"}</span>
                            <span>{Number(order.totalAmount || 0).toFixed(2)} EGP</span>
                            <span>{order.paymentMethod || "cash"}</span>
                            <span>{formatConfirmedDateTime(order.createdAt)}</span>
                          </div>
                          <div className="order-mobile-items">
                            {(order.items || []).map((item, idx) => (
                              <div key={item._id || `${order._id}-m-${idx}`} className="order-item-row">
                                <span>{item.quantity}x {item.title}</span>
                                {item.specialInstructions && (
                                  <small className="order-item-custom-note">Note: {item.specialInstructions}</small>
                                )}
                              </div>
                            ))}
                          </div>
                          <div className="quick-action-group mobile">
                            <button className="btn-quick neutral" onClick={() => updateOrderStatus(order._id, "delivered")} disabled={statusBusyId === order._id || normalize(order.status) === "delivered"}>Set Ongoing</button>
                            <button className="btn-quick success" onClick={() => updateOrderStatus(order._id, "completed")} disabled={statusBusyId === order._id || normalize(order.status) === "completed"}>Complete</button>
                            <button className="btn-quick danger" onClick={() => updateOrderStatus(order._id, "cancelled")} disabled={statusBusyId === order._id || normalize(order.status) === "cancelled"}>Cancel</button>
                          </div>
                        </article>
                      ))}
                    </div>
                  </>
                )}
            </div>
        )}

        {/* USERS */}
        {activeTab === 'users' && (
            <div className="panel-section">
                <h2>Users</h2>
                {loading.users ? (
                  <div className="admin-skeleton-table">
                    {Array.from({ length: 6 }).map((_, idx) => <div key={idx} className="admin-skeleton-row"></div>)}
                  </div>
                ) : fetchError ? (
                  <div className="admin-state-card error">
                    <h3>Failed to load users</h3>
                    <p>{fetchError}</p>
                    <button className="btn-save" style={{width: 'auto', marginTop: 15, padding: '10px 20px'}} onClick={() => fetchData("users")}>Retry</button>
                  </div>
                ) : filteredUsers.length === 0 ? (
                  <div className="admin-state-card">
                    <h3>No users found</h3>
                    <p>Try changing the search term.</p>
                  </div>
                ) : (
                  <div style={{overflowX: 'auto'}}>
                    <table className="admin-table">
                        <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Change</th></tr></thead>
                        <tbody>
                            {filteredUsers.map(u => (
                                <tr key={u._id}>
                                  <td>{u.name}</td>
                                  <td>{u.email}</td>
                                  <td><span className={`badge role ${u.role==='admin'?'admin-badge':'user-badge'}`}>{u.role}</span></td>
                                  <td>
                                    <select className="status-select" value={u.role} onChange={(e)=>handleUserRoleChange(u._id, e.target.value)} disabled={u._id===userData._id}>
                                      <option value="user">User</option>
                                      <option value="admin">Admin</option>
                                    </select>
                                  </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                  </div>
                )}
            </div>
        )}

        {/* CARS */}
        {activeTab === 'cars' && (
            <div className="panel-section">
                <h2>Customer Cars</h2>
                {loading.cars ? (
                  <div className="admin-skeleton-table">
                    {Array.from({ length: 6 }).map((_, idx) => <div key={idx} className="admin-skeleton-row"></div>)}
                  </div>
                ) : fetchError ? (
                  <div className="admin-state-card error">
                    <h3>Failed to load cars</h3>
                    <p>{fetchError}</p>
                    <button className="btn-save" style={{width: 'auto', marginTop: 15, padding: '10px 20px'}} onClick={() => fetchData("cars")}>Retry</button>
                  </div>
                ) : filteredCars.length === 0 ? (
                  <div className="admin-state-card">
                    <h3>No cars found</h3>
                    <p>Try changing the search term, or no cars have been registered yet.</p>
                  </div>
                ) : (
                  <>
                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '30px' }}>
                        {[ 
                            { title: 'Vehicle Categories', key: 'type' }, 
                            { title: 'Vehicle Brands', key: 'brand' } 
                        ].map((statDef, i) => {
                            const rawStats = {};
                            cars.forEach(c => {
                                const val = c[statDef.key] || "Other";
                                rawStats[val] = (rawStats[val] || 0) + 1;
                            });
                            const cData = Object.keys(rawStats).map(k => ({ name: k, value: rawStats[k] })).sort((a, b) => b.value - a.value);
                            const total = cData.reduce((sum, item) => sum + item.value, 0);

                            return cData.length > 0 ? (
                                <div key={i} className="chart-section sleek-dark-chart" style={{ flex: 1, minWidth: '320px', margin: 0 }}>
                                    <h3>{statDef.title}</h3>
                                    <div className="chart-wrapper" style={{ height: '220px', display: 'flex', alignItems: 'center' }}>
                                        <div style={{ flex: 1, height: '100%' }}>
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie data={cData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} fill="#8884d8" paddingAngle={3} dataKey="value" stroke="none">
                                                        {cData.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
                                                    </Pie>
                                                    <Tooltip contentStyle={{ backgroundColor: '#1e1e24', border: '1px solid #333', borderRadius: '8px', color: '#fff' }} />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </div>
                                        <div style={{ flex: 1, minWidth: '130px' }}>
                                            <div className="custom-chart-legend">
                                                {cData.map((entry, index) => (
                                                    <div key={`legend-${index}`} className="custom-chart-legend-item" style={{ fontSize: '0.8rem', gap: '5px' }}>
                                                        <div className="legend-label" style={{ gap: '6px' }}>
                                                            <div className="legend-dot" style={{ backgroundColor: COLORS[index % COLORS.length], width: '10px', height: '10px' }}></div>
                                                            <span>{entry.name}</span>
                                                        </div>
                                                        <div className="legend-value">{Math.round((entry.value / total) * 100)}%</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : null;
                        })}
                    </div>

                  <div style={{overflowX: 'auto'}}>
                    <table className="admin-table">
                        <thead><tr><th>Owner Name</th><th>Owner Email</th><th>Type</th><th>Vehicle Details</th><th>Color</th></tr></thead>
                        <tbody>
                            {filteredCars.map(c => (
                                <tr key={c._id}>
                                  <td>{c.user?.name || '-'}</td>
                                  <td>{c.user?.email || '-'}</td>
                                  <td><span className="badge" style={{ backgroundColor: '#64748b', color: '#fff' }}>{c.type}</span></td>
                                  <td>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                          <img 
                                              src={getBrandLogoUrl(c.brand)} 
                                              alt={c.brand} 
                                              style={{ width: '28px', height: '28px', objectFit: 'contain' }}
                                              onError={(e) => { e.target.style.display = 'none'; }}
                                          />
                                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                              <strong>{c.brand}</strong>
                                              <span>{c.model}</span>
                                              <span style={{ color: '#64748b' }}>{c.year}</span>
                                              <span className="badge" style={{ backgroundColor: '#e2e8f0', color: '#0f172a', padding: '2px 8px', fontSize: '0.7rem' }}>{c.plateNumber}</span>
                                          </div>
                                      </div>
                                  </td>
                                  <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                      <span style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: c.color || '#333', border: '1px solid #ccc' }}></span>
                                      {c.color}
                                    </div>
                                  </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                  </div>
                  </>
                )}
            </div>
        )}

        {/* PACKAGES / PRODUCTS */}
        {activeTab === 'packages' && (
            <div className="panel-section">
                <div className="menu-form-card">
                    <div className="form-header">
                        <div className="form-icon" aria-hidden="true">
                          {editingId ? <FiEdit2 /> : <FiPlus />}
                        </div>
                        <div>
                            <h3>{editingId ? "Edit Wash Package" : "Add New Package"}</h3>
                            <p>Manage the wash packages offered.</p>
                        </div>
                    </div>
                    
                    <form onSubmit={handleMenuSubmit} className="perfect-form">
                        <div className="form-row">
                            <div className="form-col-8">
                                <div className="input-group-modern">
                                    <label>Package Name</label>
                                    <input className="form-control" type="text" placeholder="e.g. Premium Wash" name="title" value={formData.title} onChange={(e)=>setFormData({...formData,title:e.target.value})} required />
                                </div>
                            </div>
                            <div className="form-col-4">
                                <div className="input-group-modern">
                                    <label>Price (EGP)</label>
                                    <input className="form-control" type="number" placeholder="0.00" name="price" value={formData.price} onChange={(e)=>setFormData({...formData,price:e.target.value})} required />
                                </div>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-col-6">
                                <div className="input-group-modern">
                                    <label>Category</label>
                                    <select className="form-select" name="category" value={formData.category} onChange={(e)=>setFormData({...formData,category:e.target.value})}>
                                        <option value="documentaries">Documentaries</option>
                                        <option value="short-films">Short Films</option>
                                        <option value="events">Events</option>
                                        <option value="commercials">Commercials</option>
                                        <option value="podcasts">Podcasts</option>
                                        <option value="streaming">Streaming</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-col-6">
                                <div className="input-group-modern">
                                    <label>Estimated Duration (mins)</label>
                                    <input className="form-control" type="number" placeholder="Duration" name="stock" value={formData.stock} onChange={(e)=>setFormData({...formData,stock:e.target.value})} />
                                </div>
                            </div>
                        </div>

                        <div className="input-group-modern file-group">
                            <label>Upload Image</label>
                            <div
                              className={`custom-file-upload ${isDragActive ? "drag-active" : ""} ${selectedImages.length ? "has-files" : ""}`}
                              onDragEnter={(event) => {
                                event.preventDefault();
                                setIsDragActive(true);
                              }}
                              onDragOver={(event) => {
                                event.preventDefault();
                                setIsDragActive(true);
                              }}
                              onDragLeave={(event) => {
                                event.preventDefault();
                                if (event.currentTarget.contains(event.relatedTarget)) return;
                                setIsDragActive(false);
                              }}
                              onDrop={(event) => {
                                event.preventDefault();
                                setIsDragActive(false);
                                setMenuUploadFiles(event.dataTransfer.files);
                              }}
                            >
                                <input
                                  type="file"
                                  multiple
                                  accept="image/*"
                                  ref={imagesRef}
                                  className="file-input"
                                  onChange={(event) => setMenuUploadFiles(event.target.files)}
                                />
                                <div className="upload-content">
                                    <span className="upload-icon" aria-hidden="true">
                                      {isDragActive ? <FiUploadCloud /> : <FiImage />}
                                    </span>
                                    <span>
                                      {isDragActive
                                        ? "Drop images here"
                                        : selectedImages.length
                                          ? `${selectedImages.length} image${selectedImages.length > 1 ? "s" : ""} selected`
                                          : "Drag & Drop or Click to Upload"}
                                    </span>
                                </div>
                                {selectedImages.length > 0 && (
                                  <button type="button" className="clear-upload-btn" onClick={clearMenuUploadFiles}>
                                    Clear
                                  </button>
                                )}
                            </div>
                            {imagePreviews.length > 0 && (
                              <div className="upload-preview-grid">
                                {imagePreviews.map((preview) => (
                                  <figure key={preview.id} className="upload-preview-card">
                                    <img src={preview.url} alt={preview.name} loading="lazy" decoding="async" />
                                    <figcaption>
                                      <span title={preview.name}>{preview.name}</span>
                                      <small>{formatFileSize(preview.size)}</small>
                                    </figcaption>
                                  </figure>
                                ))}
                              </div>
                            )}
                        </div>

                        <div className="input-group-modern">
                            <label>Description</label>
                            <textarea className="form-control" rows={4} placeholder="Describe the package..." name="description" value={formData.description} onChange={(e)=>setFormData({...formData,description:e.target.value})} />
                        </div>

                        <div className="form-actions-modern">
                            <button type="submit" className="btn-save">{editingId ? "Save Changes" : "Publish Package"}</button>
                            {editingId && <button type="button" onClick={()=>setEditingId(null)} className="btn-cancel">Cancel</button>}
                        </div>
                    </form>
                </div>

                {loading.products ? (
                  <div className="admin-skeleton-table menu-skeleton">
                    {Array.from({ length: 5 }).map((_, idx) => <div key={idx} className="admin-skeleton-row"></div>)}
                  </div>
                ) : fetchError ? (
                  <div className="admin-state-card error">
                    <h3>Failed to load packages</h3>
                    <p>{fetchError}</p>
                    <button className="btn-save" style={{width: 'auto', marginTop: 15, padding: '10px 20px'}} onClick={() => fetchData("packages")}>Retry</button>
                  </div>
                ) : packages.length === 0 ? (
                  <div className="admin-state-card">
                    <h3>No packages yet</h3>
                    <p>Add your first wash package from the form above.</p>
                  </div>
                ) : (
                  <div className="menu-grid">
                      {packages.map((p, index) => (
                          <div key={p._id} className="menu-card-mini">
                              <div className="card-img-holder">
                                  <img src={p.images?.[0]?`${API_URL}/${p.images[0]}`:"https://via.placeholder.com/150"} alt={p.title} loading="lazy" decoding="async" />
                              </div>
                              <div className="menu-info"><h4>{p.title}</h4><span>{p.price} EGP</span></div>
                              <div className="menu-actions" style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
                                  <button
                                    className="btn-action move"
                                    onClick={() => handleMoveProduct(index, -1)}
                                    disabled={index === 0}
                                    title="Move Left"
                                    aria-label="Move package left"
                                  >
                                    <FiChevronLeft />
                                  </button>
                                  <button
                                    className="btn-action move"
                                    onClick={() => handleMoveProduct(index, 1)}
                                    disabled={index === packages.length - 1}
                                    title="Move Right"
                                    aria-label="Move package right"
                                  >
                                    <FiChevronRight />
                                  </button>
                                  <button
                                    className="btn-action edit"
                                    onClick={() => handleEditClick(p)}
                                    title="Edit"
                                    aria-label="Edit package"
                                  >
                                    <FiEdit2 />
                                  </button>
                                  <button
                                    className="btn-action delete"
                                    onClick={() => handleDelete(p._id)}
                                    title="Delete"
                                    aria-label="Delete package"
                                  >
                                    <FiTrash2 />
                                  </button>
                              </div>
                          </div>
                      ))}
                  </div>
                )}
            </div>
        )}
        {/* TRANSACTIONS */}
        {activeTab === 'transactions' && (
          <div className="panel-section">
              <div className="orders-title-row">
                <h2>My Transactions</h2>
              </div>
              <form className="admin-form" onSubmit={handleAddTransaction} style={{ marginBottom: '30px' }}>
                <div className="form-group-row">
                  <div className="form-group" style={{ position: 'relative' }} ref={clientDropdownRef}>
                    <label>Client Name</label>
                    <input 
                      type="text" 
                      required 
                      value={transactionForm.clientName} 
                      onChange={(e) => {
                        setTransactionForm({ ...transactionForm, clientName: e.target.value });
                        setShowUserDropdown(true);
                      }} 
                      onFocus={() => setShowUserDropdown(true)}
                      placeholder="Search Client Name..." 
                      autoComplete="off"
                    />
                    {showUserDropdown && (
                      <div className="custom-dropdown-menu">
                        {users.filter(u => u.name.toLowerCase().includes(transactionForm.clientName.toLowerCase())).length > 0 ? (
                          users.filter(u => u.name.toLowerCase().includes(transactionForm.clientName.toLowerCase())).map(u => (
                            <div 
                              key={u._id} 
                              className="custom-dropdown-item"
                              onClick={() => {
                                setTransactionForm({ ...transactionForm, clientName: u.name });
                                setShowUserDropdown(false);
                              }}
                            >
                              <div className="dropdown-avatar">
                                {u.name.charAt(0).toUpperCase()}
                              </div>
                              <div className="dropdown-info">
                                <strong>{u.name}</strong>
                                <span>{u.email}</span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="custom-dropdown-empty">No clients found</div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="form-group" style={{ position: 'relative' }} ref={categoryDropdownRef}>
                    <label>Service Provided</label>
                    <input 
                      type="text" 
                      required 
                      value={transactionForm.serviceName} 
                      onChange={(e) => {
                        setTransactionForm({ ...transactionForm, serviceName: e.target.value });
                        setShowCategoryDropdown(true);
                      }} 
                      onFocus={() => setShowCategoryDropdown(true)}
                      placeholder="Search Category..." 
                      autoComplete="off"
                    />
                    {showCategoryDropdown && (
                      <div className="custom-dropdown-menu">
                        {categories.filter(c => c.name.toLowerCase().includes(transactionForm.serviceName.toLowerCase())).length > 0 ? (
                          categories.filter(c => c.name.toLowerCase().includes(transactionForm.serviceName.toLowerCase())).map(c => (
                            <div 
                              key={c._id} 
                              className="custom-dropdown-item"
                              onClick={() => {
                                setTransactionForm({ ...transactionForm, serviceName: c.name });
                                setShowCategoryDropdown(false);
                              }}
                            >
                              <div className="dropdown-avatar" style={{ background: '#10b981' }}>
                                {c.name.charAt(0).toUpperCase()}
                              </div>
                              <div className="dropdown-info">
                                <strong>{c.name}</strong>
                                <span>Portfolio Category</span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="custom-dropdown-empty">No categories found</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="form-group-row">
                  <div className="form-group">
                    <label>Amount (EGP)</label>
                    <input type="number" required min="0" value={transactionForm.amount} onChange={(e) => setTransactionForm({ ...transactionForm, amount: e.target.value })} placeholder="Amount Paid" />
                  </div>
                  <div className="form-group">
                    <label>Payment Method</label>
                    <select value={transactionForm.paymentMethod} onChange={(e) => setTransactionForm({ ...transactionForm, paymentMethod: e.target.value })}>
                      <option value="cash">Cash</option>
                      <option value="visa">Visa</option>
                    </select>
                  </div>
                </div>
                <div className="form-actions-modern" style={{marginTop: '0px'}}>
                  <button type="submit" className="btn-save" disabled={isSubmittingTransaction}>
                    {isSubmittingTransaction ? 'Saving...' : (transactionEditingId ? 'Update Transaction' : 'Record Transaction')}
                  </button>
                  {transactionEditingId && (
                    <button type="button" onClick={() => {
                      setTransactionEditingId(null);
                      setTransactionForm({ clientName: '', serviceName: '', amount: '', paymentMethod: 'cash' });
                    }} className="btn-cancel">Cancel</button>
                  )}
                </div>
              </form>

              {loading.transactions ? (
                <div className="admin-skeleton-table">
                  {Array.from({ length: 4 }).map((_, idx) => <div key={idx} className="admin-skeleton-row"></div>)}
                </div>
              ) : transactions.length === 0 ? (
                <div className="admin-state-card">
                  <h3>No transactions recorded</h3>
                  <p>When you record services, they will appear here.</p>
                </div>
              ) : (
                <div style={{overflowX: 'auto'}}>
                  <table className="admin-table">
                      <thead><tr><th>Date</th><th>Client Name</th><th>Service</th><th>Amount</th><th>Method</th><th>Actions</th></tr></thead>
                      <tbody>
                          {transactions.map(t => (
                              <tr key={t._id}>
                                <td>{new Date(t.date || t.createdAt).toLocaleDateString()} {new Date(t.date || t.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
                                <td>{t.clientName}</td>
                                <td>{t.serviceName}</td>
                                <td><strong>{t.amount} EGP</strong></td>
                                <td>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <span className={`badge ${t.paymentMethod === 'visa' ? 'completed' : 'pending'}`}>
                                      {t.paymentMethod.toUpperCase()}
                                    </span>
                                    {t.paymentMethod === 'visa' ? <CreditCardIcon clientName={t.clientName} /> : <WalletIcon />}
                                  </div>
                                </td>
                                <td>
                                  <div style={{ display: 'flex', gap: '5px' }}>
                                    <button
                                      className="btn-action edit"
                                      onClick={() => handleEditTransactionClick(t)}
                                      title="Edit Transaction"
                                      aria-label="Edit transaction"
                                    >
                                      <FiEdit2 />
                                    </button>
                                    <button
                                      className="btn-action delete"
                                      onClick={() => handleDeleteTransaction(t._id)}
                                      title="Delete Transaction"
                                      aria-label="Delete transaction"
                                    >
                                      <FiTrash2 />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
                </div>
              )}
          </div>
        )}

        {/* PORTFOLIO CMS */}
        {(activeTab === 'services' || activeTab === 'categories' || activeTab === 'projects') && (
            <div className="panel-section">
                <PortfolioCMS activeTab={activeTab} />
            </div>
        )}
      </main>
    </div>
  );
};

export default AdminPanel;
