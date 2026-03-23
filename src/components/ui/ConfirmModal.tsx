"use client";

import { AlertTriangle, Info, CheckCircle2 } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info" | "success";
  isLoading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  isLoading = false,
}: ConfirmModalProps) {
  const icons = {
    danger: <AlertTriangle className="size-10 text-red-500" />,
    warning: <AlertTriangle className="size-10 text-amber-500" />,
    info: <Info className="size-10 text-blue-500" />,
    success: <CheckCircle2 className="size-10 text-green-500" />,
  };

  const colors = {
    danger: "bg-red-500 hover:bg-red-600 shadow-red-200 text-white",
    warning: "bg-amber-500 hover:bg-amber-600 shadow-amber-200 text-white",
    info: "bg-blue-500 hover:bg-blue-600 shadow-blue-200 text-white",
    success: "bg-green-500 hover:bg-green-600 shadow-green-200 text-white",
  };

  const bgColors = {
    danger: "bg-red-50",
    warning: "bg-amber-50",
    info: "bg-blue-50",
    success: "bg-green-50",
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[400px] p-0 overflow-hidden border-none bg-white rounded-[2.5rem] shadow-2xl">
        <div className="p-10 pb-6 flex flex-col items-center text-center">
            <motion.div 
               initial={{ scale: 0.5, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               className={`size-24 rounded-[2.5rem] flex items-center justify-center mb-8 ${bgColors[variant]}`}
            >
                {icons[variant]}
            </motion.div>
            
            <h2 className="text-3xl font-black text-navy mb-3 tracking-tighter uppercase">
                {title}
            </h2>
            <p className="text-navy/50 font-medium leading-relaxed px-2">
                {description}
            </p>
        </div>

        <div className="p-10 pt-4 grid grid-cols-2 gap-4">
            <Button 
                variant="ghost" 
                onClick={onClose}
                className="h-14 rounded-2xl font-bold text-navy/40 hover:bg-navy/5"
                disabled={isLoading}
            >
                {cancelText}
            </Button>
            <Button 
                onClick={onConfirm}
                disabled={isLoading}
                className={`h-14 rounded-2xl font-black shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 ${colors[variant]}`}
            >
                {isLoading ? (
                  <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : confirmText}
            </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
