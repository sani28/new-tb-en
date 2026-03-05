"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { AddonCartItemPayload } from "@/components/addons/AddonProductDetailsModal";
import { promoProductData } from "@/lib/data/promoProducts";

// ── Constants ─────────────────────────────────────────────────────────────────

export const TOUR_PRICES: Record<
  string,
  { adult: number; adultOrig: number; child: number; childOrig: number }
> = {
  tour01: { adult: 20, adultOrig: 27, child: 14, childOrig: 18 },
  tour02: { adult: 22, adultOrig: 29, child: 15, childOrig: 20 },
  tour04: { adult: 18, adultOrig: 24, child: 12, childOrig: 16 },
};

export const TOUR_NAMES: Record<string, string> = {
  tour01: "Tour 01 Downtown Palace Namsan Course",
  tour02: "Tour 02 Panorama Course",
  tour04: "Tour 04 Night View Course",
};

export const TOUR_META: Record<
  string,
  { image: string; label: string; labelColor: string; title: string; isPopular: boolean }
> = {
  tour01: { image: "/imgs/tour01__.png", label: "TOUR 01", labelColor: "#000080", title: "DOWNTOWN PALACE NAMSAN COURSE", isPopular: false },
  tour02: { image: "/imgs/panorama.png", label: "TOUR 02", labelColor: "#C41E3A", title: "PANORAMA COURSE", isPopular: false },
  tour04: { image: "/imgs/tour04home.png", label: "TOUR 04", labelColor: "#FFD700", title: "NIGHT VIEW COURSE", isPopular: true },
};

const CART_TTL_MS = 15 * 60 * 1000;
const CART_WARN_MS = 5 * 60 * 1000;
const SESSION_KEY = "tb_promo_cart_session_v1";

// ── Types ──────────────────────────────────────────────────────────────────────

export type PromoCartItem = AddonCartItemPayload;
export type CheckoutStep = "idle" | "tourSelection" | "bookingInfo" | "payment";

export type ContactFormData = {
  name: string;
  email: string;
  phone: string;
  password: string;
  agreedToTerms: boolean;
};

export type OrderSummaryData = {
  tourName: string;
  tourValue: string;
  tourDate: string;
  adultQty: number;
  adultPrice: number;
  adultOrigPrice: number;
  childQty: number;
  childPrice: number;
  childOrigPrice: number;
};

// ── Cart helpers ───────────────────────────────────────────────────────────────

function getItemKey(item: PromoCartItem): string {
  if (item.type === "physical") return `${item.productId}-${item.variant}-${item.color ?? "default"}`;
  if (item.type === "scheduled") return `${item.productId}-${item.variant}-${item.selectedDate ?? "no-date"}-${item.selectedTime ?? "no-time"}`;
  if (item.type === "validityPass") return `${item.productId}-${item.variant}-validity`;
  if (item.type === "cruise") return `${item.productId}-${item.cruiseType ?? "default"}-${item.selectedDate ?? "no-date"}-${item.selectedTimeSlot ?? "no-slot"}`;
  return `${item.productId}-${item.variant}-default`;
}

function mergeItems(existing: PromoCartItem[], incoming: PromoCartItem[]): PromoCartItem[] {
  const items = [...existing];
  for (const item of incoming) {
    const key = getItemKey(item);
    const idx = items.findIndex((i) => getItemKey(i) === key);
    if (idx >= 0) {
      const ex = { ...items[idx]! };
      if (item.type === "physical") {
        ex.quantity += item.quantity;
        ex.computedLinePrice = ex.price * ex.quantity;
      } else {
        ex.adultQty = (ex.adultQty ?? 0) + (item.adultQty ?? 0);
        ex.childQty = (ex.childQty ?? 0) + (item.childQty ?? 0);
        ex.quantity = (ex.adultQty ?? 0) + (ex.childQty ?? 0);
        ex.computedLinePrice = (ex.computedLinePrice ?? 0) + item.computedLinePrice;
      }
      items[idx] = ex;
    } else {
      items.push(item);
    }
  }
  return items;
}

function cartTotal(items: PromoCartItem[]) {
  return items.reduce((s, i) => s + i.computedLinePrice, 0);
}
function cartOrigTotal(items: PromoCartItem[]) {
  return items.reduce((s, i) => s + (i.originalPrice ?? i.price) * i.quantity, 0);
}
function cartCount(items: PromoCartItem[]) {
  return items.reduce((s, i) => s + i.quantity, 0);
}

