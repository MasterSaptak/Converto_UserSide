'use client';
import { useState } from "react";

const SAVED_RECIPIENTS = [
  {
    id: '1',
    name: 'Acme Corp',
    country: 'United States',
    bankName: 'Chase Bank',
    accountNumber: '123456789',
    swiftCode: 'CHASUS33'
  },
  {
    id: '2',
    name: 'Global Tech Ltd',
    country: 'United Kingdom',
    bankName: 'Barclays',
    accountNumber: 'GB98BARC20114412345678',
    swiftCode: 'BARCGB22'
  }
];

export default function GlobalPaymentsPage() {
  const [formData, setFormData] = useState({
    recipientName: '',
    country: 'United States',
    bankName: '',
    accountNumber: '',
    swiftCode: '',
  });

  const handleLoadRecipient = (id: string) => {
    const recipient = SAVED_RECIPIENTS.find(r => r.id === id);
    if (recipient) {
      setFormData({
        recipientName: recipient.name,
        country: recipient.country,
        bankName: recipient.bankName,
        accountNumber: recipient.accountNumber,
        swiftCode: recipient.swiftCode
      });
    }
  };

  return (
    <div className="flex-1 flex flex-col gap-8 md:gap-10 animate-in fade-in duration-500 pb-10">
      <header className="border-b-2 border-foreground pb-6">
        <span className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-60 mb-2 block">Services</span>
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold font-heading uppercase leading-[0.9] tracking-tight">Global Payments</h1>
      </header>
      
      <div className="grid lg:grid-cols-[1fr_400px] gap-8">
        
        {/* Form */}
        <div className="flex flex-col gap-6">
          <div className="border-2 border-foreground bg-white p-6">
            <h2 className="font-bold uppercase tracking-widest text-sm mb-6 border-b-2 border-foreground pb-2">Beneficiary Details</h2>
            
            <div className="flex flex-col gap-6">
              
              <div className="flex flex-col gap-2 pb-6 mb-2 border-b-2 border-foreground border-dashed">
                <label className="text-[10px] font-bold uppercase tracking-widest opacity-60 text-emerald-700">Quick Fill (Optional)</label>
                <select 
                  className="border-2 border-foreground p-3 bg-emerald-50/50 text-sm font-bold uppercase outline-none focus:border-primary"
                  onChange={(e) => handleLoadRecipient(e.target.value)}
                  defaultValue=""
                >
                  <option value="" disabled>Select a saved recipient...</option>
                  {SAVED_RECIPIENTS.map(r => (
                    <option key={r.id} value={r.id}>{r.name} - {r.bankName}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Recipient Name / Company Name</label>
                <input 
                  type="text" 
                  placeholder="Account Holder Name" 
                  className="border-2 border-foreground p-3 text-sm font-bold uppercase outline-none focus:border-primary"
                  value={formData.recipientName}
                  onChange={(e) => setFormData({...formData, recipientName: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Recipient Country</label>
                  <select 
                    className="border-2 border-foreground p-3 min-h-[48px] bg-secondary text-sm font-bold uppercase outline-none focus:border-primary"
                    value={formData.country}
                    onChange={(e) => setFormData({...formData, country: e.target.value})}
                  >
                    <option>United States</option>
                    <option>United Kingdom</option>
                    <option>European Union</option>
                    <option>India</option>
                    <option>Bangladesh</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Bank Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Chase Bank" 
                    className="border-2 border-foreground p-3 min-h-[48px] text-sm font-bold uppercase outline-none focus:border-primary"
                    value={formData.bankName}
                    onChange={(e) => setFormData({...formData, bankName: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">IBAN / Account Number</label>
                  <input 
                    type="text" 
                    placeholder="Account Number" 
                    className="border-2 border-foreground p-3 min-h-[48px] text-sm font-bold uppercase outline-none focus:border-primary font-mono"
                    value={formData.accountNumber}
                    onChange={(e) => setFormData({...formData, accountNumber: e.target.value})}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">SWIFT / BIC Code</label>
                  <input 
                    type="text" 
                    placeholder="SWIFT Code" 
                    className="border-2 border-foreground p-3 min-h-[48px] text-sm font-bold uppercase outline-none focus:border-primary font-mono"
                    value={formData.swiftCode}
                    onChange={(e) => setFormData({...formData, swiftCode: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t-2 border-dashed border-muted pt-4 mt-2">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Transfer Currency</label>
                  <select defaultValue="BDT - Bangladeshi Taka" className="border-2 border-foreground p-3 min-h-[48px] bg-secondary text-sm font-bold uppercase outline-none focus:border-primary">
                    <option>USD - US Dollar</option>
                    <option>EUR - Euro</option>
                    <option>GBP - British Pound</option>
                    <option>BDT - Bangladeshi Taka</option>
                    <option>INR - Indian Rupee</option>
                    <option>CNY - Chinese Yuan</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Amount to Transfer</label>
                  <input type="number" placeholder="0.00" className="border-2 border-foreground p-3 min-h-[48px] text-sm font-bold uppercase outline-none focus:border-primary font-mono" />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Purpose of Transfer</label>
                <select className="border-2 border-foreground p-3 min-h-[48px] text-sm font-bold uppercase outline-none focus:border-primary">
                  <option>Business Invoice Payment</option>
                  <option>Family / Friend Support</option>
                  <option>Medical Expenses</option>
                  <option>Property Purchase</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Upload Supporting Document / Invoice</label>
                <div className="border-2 border-dashed border-foreground p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-secondary/50 transition-colors">
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Upload files (optional)</span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Payment Reference (For Receiver)</label>
                <input type="text" placeholder="e.g. INV-2024-10" className="border-2 border-foreground p-3 text-sm font-bold uppercase outline-none focus:border-primary font-mono" />
              </div>
            </div>
          </div>
        </div>

        {/* Summary Sidebar */}
        <div className="flex flex-col gap-6">
          <div className="border-2 border-foreground bg-primary text-primary-foreground p-6 sticky top-24">
            <h2 className="font-bold uppercase tracking-widest text-sm mb-6 border-b-2 border-white/20 pb-2">Transfer Summary</h2>
            
            <div className="flex flex-col gap-4 text-xs font-bold uppercase mb-8">
               <p className="opacity-80">1. Submit the transfer details and beneficiary information securely.</p>
               <p className="opacity-80">2. Our compliance team verifies the transaction swiftly.</p>
               <p className="opacity-80">3. Funds are deposited locally into the recipient&apos;s bank account.</p>
            </div>

            <div className="flex flex-col gap-2 mb-8 text-[10px] uppercase font-bold tracking-widest opacity-80">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                Zero Hidden Bank Fees
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                Trackable Wire Transfer
              </div>
            </div>

            <button className="w-full border-2 border-foreground bg-white text-foreground p-4 font-bold uppercase tracking-widest text-sm hover:-translate-y-1 hover:shadow-[4px_4px_0px_var(--color-foreground)] transition-all">
              Initialize Transfer
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
