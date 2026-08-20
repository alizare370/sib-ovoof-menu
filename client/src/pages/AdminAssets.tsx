import { useRef, useState } from "react";
import { Link } from "wouter";
import { ArrowRight, CheckCircle2, FileImage, Loader2, LogIn, UploadCloud } from "lucide-react";
import { startLogin } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";

const productOptions = [
  ["menu-1", "ساندویچ بندری"], ["menu-2", "ساندویچ هات داگ"], ["menu-3", "ساندویچ مخلوط"], ["menu-4", "ساندویچ همبرگر"],
  ["menu-5", "فیله مرغ"], ["menu-6", "کتف بال"], ["menu-7", "توپک پنیری"], ["menu-8", "پنیر سوخاری"], ["menu-9", "پیاز سوخاری"], ["menu-10", "کراکت مرغ"], ["menu-11", "کوردن بلو"], ["menu-12", "قارچ سوخاری یک پرس"], ["menu-13", "قارچ سوخاری نصف پرس"], ["menu-14", "سیب‌زمینی یک پرس"], ["menu-15", "سیب‌زمینی نصف پرس"], ["menu-16", "سیب‌زمینی با قارچ و پنیر"], ["menu-17", "هات داگ سرخ شده"], ["menu-18", "کوکتل سرخ شده"], ["menu-19", "نوشابه بطری"], ["menu-20", "نوشابه شیشه‌ای"], ["menu-21", "دلستر شیشه‌ای"], ["menu-22", "نوشیدنی‌های قوطی"],
] as const;

export default function AdminAssets() {
  const { user, loading } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);
  const [label, setLabel] = useState("");
  const [productKey, setProductKey] = useState("");
  const [message, setMessage] = useState("");
  const utils = trpc.useUtils();
  const assets = trpc.assets.list.useQuery(undefined, { enabled: Boolean(user?.role === "admin") });
  const upload = trpc.assets.upload.useMutation({
    onSuccess: async () => {
      setMessage("فایل با موفقیت در File Storage ذخیره شد.");
      setLabel("");
      setProductKey("");
      if (fileRef.current) fileRef.current.value = "";
      await utils.assets.list.invalidate();
    },
    onError: (error) => setMessage(error.message || "آپلود فایل انجام نشد."),
  });

  const handleUpload = async (event: React.FormEvent) => {
    event.preventDefault();
    const file = fileRef.current?.files?.[0];
    if (!file || !label.trim() || !productKey.trim()) { setMessage("عنوان، کلید محصول و فایل تصویر را انتخاب کنید."); return; }
    const supported = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];
    if (!supported.includes(file.type)) { setMessage("فرمت‌های مجاز: JPG، PNG، WEBP و SVG."); return; }
    const dataBase64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error("خواندن فایل ممکن نشد."));
      reader.readAsDataURL(file);
    });
    upload.mutate({ label, productKey, mimeType: file.type as "image/jpeg" | "image/png" | "image/webp" | "image/svg+xml", dataBase64 });
  };

  if (loading) return <div className="asset-page"><Loader2 className="asset-spin" /> در حال بررسی دسترسی...</div>;
  if (!user) return <div className="asset-page"><div className="asset-card asset-empty"><LogIn size={34} /><h1>ورود مدیر</h1><p>برای مدیریت تصاویر منو، ابتدا با حساب مدیر وارد شوید.</p><button className="asset-primary" onClick={() => startLogin()}>ورود به حساب</button><Link href="/" className="asset-back">بازگشت به منو</Link></div></div>;
  if (user.role !== "admin") return <div className="asset-page"><div className="asset-card asset-empty"><h1>دسترسی محدود است</h1><p>این بخش فقط برای مدیر رستوران در دسترس است.</p><Link href="/" className="asset-back">بازگشت به منو</Link></div></div>;

  return <div className="asset-page" dir="rtl"><div className="asset-wrap"><Link href="/" className="asset-back"><ArrowRight size={16} /> بازگشت به منو</Link><div className="asset-heading"><div><span className="section-kicker">مدیریت محتوا</span><h1>تصاویر منو</h1><p>فایل‌ها از طریق backend در File Storage ذخیره می‌شوند؛ دیتابیس فقط متادیتا و کلید فایل را نگه می‌دارد.</p></div><FileImage size={42} /></div><div className="asset-card"><form onSubmit={handleUpload}><label>عنوان تصویر<input value={label} onChange={(event) => setLabel(event.target.value)} placeholder="مثلاً تصویر فیله مرغ" /></label><label>محصول منو<select value={productKey} onChange={(event) => setProductKey(event.target.value)}><option value="">انتخاب محصول</option>{productOptions.map(([key, name]) => <option key={key} value={key}>{name}</option>)}</select><small className="asset-help">تصویر با این محصول در منوی عمومی جایگزین می‌شود.</small></label><label>انتخاب تصویر<input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/svg+xml" /></label><button className="asset-primary" disabled={upload.isPending}>{upload.isPending ? <Loader2 className="asset-spin" size={18} /> : <UploadCloud size={18} />} {upload.isPending ? "در حال آپلود..." : "آپلود در File Storage"}</button>{message && <div className="asset-message"><CheckCircle2 size={16} />{message}</div>}</form></div><div className="asset-list"><div className="asset-list-title"><h2>فایل‌های ذخیره‌شده</h2><span>{assets.data?.length ?? 0} فایل</span></div>{assets.isLoading ? <Loader2 className="asset-spin" /> : assets.data?.map((asset) => <div className="asset-row" key={asset.id}><img src={asset.fileUrl} alt={asset.label} onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = "/manus-storage/ovoof-fried-platter_84311014.jpg"; }} /><div><b>{asset.label}</b><small>{asset.fileKey}</small></div><a href={asset.fileUrl} target="_blank" rel="noreferrer">مشاهده</a></div>)}</div></div></div>;
}