function getConstrainedTours(items: PromoCartItem[]): string[] | null {
  let constrained: Set<string> | null = null;
  for (const item of items) {
    const p = promoProductData[item.productId] as { compatibleTours?: string[] | null } | undefined;
    const tours = p?.compatibleTours;
    if (tours && tours.length > 0) {
      if (!constrained) constrained = new Set(tours);
      else {
        const prev = Array.from(constrained) as string[];
        const tourSet = tours as string[];
        constrained = new Set(prev.filter((t) => tourSet.includes(t)));
      }
    }
  }
  return constrained ? [...constrained] : null;
}

// ── Context shape ─────────────────────────────────────────────────────────────

type PromoCheckoutContextValue = {
  cartItems: PromoCartItem[];
  count: number;
  total: number;
  origTotal: number;
  cartExpiresAt: number | null;
  timerText: string;
  timerExpiring: boolean;
  cartExpanded: boolean;
  toast: string | null;
  step: CheckoutStep;
  selectedTourId: string;
  tourSkipped: boolean;
  selectedDate: Date | null;
  adultQty: number;
  childQty: number;
  tourOptional: boolean;
  orderData: OrderSummaryData | null;
  contactForm: ContactFormData;
  addonModalOpen: boolean;
  addonProductId: string | null;
  addonSourceTour: string | null;

  addToCart: (items: PromoCartItem[], opts?: { sourceTour?: string | null }) => void;
  removeFromCart: (index: number) => void;
  clearCart: () => void;
  openTourSelection: (opts?: {
    preferredTour?: string | null;
    adultCount?: number;
    childCount?: number;
    dateText?: string;
    pendingItems?: PromoCartItem[];
    tourOptional?: boolean;
  }) => void;
  openAddonModal: (productId: string, sourceTour?: string | null) => void;
  closeAddonModal: () => void;
  proceedFromTourSelection: () => void;
  skipTourSelection: () => void;
  closeCheckout: () => void;
  proceedFromBookingInfo: () => boolean;
  goBackFromBookingInfo: () => void;
  goBackFromPayment: () => void;
  makePayment: () => void;
  setSelectedTourId: (id: string) => void;
  setSelectedDate: (d: Date | null) => void;
  setAdultQty: (n: number) => void;
  setChildQty: (n: number) => void;
  setCartExpanded: (v: boolean) => void;
  setContactField: (field: keyof ContactFormData, value: string | boolean) => void;
};

const PromoCheckoutContext = createContext<PromoCheckoutContextValue | null>(null);

export function usePromoCheckout() {
  const ctx = useContext(PromoCheckoutContext);
  if (!ctx) throw new Error("usePromoCheckout must be used within PromoCheckoutProvider");
  return ctx;
}

// ── Provider ───────────────────────────────────────────────────────────────────

