import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getActivePopupsForPage, type Popup } from "@/lib/db/popups";
import { cn } from "@/lib/utils";

export function PopupDisplay() {
  const location = useLocation();
  const [dismissedPopups, setDismissedPopups] = useState<Set<string>>(() => {
    const stored = sessionStorage.getItem("dismissed_popups");
    return stored ? new Set(JSON.parse(stored)) : new Set();
  });
  const [visiblePopups, setVisiblePopups] = useState<Set<string>>(new Set());

  const { data: popups = [] } = useQuery({
    queryKey: ["active-popups", location.pathname],
    queryFn: () => getActivePopupsForPage(location.pathname),
    staleTime: 60000, // 1 minute
  });

  // Filter out dismissed popups and apply delay
  useEffect(() => {
    const activePopups = popups.filter(p => !dismissedPopups.has(p.id));
    
    activePopups.forEach(popup => {
      const delay = (popup.delay_seconds || 0) * 1000;
      const timer = setTimeout(() => {
        setVisiblePopups(prev => new Set([...prev, popup.id]));
      }, delay);
      
      return () => clearTimeout(timer);
    });
  }, [popups, dismissedPopups]);

  const dismissPopup = (popupId: string) => {
    setDismissedPopups(prev => {
      const newSet = new Set([...prev, popupId]);
      sessionStorage.setItem("dismissed_popups", JSON.stringify([...newSet]));
      return newSet;
    });
    setVisiblePopups(prev => {
      const newSet = new Set(prev);
      newSet.delete(popupId);
      return newSet;
    });
  };

  const handleButtonClick = (popup: Popup) => {
    if (popup.button_link) {
      if (popup.button_link.startsWith("http")) {
        window.open(popup.button_link, "_blank");
      } else {
        window.location.href = popup.button_link;
      }
    }
    dismissPopup(popup.id);
  };

  const displayPopups = popups.filter(p => 
    visiblePopups.has(p.id) && !dismissedPopups.has(p.id)
  );

  if (displayPopups.length === 0) return null;

  return (
    <>
      <AnimatePresence>
        {displayPopups.map(popup => {
          if (popup.popup_type === "modal") {
            return (
              <ModalPopup
                key={popup.id}
                popup={popup}
                onDismiss={() => dismissPopup(popup.id)}
                onButtonClick={() => handleButtonClick(popup)}
              />
            );
          }
          if (popup.popup_type === "slide_in") {
            return (
              <SlideInPopup
                key={popup.id}
                popup={popup}
                onDismiss={() => dismissPopup(popup.id)}
                onButtonClick={() => handleButtonClick(popup)}
              />
            );
          }
          if (popup.popup_type === "bar") {
            return (
              <BarPopup
                key={popup.id}
                popup={popup}
                onDismiss={() => dismissPopup(popup.id)}
                onButtonClick={() => handleButtonClick(popup)}
              />
            );
          }
          return null;
        })}
      </AnimatePresence>
    </>
  );
}

interface PopupComponentProps {
  popup: Popup;
  onDismiss: () => void;
  onButtonClick: () => void;
}

function ModalPopup({ popup, onDismiss, onButtonClick }: PopupComponentProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && popup.show_close_button && onDismiss()}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative max-w-md w-full rounded-2xl p-6 shadow-2xl"
        style={{
          backgroundColor: popup.background_color || "#3b82f6",
          color: popup.text_color || "#ffffff",
        }}
      >
        {popup.show_close_button && (
          <button
            onClick={onDismiss}
            className="absolute top-3 right-3 p-1 rounded-full hover:bg-white/20 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
        <h3 className="text-2xl font-bold mb-3">{popup.title}</h3>
        <p className="mb-4 opacity-90">{popup.content}</p>
        {popup.button_text && (
          <Button
            onClick={onButtonClick}
            variant="secondary"
            className="w-full"
          >
            {popup.button_text}
          </Button>
        )}
      </motion.div>
    </motion.div>
  );
}

function SlideInPopup({ popup, onDismiss, onButtonClick }: PopupComponentProps) {
  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 100, opacity: 0 }}
      className="fixed bottom-4 right-4 z-[100] max-w-sm w-full rounded-xl p-5 shadow-2xl"
      style={{
        backgroundColor: popup.background_color || "#3b82f6",
        color: popup.text_color || "#ffffff",
      }}
    >
      {popup.show_close_button && (
        <button
          onClick={onDismiss}
          className="absolute top-2 right-2 p-1 rounded-full hover:bg-white/20 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}
      <h4 className="text-lg font-bold mb-2 pr-6">{popup.title}</h4>
      <p className="text-sm mb-3 opacity-90">{popup.content}</p>
      {popup.button_text && (
        <Button
          onClick={onButtonClick}
          variant="secondary"
          size="sm"
          className="w-full"
        >
          {popup.button_text}
        </Button>
      )}
    </motion.div>
  );
}

function BarPopup({ popup, onDismiss, onButtonClick }: PopupComponentProps) {
  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -100, opacity: 0 }}
      className="fixed top-0 left-0 right-0 z-[100] px-4 py-3"
      style={{
        backgroundColor: popup.background_color || "#3b82f6",
        color: popup.text_color || "#ffffff",
      }}
    >
      <div className="container mx-auto flex items-center justify-center gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <span className="font-bold">{popup.title}</span>
          <span className="opacity-90">{popup.content}</span>
        </div>
        {popup.button_text && (
          <Button
            onClick={onButtonClick}
            variant="secondary"
            size="sm"
          >
            {popup.button_text}
          </Button>
        )}
        {popup.show_close_button && (
          <button
            onClick={onDismiss}
            className="p-1 rounded-full hover:bg-white/20 transition-colors ml-2"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </motion.div>
  );
}
