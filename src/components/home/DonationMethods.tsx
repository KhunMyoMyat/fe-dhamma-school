"use strict";

import React, { useState } from "react";
import Image from "next/image";
import { Copy, Check, Eye, ExternalLink, ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface BankAccount {
  id: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  qrImage: string;
  logo: string;
}

const donationAccounts: BankAccount[] = [
  {
    id: "kbz",
    bankName: "KBZ Pay",
    accountName: "U Aung Myo (Dhamma School)",
    accountNumber: "09971234567",
    qrImage: "/images/payments/kpay-qr.png", // ပုံအမှန်ထည့်ရန်
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/8/8c/KBZ_Bank_logo.png/220px-KBZ_Bank_logo.png",
  },
  {
    id: "cb",
    bankName: "CB Bank",
    accountName: "U Aung Myo",
    accountNumber: "0011223344556677",
    qrImage: "/images/payments/cb-qr.png", // ပုံအမှန်ထည့်ရန်
    logo: "https://www.cbbank.com.mm/images/cb_bank_logo.png",
  },
];

const DonationMethods = () => {
  const { t, i18n } = useTranslation();
  const language = i18n.language;
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success(language === "mm" ? "အကောင့်နံပါတ်ကို ကူးယူပြီးပါပြီ" : "Account number copied!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const maskNumber = (num: string) => {
    if (num.length <= 8) return num;
    return `${num.slice(0, 4)} **** **** ${num.slice(-4)}`;
  };

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-gold mb-6 font-myanmar">
          {language === "mm" ? "အလှူတော်ငွေများ ပေးပို့လှူဒါန်းရန်" : "Ways to Donate"}
        </h2>
        <p className="text-cream/60 max-w-2xl mx-auto text-lg">
          {language === "mm" 
            ? "ဓမ္မကျောင်းတော်ကြီး ရေရှည်တည်တံ့ခိုင်မြဲစေရန် အောက်ပါ ဘဏ်အကောင့်များမှတစ်ဆင့် ပါဝင်လှူဒါန်းနိုင်ပါသည်။"
            : "Support our Dhamma School through these verified and secure banking channels."}
        </p>
        
        {/* Security Badge */}
        <div className="flex items-center justify-center gap-2 mt-6 text-green-400/80 text-sm font-medium bg-green-400/5 w-fit mx-auto px-4 py-2 rounded-full border border-green-400/20">
          <ShieldCheck className="size-4" />
          <span>{language === "mm" ? "လုံခြုံစိတ်ချရသော တရားဝင်အကောင့်များသာ ဖြစ်ပါသည်" : "Verified Official Bank Accounts"}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {donationAccounts.map((account) => (
          <div 
            key={account.id}
            className="relative group overflow-hidden bg-white/5 border border-white/10 rounded-[2.5rem] p-8 hover:border-gold/30 transition-all duration-500 backdrop-blur-sm"
          >
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-gold/10 transition-all" />

            <div className="flex items-start gap-6">
              {/* Bank Logo */}
              <div className="relative size-16 rounded-2xl overflow-hidden bg-white flex-shrink-0 border-4 border-white/10">
                <img 
                  src={account.logo} 
                  alt={account.bankName}
                  className="object-contain p-2"
                />
              </div>

              <div className="flex-1">
                <h3 className="text-xl font-bold text-cream mb-1">{account.bankName}</h3>
                <p className="text-gold font-myanmar font-medium mb-4">{account.accountName}</p>
                
                {/* Account Number Area */}
                <div className="flex items-center gap-3 bg-black/20 p-4 rounded-2xl border border-white/5 group-hover:border-gold/10 transition-all">
                  <div className="flex-1 font-mono text-lg tracking-wider text-cream/90">
                    {maskNumber(account.accountNumber)}
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => copyToClipboard(account.accountNumber, account.id)}
                    className="hover:bg-gold/10 hover:text-gold text-cream/40 transition-all"
                  >
                    {copiedId === account.id ? <Check className="size-4" /> : <Copy className="size-4" />}
                  </Button>
                </div>

                <div className="flex gap-4 mt-6">
                  {/* QR Display with Dialog Protection */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="flex-1 bg-gold hover:bg-gold-light text-navy font-bold rounded-xl h-12">
                        <Eye className="mr-2 size-4" />
                        {language === "mm" ? "QR Code ကြည့်မည်" : "View QR Code"}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-navy border-gold/20 text-cream rounded-[2rem] max-w-sm">
                      <DialogHeader>
                        <DialogTitle className="text-center text-gold font-myanmar">
                          {account.bankName} - Official QR
                        </DialogTitle>
                      </DialogHeader>
                      <div className="relative aspect-square w-full mt-4 bg-white rounded-2xl p-4 overflow-hidden">
                        {/* QR Image Placeholder - Replace with actual images */}
                        <div className="relative w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
                           <span className="text-gray-400 text-xs text-center p-4">
                             [ QR Image with Watermark ]<br/>
                             (Security Protected)
                           </span>
                           {/* ဒီနေရာမှာ Image Component ထည့်ပါ */}
                           {/* <Image src={account.qrImage} alt="QR Code" fill className="object-contain" /> */}
                        </div>
                        
                        {/* Overlay Watermark for Security */}
                        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-10 rotate-45">
                          <span className="text-2xl font-bold text-navy select-none">DHAMMA SCHOOL</span>
                        </div>
                      </div>
                      <p className="text-xs text-center text-cream/40 mt-4 px-4 font-myanmar leading-relaxed">
                        {language === "mm" 
                          ? "* ဤ QR Code သည် ဓမ္မကျောင်းတော် အတွက်သာ ဖြစ်ပါသည်။ ငွေလွှဲရာတွင် အမည်ကို သေချာစွာ စစ်ဆေးပေးပါရန် မေတ္တာရပ်ခံအပ်ပါသည်။"
                          : "* This QR code is officially for Dhamma School. Please verify the account name before completing the transaction."}
                      </p>
                    </DialogContent>
                  </Dialog>

                  <Button variant="outline" className="size-12 rounded-xl border-white/10 hover:border-gold/50">
                    <ExternalLink className="size-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* General Security Advice */}
      <div className="mt-12 p-6 bg-maroon/10 border border-maroon/20 rounded-3xl text-center">
        <p className="text-cream/50 text-sm font-myanmar">
          {language === "mm"
            ? "မှတ်ချက် - အလှူရှင်များအနေဖြင့် အထက်ပါတရားဝင် အကောင့်များသို့သာ တိုက်ရိုက်လှူဒါန်းပေးပါရန် အသိပေးအပ်ပါသည်။"
            : "Note: Please donate only to the official accounts listed above for security purposes."}
        </p>
      </div>
    </section>
  );
};

export default DonationMethods;
