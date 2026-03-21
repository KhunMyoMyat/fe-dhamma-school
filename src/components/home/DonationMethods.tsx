import React, { useState } from "react";
import { Copy, Check, Eye, ShieldCheck, Landmark } from "lucide-react";
import { useTranslation } from "@/providers/LanguageProvider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

interface BankAccount {
  id: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  qrImage: string;
  logoUrl?: string;
  bankKey: string;
}

const donationAccounts: BankAccount[] = [
  {
    id: "kbz",
    bankName: "KBZ Bank",
    bankKey: "kbz",
    accountName: "Dhamma School Foundation",
    accountNumber: "123-456-789012",
    qrImage: "/images/donation/kbzpay_qr.png",
  },
  {
    id: "cb",
    bankName: "CB Bank",
    bankKey: "cb",
    accountName: "Dhamma School Foundation",
    accountNumber: "987-654-321098",
    qrImage: "/images/donation/cb_qr.png",
  },
  {
    id: "aya",
    bankName: "AYA Bank",
    bankKey: "aya",
    accountName: "Dhamma School Foundation",
    accountNumber: "555-444-333222",
    qrImage: "/images/donation/aya_qr.png",
  },
];

const DonationMethods = () => {
  const { t, language } = useTranslation();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success(language === "mm" ? "အကောင့်နံပါတ်ကို ကူးယူပြီးပါပြီ" : "Account number copied!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const maskNumber = (num: string) => {
    if (num.length <= 8) return num;
    const cleaned = num.replace(/-/g, "");
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-XXXXXX`;
  };

  return (
    <div className="max-w-6xl mx-auto mt-20">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-black text-maroon mb-4 font-myanmar">
          {t("donate.bank.title")}
        </h2>
        <div className="flex items-center justify-center gap-2 text-green-600 font-bold bg-green-50 w-fit mx-auto px-6 py-2 rounded-full border border-green-100 shadow-sm">
          <ShieldCheck className="size-5" />
          <span className="text-sm">{language === "mm" ? "တရားဝင် ဘဏ်အကောင့်များ ဖြစ်ပါသည်" : "Verified Official Accounts"}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {donationAccounts.map((account, index) => (
          <motion.div 
            key={account.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-[2.5rem] p-8 border border-gold/10 shadow-xl shadow-gold/5 hover:shadow-gold/10 transition-all group"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="size-12 rounded-2xl bg-gold/10 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-white transition-colors">
                <Landmark className="size-6" />
              </div>
              <div>
                <p className="text-[10px] font-black text-gold/60 uppercase tracking-widest">
                  {t(`donate.bank.${account.bankKey}`)}
                </p>
                <h3 className="text-lg font-bold text-navy">{account.bankName}</h3>
              </div>
            </div>

            <p className="text-sm font-bold text-maroon/60 mb-4 px-1">{account.accountName}</p>
            
            <div className="flex items-center gap-3 bg-cream/30 p-4 rounded-2xl border border-gold/5 mb-6">
              <div className="flex-1 font-mono font-bold text-navy/70 tracking-wider">
                {maskNumber(account.accountNumber)}
              </div>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => copyToClipboard(account.accountNumber, account.id)}
                className="hover:bg-gold/10 hover:text-gold text-navy/20 transition-all hover:scale-110"
              >
                {copiedId === account.id ? <Check className="size-4" /> : <Copy className="size-4" />}
              </Button>
            </div>

            <Dialog>
              <DialogTrigger
                render={
                  <Button className="w-full bg-navy hover:bg-maroon text-white font-bold rounded-xl h-12 transition-all">
                    <Eye className="mr-2 size-4" />
                    {language === "mm" ? "QR Code ကြည့်မည်" : "View QR Code"}
                  </Button>
                }
              />
              <DialogContent className="bg-white border-gold/20 rounded-[2.5rem] max-w-sm">
                <DialogHeader>
                  <DialogTitle className="text-center text-maroon font-bold text-xl">
                    {account.bankName} (Official QR)
                  </DialogTitle>
                </DialogHeader>
                <div className="relative aspect-square w-full mt-4 bg-cream/20 rounded-3xl p-6 border-2 border-dashed border-gold/20 overflow-hidden">
                  <div className="relative w-full h-full flex items-center justify-center">
                    <img 
                      src={account.qrImage} 
                      alt="QR Code" 
                      className="object-contain w-full h-full"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://placehold.co/400x400?text=Please+Upload+QR";
                      }}
                    />
                  </div>
                  
                  {/* Security Watermark */}
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.03] rotate-[-35deg]">
                    <span className="text-4xl font-black text-navy select-none whitespace-nowrap">
                      DHAMMA SCHOOL FOUNDATION
                    </span>
                  </div>
                </div>
                <p className="text-[10px] text-center text-navy/40 mt-6 px-4 font-myanmar leading-relaxed italic">
                  {language === "mm" 
                    ? "* ဤ QR Code သည် ဓမ္မကျောင်းတော် လှူဒါန်းရန်အတွက်သာ ဖြစ်ပါသည်။ အခြားသို့ လွှဲပြောင်းအသုံးပြုခြင်း မပြုရ။"
                    : "* This QR code is officially and exclusively for Dhamma School donations."}
                </p>
              </DialogContent>
            </Dialog>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default DonationMethods;
