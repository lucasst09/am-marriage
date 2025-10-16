import { motion, AnimatePresence } from "framer-motion";
import { Home, Heart, Info, Images, Gift, CheckCircle, Menu } from "lucide-react";
import "../css/weddingSite/WeddingMenu.css";

/**
 * Elegant wedding side menu with translucent backdrop and CTA.
 * 
 * Features:
 * - Custom CSS for styling
 * - Framer Motion for smooth slide-in/out animations
 * - Lucide icons
 * - Responsive design
 * 
 * Usage:
 * <WeddingMenu open={isOpen} onClose={() => setIsOpen(false)} onNavigate={handleNavigate} onConfirmPresence={handleConfirmPresence} />
 */

export default function WeddingMenu({ 
  open, 
  onClose, 
  onNavigate, 
  onConfirmPresence 
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="wedding-menu-backdrop"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.aside
            key="panel"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 240, damping: 24 }}
            className="wedding-menu-panel"
          >
            {/* Header */}
            <div className="wedding-menu-header">
              <div className="wedding-menu-title-section">
              </div>
              <button
                onClick={onClose}
                className="wedding-menu-close"
              >
                fechar
              </button>
            </div>

            {/* Items */}
            <nav className="wedding-menu-nav">
              <MenuItem 
                icon={<Home className="wedding-menu-icon" />} 
                label="Início" 
                onClick={() => {
                  onClose();
                  document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' });
                }}
              />
              <Divider />
              <MenuItem 
                icon={<Heart className="wedding-menu-icon" />} 
                label="Nossa História" 
                onClick={() => {
                  onClose();
                  document.getElementById('story')?.scrollIntoView({ behavior: 'smooth' });
                }}
              />
              <Divider />
              <MenuItem 
                icon={<Info className="wedding-menu-icon" />} 
                label="Informações" 
                onClick={() => {
                  onClose();
                  document.getElementById('info')?.scrollIntoView({ behavior: 'smooth' });
                }}
              />
              <Divider />
              <MenuItem 
                icon={<Images className="wedding-menu-icon" />} 
                label="Galeria" 
                onClick={() => {
                  onClose();
                  document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' });
                }}
              />
              <Divider />
              <MenuItem 
                icon={<Gift className="wedding-menu-icon" />} 
                label="Presentes" 
                onClick={() => {
                  onClose();
                  onNavigate && onNavigate('presentes');
                }}
              />

              {/* CTA */}
              <div className="wedding-menu-cta">
                <button 
                  className="wedding-menu-confirm-btn"
                  onClick={() => {
                    onClose();
                    onConfirmPresence && onConfirmPresence();
                  }}
                >
                  <span className="wedding-menu-btn-content">
                    <CheckCircle className="wedding-menu-btn-icon" /> Confirmar Presença
                  </span>
                </button>
              </div>
            </nav>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function MenuItem({ icon, label, onClick }) {
  return (
    <button 
      className="wedding-menu-item"
      onClick={onClick}
    >
      <span className="wedding-menu-item-icon">{icon}</span>
      <span className="wedding-menu-item-label">
        {label}
      </span>
    </button>
  );
}

function Divider() {
  return <div className="wedding-menu-divider" />;
}