export function PromoCheckoutProvider({ children }: { children: React.ReactNode }) {
  // Cart
  const [cartItems, setCartItems] = useState<PromoCartItem[]>([]);
  const [cartExpiresAt, setCartExpiresAt] = useState<number | null>(null);
  const [cartExpanded, setCartExpanded] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Checkout flow
  const [step, setStep] = useState<CheckoutStep>("idle");
  const [selectedTourId, setSelectedTourId] = useState("tour01");
  const [tourSkipped, setTourSkipped] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [adultQty, setAdultQty] = useState(1);
  const [childQty, setChildQty] = useState(0);
  const [pendingItems, setPendingItems] = useState<PromoCartItem[]>([]);
  const [tourOptional, setTourOptional] = useState(false);
  const [orderData, setOrderData] = useState<OrderSummaryData | null>(null);
  const [contactForm, setContactFormState] = useState<ContactFormData>({
    name: "", email: "", phone: "", password: "", agreedToTerms: false,
  });

  // Addon modal
  const [addonModalOpen, setAddonModalOpen] = useState(false);
  const [addonProductId, setAddonProductId] = useState<string | null>(null);
  const [addonSourceTour, setAddonSourceTour] = useState<string | null>(null);

  // Timer UI
  const [timerText, setTimerText] = useState("");
  const [timerExpiring, setTimerExpiring] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Derived
  const count = useMemo(() => cartCount(cartItems), [cartItems]);
  const total = useMemo(() => cartTotal(cartItems), [cartItems]);
  const origTotal = useMemo(() => cartOrigTotal(cartItems), [cartItems]);

  // ── Toast ──────────────────────────────────────────────────────────────────

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    if (toastRef.current) clearTimeout(toastRef.current);
    toastRef.current = setTimeout(() => setToast(null), 3000);
  }, []);

  // ── Timer ──────────────────────────────────────────────────────────────────

  const tickTimer = useCallback(() => {
    setCartExpiresAt((expiresAt) => {
      if (!expiresAt) return expiresAt;
      const msLeft = expiresAt - Date.now();
      if (msLeft <= 0) {
        setCartItems([]);
        setCartExpiresAt(null);
        setStep("idle");
        setTourSkipped(false);
        setPendingItems([]);
        setSelectedDate(null);
        setAdultQty(1);
        setChildQty(0);
        setTimerText("");
        setTimerExpiring(false);
        if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
        try { sessionStorage.removeItem(SESSION_KEY); } catch {}
        setTimeout(() => alert("Your cart session expired. Please add your items again."), 0);
        return null;
      }
      const totalSec = Math.floor(msLeft / 1000);
      const mm = String(Math.floor(totalSec / 60)).padStart(2, "0");
      const ss = String(totalSec % 60).padStart(2, "0");
      setTimerText(`Cart expires in ${mm}:${ss}`);
      setTimerExpiring(msLeft <= CART_WARN_MS);
      return expiresAt;
    });
  }, []);

  useEffect(() => {
    if (count > 0 && cartExpiresAt) {
      if (!timerRef.current) timerRef.current = setInterval(tickTimer, 1000);
      tickTimer();
    } else {
      if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
      setTimerText("");
      setTimerExpiring(false);
    }
    return () => { if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; } };
  }, [count, cartExpiresAt, tickTimer]);

  // ── Session persistence ────────────────────────────────────────────────────

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      if (!raw) return;
      const data = JSON.parse(raw) as Record<string, unknown>;
      if (data.v !== 1) return;
      const expiresAt = typeof data.expiresAt === "number" ? data.expiresAt : null;
      if (expiresAt && expiresAt <= Date.now()) { sessionStorage.removeItem(SESSION_KEY); return; }
      if (Array.isArray(data.items)) setCartItems(data.items as PromoCartItem[]);
      if (expiresAt) setCartExpiresAt(expiresAt);
      if (typeof data.selectedTourId === "string") setSelectedTourId(data.selectedTourId);
      if (data.tourSkipped) setTourSkipped(true);
      if (typeof data.selectedDate === "string") setSelectedDate(new Date(data.selectedDate));
      if (typeof data.adultQty === "number") setAdultQty(data.adultQty);
      if (typeof data.childQty === "number") setChildQty(data.childQty);
    } catch {}
  }, []);

  useEffect(() => {
    try {
      if (cartItems.length === 0) { sessionStorage.removeItem(SESSION_KEY); return; }
      sessionStorage.setItem(SESSION_KEY, JSON.stringify({
        v: 1,
        savedAt: Date.now(),
        expiresAt: cartExpiresAt,
        items: cartItems,
        selectedTourId,
        tourSkipped,
        selectedDate: selectedDate?.toISOString() ?? null,
        adultQty,
        childQty,
      }));
    } catch {}
  }, [cartItems, cartExpiresAt, selectedTourId, tourSkipped, selectedDate, adultQty, childQty]);

  // ── Body overflow lock ─────────────────────────────────────────────────────

  useEffect(() => {
    document.body.style.overflow = step !== "idle" ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [step]);

  // ── Cart actions ───────────────────────────────────────────────────────────

  const addToCart = useCallback(
    (items: PromoCartItem[], opts?: { sourceTour?: string | null }) => {
      if (items.length === 0) return;
      setCartItems((prev) => {
        const isUpdate = items.some((item) => prev.some((e) => getItemKey(e) === getItemKey(item)));
        showToast(isUpdate ? "Cart updated" : "Added to cart");
        return mergeItems(prev, items);
      });
      setCartExpiresAt((prev) => prev ?? Date.now() + CART_TTL_MS);
      if (opts?.sourceTour) setSelectedTourId(opts.sourceTour);
    },
    [showToast],
  );

  const removeFromCart = useCallback((index: number) => {
    setCartItems((prev) => {
      const next = prev.filter((_, i) => i !== index);
      if (next.length === 0) {
        setCartExpiresAt(null);
        setStep("idle");
        setTourSkipped(false);
        setPendingItems([]);
      }
      return next;
    });
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
    setCartExpiresAt(null);
    setStep("idle");
    setSelectedTourId("tour01");
    setTourSkipped(false);
    setSelectedDate(null);
    setAdultQty(1);
    setChildQty(0);
    setPendingItems([]);
    try { sessionStorage.removeItem(SESSION_KEY); } catch {}
  }, []);

  // ── Addon modal ────────────────────────────────────────────────────────────

  const openAddonModal = useCallback((productId: string, sourceTour?: string | null) => {
    setAddonProductId(productId);
    setAddonSourceTour(sourceTour ?? null);
    setAddonModalOpen(true);
  }, []);

  const closeAddonModal = useCallback(() => setAddonModalOpen(false), []);

  // ── Tour selection ─────────────────────────────────────────────────────────

  const openTourSelection = useCallback(
    (opts?: {
      preferredTour?: string | null;
      adultCount?: number;
      childCount?: number;
      dateText?: string;
      pendingItems?: PromoCartItem[];
      tourOptional?: boolean;
    }) => {
      if (opts?.preferredTour) setSelectedTourId(opts.preferredTour);
      if (opts?.pendingItems?.length) setPendingItems(opts.pendingItems);
      setTourOptional(opts?.tourOptional ?? false);
      setSelectedDate(null);
      setCartItems((prev) => {
        if (prev.length === 0) {
          setAdultQty(opts?.adultCount ?? 1);
          setChildQty(opts?.childCount ?? 0);
        } else {
          if (opts?.adultCount !== undefined) setAdultQty(opts.adultCount);
          if (opts?.childCount !== undefined) setChildQty(opts.childCount);
        }
        return prev;
      });
      setStep("tourSelection");
    },
    [],
  );

  const proceedFromTourSelection = useCallback(() => {
    if (!selectedDate) { alert("Please select a date"); return; }
    if (adultQty + childQty < 1) { alert("Please select at least 1 ticket"); return; }
    if (pendingItems.length > 0) {
      setCartItems((prev) => mergeItems(prev, pendingItems));
      setCartExpiresAt((prev) => prev ?? Date.now() + CART_TTL_MS);
      setPendingItems([]);
    }
    setTourSkipped(false);
    setStep("bookingInfo");
  }, [selectedDate, adultQty, childQty, pendingItems]);

  const skipTourSelection = useCallback(() => {
    if (!tourOptional) return;
    if (pendingItems.length > 0) {
      setCartItems((prev) => mergeItems(prev, pendingItems));
      setCartExpiresAt((prev) => prev ?? Date.now() + CART_TTL_MS);
      setPendingItems([]);
    }
    setTourSkipped(true);
    setStep("bookingInfo");
  }, [tourOptional, pendingItems]);

  const closeCheckout = useCallback(() => {
    setStep("idle");
    setPendingItems([]);
  }, []);

  // ── Booking info ───────────────────────────────────────────────────────────

  const goBackFromBookingInfo = useCallback(() => setStep("tourSelection"), []);

  const proceedFromBookingInfo = useCallback((): boolean => {
    const { name, email, phone, agreedToTerms } = contactForm;
    if (!name || !email || !phone) { alert("Please fill in all required fields"); return false; }
    if (!agreedToTerms) { alert("Please agree to the Terms & Conditions"); return false; }
    const tp = TOUR_PRICES[selectedTourId] ?? TOUR_PRICES["tour01"]!;
    setOrderData({
      tourName: TOUR_NAMES[selectedTourId] ?? TOUR_NAMES["tour01"]!,
      tourValue: selectedTourId,
      tourDate: tourSkipped || !selectedDate
        ? ""
        : selectedDate.toLocaleDateString("en-US", { weekday: "short", year: "numeric", month: "short", day: "numeric" }),
      adultQty,
      adultPrice: tp.adult,
      adultOrigPrice: tp.adultOrig,
      childQty,
      childPrice: tp.child,
      childOrigPrice: tp.childOrig,
    });
    setStep("payment");
    return true;
  }, [contactForm, selectedTourId, selectedDate, tourSkipped, adultQty, childQty]);

  const setContactField = useCallback(
    (field: keyof ContactFormData, value: string | boolean) =>
      setContactFormState((prev) => ({ ...prev, [field]: value })),
    [],
  );

  // ── Payment ────────────────────────────────────────────────────────────────

  const goBackFromPayment = useCallback(() => setStep("bookingInfo"), []);

  const makePayment = useCallback(() => {
    alert("Payment processed successfully! Thank you for your booking.");
    clearCart();
  }, [clearCart]);

  // ── Window bridges (for card buttons outside React tree) ───────────────────

  useEffect(() => {
    const w = window as unknown as Record<string, unknown>;
    w.__tbPromoOpenAddonModal = openAddonModal;
    w.__tbPromoAddAddonItemsToCart = ({
      productId,
      items,
      sourceTour,
    }: { productId: string; items: PromoCartItem[]; sourceTour?: string | null }) => {
      const product = promoProductData[productId] as { compatibleTours?: string[] | null } | undefined;
      const incomingTours = product?.compatibleTours ?? null;

      // Enforce tour compatibility
      if (!tourSkipped && incomingTours && incomingTours.length > 0) {
        const cartConstrained = getConstrainedTours(cartItems);
        if (cartConstrained) {
          const overlap = incomingTours.filter((t) => cartConstrained.includes(t));
          if (overlap.length === 0) {
            alert(`${product ? (product as { name?: string }).name ?? "This add-on" : "This add-on"} is only available with ${incomingTours.join(", ")}. Please complete your current booking first, then start a new one.`);
            return;
          }
        }
      }
      addToCart(items, { sourceTour });
    };
    return () => {
      delete w.__tbPromoOpenAddonModal;
      delete w.__tbPromoAddAddonItemsToCart;
    };
  }, [openAddonModal, addToCart, cartItems, tourSkipped]);

  // ── Hero promo "Book Now" event ────────────────────────────────────────────

  useEffect(() => {
    const handler = (e: Event) => {
      const d = (e as CustomEvent).detail ?? {};
      openTourSelection({
        preferredTour: d.preferredTour ?? null,
        adultCount: d.adultCount,
        childCount: d.childCount,
        dateText: d.dateText,
        tourOptional: false,
      });
    };
    document.addEventListener("tb:openPromoTourSelectionFromHero", handler);
    return () => document.removeEventListener("tb:openPromoTourSelectionFromHero", handler);
  }, [openTourSelection]);

  const value: PromoCheckoutContextValue = {
    cartItems, count, total, origTotal, cartExpiresAt,
    timerText, timerExpiring, cartExpanded, toast,
    step, selectedTourId, tourSkipped, selectedDate, adultQty, childQty,
    tourOptional, orderData, contactForm,
    addonModalOpen, addonProductId, addonSourceTour,
    addToCart, removeFromCart, clearCart,
    openTourSelection, openAddonModal, closeAddonModal,
    proceedFromTourSelection, skipTourSelection, closeCheckout,
    proceedFromBookingInfo, goBackFromBookingInfo,
    goBackFromPayment, makePayment,
    setSelectedTourId, setSelectedDate, setAdultQty, setChildQty,
    setCartExpanded, setContactField,
  };

  return (
    <PromoCheckoutContext.Provider value={value}>
      {children}
    </PromoCheckoutContext.Provider>
  );
}

// ── Addon items handler for PromoEnhanceSeoulAddonsCarousel ───────────────────
// Used by the carousel's onAddItems callback
export function usePromoAddonHandler() {
  const { addonProductId, addonSourceTour, addToCart } = usePromoCheckout();

  const handleAddItems = useCallback(
    (items: PromoCartItem[]) => {
      if (!addonProductId) return;
      // Add directly to cart so the floating cart bar appears immediately.
      // Tour selection happens later when the user clicks "Continue to Booking".
      addToCart(items, { sourceTour: addonSourceTour ?? undefined });
    },
    [addonProductId, addonSourceTour, addToCart],
  );

  return { handleAddItems };
}
