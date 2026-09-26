import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FiImage, FiUploadCloud, FiX, FiArrowLeft, FiArrowRight, FiCheck } from 'react-icons/fi';
import { ProjectGallery } from '@/components/ui/ProjectGallery';
import './GalleryManager.css';

/**
 * GalleryManager provides touch-friendly & desktop drag-and-drop photo reordering,
 * distinct sections for existing vs newly uploaded photos, unified reordering,
 * lead cover designation, and live preview.
 */
export const GalleryManager = ({
  items = [],
  onItemsChange,
  onAddFiles,
  projectTitle = 'Project Gallery',
  disabled = false
}) => {
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'existing' | 'new'
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dropTargetIndex, setDropTargetIndex] = useState(null);
  const [ghostPos, setGhostPos] = useState({ x: 0, y: 0 });
  const [isPointerDragging, setIsPointerDragging] = useState(false);
  const [liftedIndex, setLiftedIndex] = useState(null);

  const fileInputRef = useRef(null);
  const touchTimerRef = useRef(null);
  const pointerStartRef = useRef({ x: 0, y: 0, index: null, type: 'mouse', moved: false });
  const isDraggingRef = useRef(false);
  const draggedIndexRef = useRef(null);
  const dropTargetIndexRef = useRef(null);

  // Keep refs in sync with state for event listeners
  draggedIndexRef.current = draggedIndex;
  dropTargetIndexRef.current = dropTargetIndex;

  // Compute stats
  const existingCount = items.filter(it => it.isExisting).length;
  const newCount = items.filter(it => !it.isExisting).length;

  // Filtered items based on activeTab
  const visibleIndices = items
    .map((item, idx) => ({ item, originalIndex: idx }))
    .filter(({ item }) => {
      if (activeTab === 'existing') return item.isExisting;
      if (activeTab === 'new') return !item.isExisting;
      return true;
    });

  // Reorder helper
  const moveItem = useCallback((fromIndex, toIndex) => {
    if (
      fromIndex === toIndex ||
      fromIndex < 0 ||
      toIndex < 0 ||
      fromIndex >= items.length ||
      toIndex >= items.length
    ) {
      return;
    }
    const updated = [...items];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    onItemsChange(updated);
  }, [items, onItemsChange]);

  // Remove photo handler
  const handleRemove = (originalIndex) => {
    const updated = items.filter((_, idx) => idx !== originalIndex);
    onItemsChange(updated);
  };

  // Set as lead cover
  const handleSetCover = (originalIndex) => {
    if (originalIndex === 0) return;
    moveItem(originalIndex, 0);
  };

  // ── Touch & Pointer Reorder Engine ──────────────────────────────────────────
  const handleDragMove = useCallback((clientX, clientY) => {
    if (!isDraggingRef.current) return;

    setGhostPos({ x: clientX, y: clientY });

    // Edge auto-scrolling when dragging near top/bottom of screen
    if (clientY < 75) {
      window.scrollBy({ top: -8, behavior: 'auto' });
    } else if (clientY > window.innerHeight - 75) {
      window.scrollBy({ top: 8, behavior: 'auto' });
    }

    // Find the card element under current pointer position
    const elem = document.elementFromPoint(clientX, clientY);
    const card = elem?.closest('[data-gm-index]');
    if (card) {
      const targetIdx = parseInt(card.getAttribute('data-gm-index'), 10);
      if (!isNaN(targetIdx) && targetIdx !== dropTargetIndexRef.current) {
        setDropTargetIndex(targetIdx);
      }
    }
  }, []);

  const startDrag = (index, clientX, clientY) => {
    isDraggingRef.current = true;
    setIsPointerDragging(true);
    setDraggedIndex(index);
    setLiftedIndex(index);
    setGhostPos({ x: clientX, y: clientY });
    document.body.classList.add('gm-dragging-active');

    if (navigator.vibrate) {
      try { navigator.vibrate(35); } catch (_) {}
    }
  };

  const handlePointerDown = (e, originalIndex) => {
    if (disabled || e.target.closest('button')) return;

    // Reset any existing timer
    if (touchTimerRef.current) {
      clearTimeout(touchTimerRef.current);
      touchTimerRef.current = null;
    }

    pointerStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      index: originalIndex,
      type: e.pointerType || 'mouse',
      moved: false
    };

    if (e.pointerType === 'touch') {
      // Touch devices: hold for 200ms to initiate drag, allowing normal vertical scroll if moved quickly
      touchTimerRef.current = setTimeout(() => {
        startDrag(originalIndex, e.clientX, e.clientY);
      }, 200);
    }
  };

  const handleGlobalPointerMove = useCallback((e) => {
    const start = pointerStartRef.current;
    if (start.index === null) return;

    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    const dist = Math.hypot(dx, dy);

    // If waiting for touch hold and user moves before timer fires, cancel drag so page scrolls smoothly
    if (start.type === 'touch' && !isDraggingRef.current) {
      if (dist > 8) {
        if (touchTimerRef.current) {
          clearTimeout(touchTimerRef.current);
          touchTimerRef.current = null;
        }
      }
      return;
    }

    // For mouse: immediate drag after small 4px movement
    if (start.type === 'mouse' && !isDraggingRef.current) {
      if (dist > 4) {
        startDrag(start.index, e.clientX, e.clientY);
      }
    }

    // While dragging is active
    if (isDraggingRef.current) {
      if (e.cancelable) {
        e.preventDefault();
      }
      handleDragMove(e.clientX, e.clientY);
    }
  }, [handleDragMove]);

  const handleGlobalPointerUp = useCallback(() => {
    if (touchTimerRef.current) {
      clearTimeout(touchTimerRef.current);
      touchTimerRef.current = null;
    }

    document.body.classList.remove('gm-dragging-active');

    if (isDraggingRef.current) {
      const from = draggedIndexRef.current;
      const to = dropTargetIndexRef.current;
      if (from !== null && to !== null && from !== to) {
        moveItem(from, to);
      }
    }

    isDraggingRef.current = false;
    setIsPointerDragging(false);
    setLiftedIndex(null);
    setDraggedIndex(null);
    setDropTargetIndex(null);
    pointerStartRef.current = { x: 0, y: 0, index: null, type: 'mouse', moved: false };
  }, [moveItem]);

  // Attach global pointer move & up listeners
  useEffect(() => {
    const onMove = (e) => handleGlobalPointerMove(e);
    const onUp = () => handleGlobalPointerUp();

    window.addEventListener('pointermove', onMove, { passive: false });
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);

    // Non-passive touchmove listener to reliably prevent scroll and track finger on iOS Safari / Android
    const onTouchMove = (e) => {
      if (isDraggingRef.current) {
        if (e.cancelable) e.preventDefault();
        if (e.touches && e.touches[0]) {
          handleDragMove(e.touches[0].clientX, e.touches[0].clientY);
        }
      }
    };

    const onTouchEnd = () => {
      if (isDraggingRef.current) {
        handleGlobalPointerUp();
      }
    };

    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);

    return () => {
      document.body.classList.remove('gm-dragging-active');
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [handleGlobalPointerMove, handleGlobalPointerUp, handleDragMove]);

  // ── Desktop HTML5 Drag & Drop (Native Mouse Support) ───────────────────────
  const handleHtml5DragStart = (e, originalIndex) => {
    if (disabled) return;
    setDraggedIndex(originalIndex);
    e.dataTransfer.effectAllowed = 'move';
    try {
      e.dataTransfer.setData('text/plain', String(originalIndex));
    } catch (_) {}
  };

  const handleHtml5DragOver = (e, originalIndex) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dropTargetIndex !== originalIndex) {
      setDropTargetIndex(originalIndex);
    }
  };

  const handleHtml5Drop = (e, originalIndex) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== originalIndex) {
      moveItem(draggedIndex, originalIndex);
    }
    setDraggedIndex(null);
    setDropTargetIndex(null);
  };

  // ── File upload / dropzone handlers ─────────────────────────────────────────
  const handleFileInputChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    onAddFiles(files);
    e.target.value = '';
  };

  const handleZoneDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
      if (files.length > 0) onAddFiles(files);
    }
  };

  const livePreviewUrls = items.map(it => it.previewUrl).filter(Boolean);

  return (
    <div className="gm-container">
      {/* ── Stats & Filter Navigation Bar ── */}
      <div className="gm-header-bar">
        <div className="gm-stats-group">
          <span className="gm-stat-pill gm-stat-total">
            Total: {items.length} photo{items.length !== 1 ? 's' : ''}
          </span>
          {existingCount > 0 && (
            <span className="gm-stat-pill gm-stat-existing">
              Existing: {existingCount}
            </span>
          )}
          {newCount > 0 && (
            <span className="gm-stat-pill gm-stat-new">
              New: {newCount}
            </span>
          )}
        </div>

        <div className="gm-tabs">
          <button
            type="button"
            className={`gm-tab-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All Photos ({items.length})
          </button>
          {existingCount > 0 && (
            <button
              type="button"
              className={`gm-tab-btn ${activeTab === 'existing' ? 'active' : ''}`}
              onClick={() => setActiveTab('existing')}
            >
              Existing ({existingCount})
            </button>
          )}
          {newCount > 0 && (
            <button
              type="button"
              className={`gm-tab-btn ${activeTab === 'new' ? 'active' : ''}`}
              onClick={() => setActiveTab('new')}
            >
              New ({newCount})
            </button>
          )}
        </div>
      </div>

      {/* ── Add Photos Dropzone ── */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        style={{ display: 'none' }}
        onChange={handleFileInputChange}
      />

      <div
        className="gm-dropzone"
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('dragover'); }}
        onDragLeave={(e) => { e.currentTarget.classList.remove('dragover'); }}
        onDrop={(e) => { e.currentTarget.classList.remove('dragover'); handleZoneDrop(e); }}
      >
        <FiUploadCloud className="gm-dropzone-icon" />
        <span className="gm-dropzone-title">+ Add Photos to Gallery</span>
        <span className="gm-dropzone-subtitle">
          Click or drag & drop images here — new photos are appended without replacing existing ones
        </span>
      </div>

      {/* ── Live Carousel Preview ── */}
      {livePreviewUrls.length > 0 && (
        <div style={{ marginTop: 4, marginBottom: 6 }}>
          <div className="gm-section-title">
            <span>✨ Live Gallery Preview ({livePreviewUrls.length} photos):</span>
            <span className="gm-hint">Drag thumbnails below to rearrange</span>
          </div>
          <ProjectGallery images={livePreviewUrls} title={projectTitle} />
        </div>
      )}

      {/* ── Reorderable Photos Grid ── */}
      {visibleIndices.length > 0 ? (
        <div>
          <div className="gm-section-title">
            <span>
              {activeTab === 'all'
                ? 'Unified Gallery Order (Drag to reorder):'
                : activeTab === 'existing'
                ? 'Existing Photos:'
                : 'New Photos to Upload:'}
            </span>
            <span className="gm-hint">Touch & hold on mobile or mouse drag</span>
          </div>

          <div className="gm-grid">
            {visibleIndices.map(({ item, originalIndex }) => {
              const isLeadCover = originalIndex === 0;
              const isDraggingCurrent = isPointerDragging && draggedIndex === originalIndex;
              const isLifted = liftedIndex === originalIndex;
              const isDropTarget = dropTargetIndex === originalIndex && draggedIndex !== originalIndex;
              const isBefore = isDropTarget && draggedIndex !== null && originalIndex < draggedIndex;
              const isAfter = isDropTarget && draggedIndex !== null && originalIndex > draggedIndex;

              return (
                <div
                  key={item.id || originalIndex}
                  data-gm-index={originalIndex}
                  className={`gm-card ${isDraggingCurrent ? 'is-dragging' : ''} ${isLifted ? 'is-lifted' : ''} ${isDropTarget ? 'drop-target' : ''} ${isBefore ? 'drop-target-before' : ''} ${isAfter ? 'drop-target-after' : ''}`}
                  onPointerDown={(e) => handlePointerDown(e, originalIndex)}
                  draggable={!disabled}
                  onDragStart={(e) => handleHtml5DragStart(e, originalIndex)}
                  onDragOver={(e) => handleHtml5DragOver(e, originalIndex)}
                  onDrop={(e) => handleHtml5Drop(e, originalIndex)}
                >
                  <img
                    src={item.previewUrl}
                    alt={`Photo #${originalIndex + 1}`}
                    className="gm-card-img"
                    loading="lazy"
                  />

                  {/* Top Left: Clustered Order + Type or Cover Badges */}
                  <div className="gm-card-top-left">
                    <span className="gm-order-badge">#{originalIndex + 1}</span>
                    {isLeadCover ? (
                      <span className="gm-cover-badge">★ Cover</span>
                    ) : (
                      <span className={`gm-type-badge ${item.isExisting ? 'existing' : 'new'}`}>
                        {item.isExisting ? 'Existing' : 'New'}
                      </span>
                    )}
                  </div>

                  {/* Top Right: Compact Circular Delete Button */}
                  <button
                    type="button"
                    className="gm-delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(originalIndex);
                    }}
                    title="Remove from gallery"
                    aria-label="Remove photo"
                  >
                    <FiX />
                  </button>

                  {/* Bottom Bar: Action Strip */}
                  <div className="gm-card-bottom-bar">
                    {!isLeadCover ? (
                      <button
                        type="button"
                        className="gm-make-cover-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSetCover(originalIndex);
                        }}
                        title="Set as Lead Cover (#1)"
                      >
                        Make #1
                      </button>
                    ) : (
                      <span className="gm-lead-label">Lead Photo</span>
                    )}

                    {/* Left / Right Nudge arrows */}
                    <div className="gm-nudge-group">
                      <button
                        type="button"
                        className="gm-nudge-btn"
                        disabled={originalIndex === 0 || disabled}
                        onClick={(e) => {
                          e.stopPropagation();
                          moveItem(originalIndex, originalIndex - 1);
                        }}
                        title="Move left"
                        aria-label="Move left"
                      >
                        <FiArrowLeft />
                      </button>
                      <button
                        type="button"
                        className="gm-nudge-btn"
                        disabled={originalIndex === items.length - 1 || disabled}
                        onClick={(e) => {
                          e.stopPropagation();
                          moveItem(originalIndex, originalIndex + 1);
                        }}
                        title="Move right"
                        aria-label="Move right"
                      >
                        <FiArrowRight />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '24px', color: '#64748b', fontSize: '0.86rem' }}>
          No photos in this view. Click "+ Add Photos to Gallery" above to upload photos.
        </div>
      )}

      {/* Floating Drag Ghost for Touch & Mouse Dragging */}
      {isPointerDragging && draggedIndex !== null && items[draggedIndex] && (
        <div
          className="gm-drag-ghost"
          style={{
            left: `${ghostPos.x}px`,
            top: `${ghostPos.y}px`
          }}
        >
          <img src={items[draggedIndex].previewUrl} alt="Dragging" />
        </div>
      )}
    </div>
  );
};
