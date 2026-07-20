/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ShoppingBag, ArrowRight, ArrowLeft, Loader2, Link as LinkIcon, Info, MapPin, ChevronDown, Globe } from 'lucide-react'
import { submitServiceRequest } from '@/hooks/useServiceRequests'
import { useForm } from 'react-hook-form'
import { RewardsWidget } from '@/components/dashboard/RewardsWidget'

interface FormData {
  website: string;
  productName: string;
  productUrl: string;
  productImage: string;
  quantity: string;
  variant: string;
  notes: string;
  color: string;
  size: string;
  shippingAddress: {
    name: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    country: string;
    zip_code: string;
  }
}

export default function BuyForMePage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [websiteDropdownOpen, setWebsiteDropdownOpen] = useState(false)

  const websites = [
    { name: 'Amazon', domain: 'amazon.com' },
    { name: 'eBay', domain: 'ebay.com' },
    { name: 'AliExpress', domain: 'aliexpress.com' },
    { name: 'BestBuy', domain: 'bestbuy.com' },
    { name: 'Flipkart', domain: 'flipkart.com' },
    { name: 'Other', domain: '' },
  ]

  const { register, handleSubmit, watch, setValue } = useForm<FormData>({
    defaultValues: {
      website: '',
      productName: '',
      productUrl: '',
      productImage: '',
      quantity: '1',
      variant: '',
      notes: '',
      color: '',
      size: '',
      shippingAddress: {
        name: '',
        phone: '',
        street: '',
        city: '',
        state: '',
        country: '',
        zip_code: ''
      }
    }
  })

  // Watch values needed for UI changes (Review Step)
  const watchAllFields = watch()

  const handleNext = () => setStep(s => s + 1)
  const handlePrev = () => setStep(s => s - 1)

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    setError(null)
    
    try {
      const { data: requestData, error: submitError } = await submitServiceRequest({
        serviceSlug: 'buy_for_me',
        metadata: {
          website: data.website,
          product_url: data.productUrl,
          product_name: data.productName,
          product_image: data.productImage,
          variant: data.variant,
          notes: data.notes,
          specifications: {
            quantity: parseInt(data.quantity) || 1,
            color: data.color,
            size: data.size,
          },
          shipping_address: data.shippingAddress
        },
        notes: data.notes || `Buy For Me Request: ${data.productName}`,
        currency: 'USD'
      })

      if (submitError || !requestData) {
        throw new Error(submitError || 'Failed to submit request')
      }

      router.push('/track')
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 animate-in fade-in duration-500">
      
      <div className="mb-10 text-center">
        <div className="inline-flex w-16 h-16 border-2 border-foreground bg-primary items-center justify-center mb-6 shadow-[4px_4px_0px_var(--color-foreground)]">
          <ShoppingBag className="w-8 h-8 text-primary-foreground" />
        </div>
        <h1 className="text-4xl font-black uppercase tracking-tighter">Buy For Me</h1>
        <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mt-2">Paste a link, we handle the rest</p>
      </div>

      <div className="mb-8 max-w-sm mx-auto">
        <RewardsWidget />
      </div>

      <div className="flex gap-2 mb-8">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className={`h-2 flex-1 border-2 border-foreground transition-colors ${step >= i ? 'bg-primary' : 'bg-transparent'}`} />
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="brutal-card bg-white p-6 md:p-8 space-y-8">
        {error && (
          <div className="bg-red-100 border-2 border-red-500 text-red-700 p-4 font-bold text-sm">
            {error}
          </div>
        )}

        {/* STEP 1: Product */}
        <div className={step === 1 ? 'block animate-in slide-in-from-right-4 duration-300' : 'hidden'}>
          <h2 className="text-2xl font-black uppercase tracking-tight mb-6">1. Product Details</h2>
          
          <div className="space-y-6">
            <div className="bg-blue-50 border-2 border-blue-200 p-4 text-xs font-bold text-blue-800 flex gap-3">
              <Info className="w-5 h-5 shrink-0" />
              Provide the details of the product you want us to buy for you.
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2 relative">
                <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Website</label>
                <div 
                  className="w-full p-4 border-2 border-black font-bold outline-none bg-white flex items-center justify-between cursor-pointer focus-within:ring-2 ring-primary"
                  onClick={() => setWebsiteDropdownOpen(!websiteDropdownOpen)}
                >
                  <div className="flex items-center gap-3">
                    {watchAllFields.website ? (
                       websites.find(w => w.name === watchAllFields.website)?.domain ? (
                         <img src={`https://www.google.com/s2/favicons?sz=64&domain=${websites.find(w => w.name === watchAllFields.website)?.domain}`} alt="" className="w-6 h-6 object-contain" />
                       ) : <Globe className="w-6 h-6 opacity-60" />
                    ) : null}
                    <span>{watchAllFields.website || 'Select Website...'}</span>
                  </div>
                  <ChevronDown className={`w-5 h-5 transition-transform ${websiteDropdownOpen ? 'rotate-180' : ''}`} />
                </div>
                {websiteDropdownOpen && (
                  <div className="absolute top-[calc(100%+4px)] left-0 right-0 bg-white border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] z-50">
                    <div className="max-h-[240px] overflow-y-auto">
                      {websites.map(site => (
                        <div 
                          key={site.name}
                          className="p-4 flex items-center gap-3 hover:bg-black hover:text-white cursor-pointer border-b-2 border-black last:border-b-0 transition-colors"
                          onClick={() => {
                            setValue('website', site.name, { shouldValidate: true })
                            setWebsiteDropdownOpen(false)
                          }}
                        >
                          {site.domain ? (
                            <img src={`https://www.google.com/s2/favicons?sz=64&domain=${site.domain}`} alt="" className="w-6 h-6 object-contain bg-white rounded-sm" />
                          ) : (
                            <Globe className="w-6 h-6 opacity-60" />
                          )}
                          <span className="font-bold">{site.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {/* Hidden input to ensure validation works with react-hook-form if needed */}
                <input type="hidden" {...register('website', { required: true })} />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Product Name</label>
                <input 
                  type="text"
                  {...register('productName', { required: true })}
                  placeholder="e.g. iPhone 15 Pro Max"
                  className="w-full p-4 border-2 border-black font-bold focus:ring-2 ring-primary outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Product URL</label>
              <div className="flex">
                <div className="bg-slate-100 border-y-2 border-l-2 border-black p-4 flex items-center justify-center">
                  <LinkIcon className="w-5 h-5" />
                </div>
                <input 
                  type="url"
                  {...register('productUrl', { required: true })}
                  placeholder="https://www.amazon.com/dp/B08N5WRWNW"
                  className="w-full p-4 border-2 border-black font-mono focus:ring-2 ring-primary outline-none"
                />
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Product Image URL (Optional)</label>
                <input 
                  type="url"
                  {...register('productImage')}
                  placeholder="https://example.com/image.jpg"
                  className="w-full p-4 border-2 border-black font-mono focus:ring-2 ring-primary outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Quantity</label>
                <input 
                  type="number"
                  min="1"
                  {...register('quantity', { required: true })}
                  className="w-full p-4 border-2 border-black font-bold focus:ring-2 ring-primary outline-none"
                />
              </div>
            </div>
            
            <button 
              type="button"
              onClick={handleNext}
              disabled={!watchAllFields.productUrl || !watchAllFields.website || !watchAllFields.productName}
              className="w-full brutal-button bg-black text-white flex items-center justify-center gap-2 disabled:opacity-50"
            >
              Next Step <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* STEP 2: Shipping */}
        <div className={step === 2 ? 'block animate-in slide-in-from-right-4 duration-300' : 'hidden'}>
          <h2 className="text-2xl font-black uppercase tracking-tight mb-6">2. Shipping Details</h2>
          
          <div className="space-y-6 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Full Name</label>
                <input 
                  type="text"
                  {...register('shippingAddress.name', { required: true })}
                  placeholder="John Doe"
                  className="w-full p-4 border-2 border-black font-bold focus:ring-2 ring-primary outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Mobile Number</label>
                <input 
                  type="tel"
                  {...register('shippingAddress.phone', { required: true })}
                  placeholder="+1 234 567 8900"
                  className="w-full p-4 border-2 border-black font-bold focus:ring-2 ring-primary outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Street Address</label>
              <div className="flex">
                <div className="bg-slate-100 border-y-2 border-l-2 border-black p-4 flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <input 
                  type="text"
                  {...register('shippingAddress.street', { required: true })}
                  placeholder="123 Delivery St, Apt 4B"
                  className="w-full p-4 border-2 border-black font-bold focus:ring-2 ring-primary outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest opacity-60">City</label>
                <input 
                  type="text"
                  {...register('shippingAddress.city', { required: true })}
                  className="w-full p-4 border-2 border-black font-bold focus:ring-2 ring-primary outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest opacity-60">State/Province</label>
                <input 
                  type="text"
                  {...register('shippingAddress.state', { required: true })}
                  className="w-full p-4 border-2 border-black font-bold focus:ring-2 ring-primary outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest opacity-60">ZIP/Postal Code</label>
                <input 
                  type="text"
                  {...register('shippingAddress.zip_code', { required: true })}
                  className="w-full p-4 border-2 border-black font-bold focus:ring-2 ring-primary outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Country</label>
                <input 
                  type="text"
                  {...register('shippingAddress.country', { required: true })}
                  className="w-full p-4 border-2 border-black font-bold focus:ring-2 ring-primary outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button type="button" onClick={handlePrev} className="p-4 border-2 border-black hover:bg-slate-100 transition-colors font-black uppercase tracking-widest flex items-center justify-center">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button 
              type="button" 
              onClick={handleNext}
              className="flex-1 brutal-button bg-black text-white flex items-center justify-center gap-2"
            >
              Additional Details <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* STEP 3: Additional Details */}
        <div className={step === 3 ? 'block animate-in slide-in-from-right-4 duration-300' : 'hidden'}>
          <h2 className="text-2xl font-black uppercase tracking-tight mb-6">3. Additional Details</h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Variant/Model (Optional)</label>
              <input 
                type="text"
                {...register('variant')}
                placeholder="e.g. 256GB WiFi"
                className="w-full p-4 border-2 border-black font-bold focus:ring-2 ring-primary outline-none"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Color (Optional)</label>
              <input 
                type="text"
                {...register('color')}
                placeholder="e.g. Space Gray"
                className="w-full p-4 border-2 border-black font-bold focus:ring-2 ring-primary outline-none"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Size (Optional)</label>
              <input 
                type="text"
                {...register('size')}
                placeholder="e.g. XL"
                className="w-full p-4 border-2 border-black font-bold focus:ring-2 ring-primary outline-none"
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Notes / Instructions</label>
              <textarea 
                {...register('notes')}
                placeholder="Any specific instructions for our buyers..."
                rows={4}
                className="w-full p-4 border-2 border-black font-bold focus:ring-2 ring-primary outline-none resize-none"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button type="button" onClick={handlePrev} className="p-4 border-2 border-black hover:bg-slate-100 transition-colors font-black uppercase tracking-widest flex items-center justify-center">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button 
              type="button" 
              onClick={handleNext}
              className="flex-1 brutal-button bg-black text-white flex items-center justify-center gap-2"
            >
              Review Order <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* STEP 4: Review */}
        <div className={step === 4 ? 'block animate-in slide-in-from-right-4 duration-300' : 'hidden'}>
          <h2 className="text-2xl font-black uppercase tracking-tight mb-6">4. Review Order</h2>
          
          <div className="space-y-4 mb-8">
            <div className="border-2 border-black p-4 bg-slate-50">
              <h3 className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">Product</h3>
              <div className="flex gap-4 items-center">
                {watchAllFields.productImage && (
                  <img src={watchAllFields.productImage} alt="Product" className="w-16 h-16 object-cover border-2 border-black" />
                )}
                <div>
                  <p className="font-bold text-lg">{watchAllFields.productName}</p>
                  <p className="text-sm font-mono opacity-80">{watchAllFields.website} • Qty: {watchAllFields.quantity}</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 text-sm font-bold">
                {watchAllFields.variant && <div><span className="opacity-60 font-normal">Variant:</span> {watchAllFields.variant}</div>}
                {watchAllFields.color && <div><span className="opacity-60 font-normal">Color:</span> {watchAllFields.color}</div>}
                {watchAllFields.size && <div><span className="opacity-60 font-normal">Size:</span> {watchAllFields.size}</div>}
              </div>
            </div>

            <div className="border-2 border-black p-4">
              <h3 className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">Shipping To</h3>
              <p className="font-bold">{watchAllFields.shippingAddress.name}</p>
              <p className="text-sm">{watchAllFields.shippingAddress.street}</p>
              <p className="text-sm">{watchAllFields.shippingAddress.city}, {watchAllFields.shippingAddress.state} {watchAllFields.shippingAddress.zip_code}</p>
              <p className="text-sm font-bold">{watchAllFields.shippingAddress.country} • {watchAllFields.shippingAddress.phone}</p>
            </div>

            {watchAllFields.notes && (
              <div className="border-2 border-black p-4 bg-yellow-50">
                <h3 className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">Notes</h3>
                <p className="text-sm font-bold">{watchAllFields.notes}</p>
              </div>
            )}
            
            <div className="bg-primary/10 border-2 border-primary p-4 text-sm font-bold">
              <p>When you submit this request, our team will verify availability and generate a final price quote (including estimated shipping and service fees).</p>
            </div>
          </div>

          <div className="flex gap-4">
            <button type="button" onClick={handlePrev} className="p-4 border-2 border-black hover:bg-slate-100 transition-colors font-black uppercase tracking-widest flex items-center justify-center">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="flex-1 brutal-button bg-primary text-primary-foreground flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>Submitting <Loader2 className="w-5 h-5 animate-spin" /></>
              ) : (
                <>Submit Request <ArrowRight className="w-5 h-5" /></>
              )}
            </button>
          </div>
        </div>

      </form>
    </div>
  )
}
