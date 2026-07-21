'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Loader2, PhoneCall, AlertCircle, X, Clock, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { submitServiceRequest } from '@/hooks/useServiceRequests';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

type LoadingState = 'idle' | 'preparing' | 'connecting' | 'sending' | 'waiting' | 'success' | 'error';
type ErrorType = 'auth' | 'network' | 'supabase' | 'unknown' | null;

const SERVICE_MAP: Record<string, string> = {
  'buy': 'buy_for_me',
  'transfer': 'exchange',
  'global': 'global_payments',
  'ticket': 'train_booking',
  'train': 'train_booking',
  'call': 'support', // support is used for general contact/calls
  'help': 'support',
  'medical': 'medical',
};

export default function InstaOrderPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const type = searchParams.get('type') || 'buy';
  const serviceSlug = SERVICE_MAP[type] || 'support_request';
  
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');
  const [errorType, setErrorType] = useState<ErrorType>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [referenceId, setReferenceId] = useState('');
  const [orderId, setOrderId] = useState<string | null>(null);
  const [realtimeStatus, setRealtimeStatus] = useState('Submitted');
  const [adminName, setAdminName] = useState('');
  const initialized = useRef(false);

  const getTitle = () => {
    switch (type) {
      case 'buy': return '1-Tap Buy';
      case 'transfer': return 'Instant Transfer';
      case 'global': return 'Global Payment';
      case 'ticket': return 'Ticket Booking';
      case 'call': return 'Call Me';
      case 'medical': return '1-Tap Medical';
      default: return 'Quick Action';
    }
  };

  const getLoadingText = () => {
    switch (loadingState) {
      case 'preparing': return 'Preparing Request...';
      case 'connecting': return 'Connecting...';
      case 'sending': return 'Sending to Server...';
      case 'waiting': return 'Waiting for Confirmation...';
      default: return '';
    }
  };

  const startProcess = useCallback(async () => {
    setErrorType(null);
    setLoadingState('preparing');
    
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    
    if (!session || authError) {
      setErrorType('auth');
      setLoadingState('error');
      return;
    }

    setLoadingState('connecting');
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (!navigator.onLine) {
      setErrorType('network');
      setLoadingState('error');
      return;
    }

    setLoadingState('sending');
    await new Promise(resolve => setTimeout(resolve, 700));

    const metadata = {
      is_insta_order: true,
      source: "quick_action",
      platform: "web",
      initiated_from: "floating_button",
      app_version: "1.0",
      priority: "normal"
    };

    const { data, error } = await submitServiceRequest({
      serviceSlug,
      metadata,
      notes: "Auto-generated Insta Order"
    });

    setLoadingState('waiting');
    
    if (error) {
      await new Promise(resolve => setTimeout(resolve, 800));
      if (error.includes('Not authenticated')) {
         setErrorType('auth');
      } else {
         setErrorType('supabase');
         setErrorMessage(error);
      }
      setLoadingState('error');
      return;
    }

    if (data) {
       setOrderId(data.id);
       const shortId = data.id.substring(0, 8).toUpperCase();
       setReferenceId(`CVT-${shortId}`);
    } else {
       setReferenceId(`CVT-${Math.floor(100000 + Math.random() * 900000)}`);
    }

    await new Promise(resolve => setTimeout(resolve, 600));
    setLoadingState('success');
  }, [serviceSlug]);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    startProcess();
  }, [startProcess]);

  useEffect(() => {
    if (!orderId || loadingState !== 'success') return;

    const channel = supabase
      .channel(`order-${orderId}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'service_requests', filter: `id=eq.${orderId}` },
        async (payload) => {
          if (payload.new.status === 'Accepted' && realtimeStatus !== 'Accepted') {
            setRealtimeStatus('Accepted');
            
            if (payload.new.assigned_staff_id) {
              const { data } = await supabase
                .from('profiles')
                .select('full_name')
                .eq('id', payload.new.assigned_staff_id)
                .single();
              if (data?.full_name) {
                setAdminName(data.full_name);
              }
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId, loadingState, realtimeStatus]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-md w-full bg-card border-4 border-foreground p-8 rounded-2xl shadow-[8px_8px_0px_var(--color-foreground)] text-center relative overflow-hidden"
      >
        <h1 className="text-2xl font-heading uppercase tracking-wider mb-8">{getTitle()}</h1>
        
        <AnimatePresence mode="wait">
          {['preparing', 'connecting', 'sending', 'waiting'].includes(loadingState) && (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center space-y-6 min-h-[200px]"
            >
              <Loader2 className="w-16 h-16 text-primary animate-spin" />
              <div className="space-y-2">
                <h2 className="text-xl font-bold uppercase tracking-wider">{getLoadingText()}</h2>
                <p className="text-muted-foreground text-sm font-medium">Please wait while we notify our admins...</p>
              </div>
            </motion.div>
          )}

          {loadingState === 'error' && errorType === 'auth' && (
            <motion.div 
              key="error-auth"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center space-y-6 min-h-[200px]"
            >
              <div className="w-16 h-16 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center border-4 border-foreground shadow-[4px_4px_0px_var(--color-foreground)]">
                <AlertCircle className="w-8 h-8" />
              </div>
              <div className="space-y-3">
                <h2 className="text-xl font-bold uppercase tracking-wider text-yellow-600">⚠ Login Required</h2>
                <p className="font-medium text-muted-foreground leading-relaxed px-4 text-sm">
                  To place an Insta Order we need your account so our support team can contact you.
                </p>
              </div>
              <div className="flex gap-4 w-full mt-4">
                <Button 
                  onClick={() => router.push('/')}
                  variant="outline"
                  className="w-1/2 h-12 text-sm font-bold uppercase tracking-widest border-2 border-foreground"
                >
                  Cancel
                </Button>
                <Link href="/login" className="w-1/2">
                  <Button 
                    className="w-full h-12 text-sm font-bold uppercase tracking-widest border-2 border-foreground shadow-[4px_4px_0px_var(--color-foreground)]"
                  >
                    Login
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}

          {loadingState === 'error' && errorType !== 'auth' && (
            <motion.div 
              key="error-other"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center space-y-6 min-h-[200px]"
            >
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center border-4 border-foreground shadow-[4px_4px_0px_var(--color-foreground)]">
                <X className="w-8 h-8" />
              </div>
              <div className="space-y-3">
                <h2 className="text-xl font-bold uppercase tracking-wider text-red-600">
                  {errorType === 'network' ? 'Network Error' : 'Server Error'}
                </h2>
                <p className="font-medium text-muted-foreground leading-relaxed px-4 text-sm">
                  {errorType === 'network' 
                    ? 'Unable to reach server. Check your connection.' 
                    : 'Server temporarily unavailable. Please try again.'}
                </p>
                {errorMessage && (
                  <p className="text-xs text-red-500/70">{errorMessage}</p>
                )}
              </div>
              <div className="flex gap-4 w-full mt-4">
                <Button 
                  onClick={() => router.push('/')}
                  variant="outline"
                  className="w-1/2 h-12 text-sm font-bold uppercase tracking-widest border-2 border-foreground"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={() => startProcess()}
                  className="w-1/2 h-12 text-sm font-bold uppercase tracking-widest border-2 border-foreground shadow-[4px_4px_0px_var(--color-foreground)]"
                >
                  Try Again
                </Button>
              </div>
            </motion.div>
          )}

          {loadingState === 'success' && (
            <motion.div 
              key="success"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center space-y-6 min-h-[200px]"
            >
              <div className="relative">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", bounce: 0.5 }}
                >
                  <CheckCircle2 className="w-20 h-20 text-emerald-500" />
                </motion.div>
                <motion.div
                  className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground p-2 rounded-full border-2 border-foreground"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.3, type: "spring" }}
                >
                  <PhoneCall className="w-5 h-5" />
                </motion.div>
              </div>
              
              <div className="space-y-1 text-center w-full">
                <h2 className="text-2xl font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  {realtimeStatus === 'Accepted' ? '✅ Accepted!' : '✅ Order Submitted'}
                </h2>
                {realtimeStatus === 'Accepted' && (
                  <p className="text-sm font-bold text-emerald-700 dark:text-emerald-300 mt-1">
                    Your Insta Order has been accepted.
                  </p>
                )}
                
                <div className="grid grid-cols-2 gap-3 mt-6 text-left bg-muted/50 p-4 rounded-xl border-2 border-foreground/10">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1">
                       Reference
                    </span>
                    <p className="font-black text-sm">{referenceId}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1">
                       Status
                    </span>
                    <p className="font-black text-sm text-blue-500 flex items-center gap-1">
                       <span className={`w-2 h-2 rounded-full ${realtimeStatus === 'Accepted' ? 'bg-green-500' : 'bg-blue-500'} inline-block animate-pulse`}></span> {realtimeStatus}
                    </p>
                  </div>
                  
                  {realtimeStatus === 'Accepted' && (
                    <div className="col-span-2 space-y-1 pt-2 border-t-2 border-foreground/10 mt-1">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1">
                         Executive
                      </span>
                      <p className="font-black text-sm">{adminName || 'Support Team'}</p>
                    </div>
                  )}

                  <div className="col-span-2 space-y-1 pt-2 border-t-2 border-foreground/10 mt-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1">
                       <Clock className="w-3 h-3" /> Estimated Callback
                    </span>
                    <p className="font-black text-sm">3 Minutes</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 w-full mt-4">
                <Button 
                  onClick={() => router.push('/track')}
                  className="w-1/2 h-12 text-sm font-bold uppercase tracking-widest border-2 border-foreground shadow-[4px_4px_0px_var(--color-foreground)] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all active:translate-y-2 active:translate-x-2"
                >
                  <Navigation className="w-4 h-4 mr-2" /> Track
                </Button>
                <Button 
                  onClick={() => router.push('/')}
                  variant="outline"
                  className="w-1/2 h-12 text-sm font-bold uppercase tracking-widest border-2 border-foreground hover:bg-muted transition-colors"
                >
                  Close
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
