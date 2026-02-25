import type {
  PromoCruiseType,
  PromoProduct,
  PromoProductColor,
  PromoProductType,
  PromoProductVariant,
  PromoTimeSlot,
} from "@/types/promo";
import { promoProductData } from "@/lib/data/promoProducts";
import type { Cleanup } from "./types";

export function initPromoAddonProductModal(): Cleanup {
	  const triggers = Array.from(document.querySelectorAll<HTMLElement>(".card-more-info-btn"));
	  const overlay = document.getElementById("promoProductModal");
	  const closeBtn1 = document.getElementById("closePromoProductModal");
	  const closeBtn2 = document.getElementById("closePromoProductModal2");
	  const addBtn = document.getElementById("promoAddToCartBtn") as HTMLButtonElement | null;

	  const variantTabs = document.getElementById("promoProductVariantTabs");
	  const titleEl = document.getElementById("promoProductModalTitle");
	  const nameEl = document.getElementById("promoProductModalName");
	  const descEl = document.getElementById("promoProductModalDesc");
	  const priceEl = document.getElementById("promoProductModalPrice");
	  const origPriceEl = document.getElementById("promoProductModalOrigPrice");
	  const imgEl = document.getElementById("promoProductModalImg") as HTMLImageElement | null;
	  const placeholderEl = document.getElementById("promoProductModalPlaceholder");

	  const cartBar = document.getElementById("promoUpsellCartBar");
	  const cartCount = document.getElementById("promoCartItemCount");
	  const cartTotalPrice = document.getElementById("promoCartTotalPrice");
		  const cartToastEl = document.getElementById("promoCartToast") as HTMLElement | null;
		  const cartToastMessageEl = document.getElementById("promoCartToastMessage") as HTMLElement | null;
	  const continueLink = document.getElementById("promoContinueToBookingBtn") as HTMLAnchorElement | null;
		  const viewCartBtn = document.getElementById("promoViewCartBtn") as HTMLButtonElement | null;
		  const collapseCartBtn = document.getElementById("promoCollapseCartBtn") as HTMLButtonElement | null;
		  const cartExpanded = document.getElementById("promoCartExpanded");
		  const cartItemsList = document.getElementById("promoCartItemsList");
		  const cartTotalExpanded = document.getElementById("promoCartTotalExpanded");
		  const cartSavingsRow = document.getElementById("promoCartSavingsRow") as HTMLElement | null;
		  const cartSavings = document.getElementById("promoCartSavings");
		  const cartTimerEl = document.getElementById("promoCartTimer") as HTMLElement | null;
			  const cartFeedbackEl = document.getElementById("promoCartFeedback") as HTMLElement | null;

				  let promoCartPulseTimeoutId: number | null = null;
				  let promoCartIconTimeoutId: number | null = null;
				  let promoCartFeedbackTimeoutId: number | null = null;
				  let promoCartToastTimeoutId: number | null = null;

				  const triggerPromoCartToast = (message: string) => {
				  	if (!cartToastEl) return;
				  	if (cartToastMessageEl) cartToastMessageEl.textContent = message;
				  	cartToastEl.classList.remove("show");
				  	// Force reflow so repeated adds retrigger the animation.
				  	void cartToastEl.offsetWidth;
				  	cartToastEl.classList.add("show");
				  	if (promoCartToastTimeoutId != null) window.clearTimeout(promoCartToastTimeoutId);
				  	promoCartToastTimeoutId = window.setTimeout(() => {
				  		cartToastEl.classList.remove("show");
				  	}, 3000);
				  };

			  const triggerPromoCartAddFeedback = (message: string) => {
				  // Pulse the bar + badge (CSS handles animation when `.pulse` is present)
				  if (cartBar) {
					  cartBar.classList.remove("pulse");
					  // Force reflow so repeated adds retrigger the animation.
					  void cartBar.offsetWidth;
					  cartBar.classList.add("pulse");
					  if (promoCartPulseTimeoutId != null) window.clearTimeout(promoCartPulseTimeoutId);
					  promoCartPulseTimeoutId = window.setTimeout(() => cartBar.classList.remove("pulse"), 360);
				  }

				  // Prototype parity: quick scale on the cart icon itself
				  const icon = cartBar?.querySelector<HTMLElement>(".cart-bar-icon") ?? null;
				  if (icon) {
					  icon.style.transform = "scale(1.12)";
					  if (promoCartIconTimeoutId != null) window.clearTimeout(promoCartIconTimeoutId);
					  promoCartIconTimeoutId = window.setTimeout(() => {
						  icon.style.transform = "";
					  }, 220);
				  }

				  // Small text feedback near the buttons (useful when adding multiple add-ons)
				  if (cartFeedbackEl) {
					  cartFeedbackEl.textContent = message;
					  cartFeedbackEl.classList.remove("show");
					  void cartFeedbackEl.offsetWidth;
					  cartFeedbackEl.classList.add("show");
					  if (promoCartFeedbackTimeoutId != null) window.clearTimeout(promoCartFeedbackTimeoutId);
					  promoCartFeedbackTimeoutId = window.setTimeout(() => {
						  cartFeedbackEl.classList.remove("show");
					  }, 1100);
				  }
			  };

		// Promo Tour Selection Modal (first add-on capture)
		const tourModalOverlay = document.getElementById("promoTourSelectionModal");
		const tourModalCloseBtn = document.getElementById("closeTourSelection");
		const tourSelect = document.getElementById("promoTourSelect") as HTMLSelectElement | null;
		const tourImage = document.getElementById("promoTourImage") as HTMLImageElement | null;
		const tourLabel = document.getElementById("promoTourLabel") as HTMLElement | null;
		const tourTitle = document.getElementById("promoTourTitle") as HTMLElement | null;
		const tourPopularBadge = document.getElementById("promoPopularBadge") as HTMLElement | null;
		const tourInfoPanel = document.getElementById("promoTourInfoPanel") as HTMLElement | null;
		const tourSelectionSubtitle = document.getElementById("tourSelectionSubtitle") as HTMLElement | null;
		const tourContinueBtn = document.getElementById("tourSelectionContinueBtn") as HTMLButtonElement | null;
		const tourSkipBtn = document.getElementById("skipTourBtn") as HTMLButtonElement | null;


			// Step 2: tour map popup overlay (placeholder)
			const promoMapPopup = document.getElementById("promoTourMapPopup") as HTMLElement | null;
			const promoMapClose = document.getElementById("promoTourMapClose") as HTMLButtonElement | null;
			const promoMapTitle = document.getElementById("promoTourMapTitle") as HTMLElement | null;

		// Step 2: Date picker + ticket counter elements
		const promoDateTrigger = document.getElementById("promoDateTrigger") as HTMLButtonElement | null;
		const promoCalendarDropdown = document.getElementById("promoCalendarDropdown") as HTMLElement | null;
		const promoSelectedDateDisplay = document.getElementById("promoSelectedDateDisplay") as HTMLElement | null;
		const promoCloseCalendar = tourModalOverlay?.querySelector<HTMLButtonElement>(".promo-close-calendar") ?? null;
		const promoPrevMonth = tourModalOverlay?.querySelector<HTMLButtonElement>(".promo-prev-month") ?? null;
		const promoNextMonth = tourModalOverlay?.querySelector<HTMLButtonElement>(".promo-next-month") ?? null;
		const promoCurrentMonth = tourModalOverlay?.querySelector<HTMLElement>(".promo-current-month") ?? null;
		const promoCalendarDays = tourModalOverlay?.querySelector<HTMLElement>(".promo-calendar-days") ?? null;

		const promoAdultCount = document.getElementById("promoAdultCount") as HTMLElement | null;
		const promoChildCount = document.getElementById("promoChildCount") as HTMLElement | null;
		const promoAdultMinus = tourModalOverlay?.querySelector<HTMLButtonElement>(".promo-adult-minus") ?? null;
		const promoAdultPlus = tourModalOverlay?.querySelector<HTMLButtonElement>(".promo-adult-plus") ?? null;
		const promoChildMinus = tourModalOverlay?.querySelector<HTMLButtonElement>(".promo-child-minus") ?? null;
		const promoChildPlus = tourModalOverlay?.querySelector<HTMLButtonElement>(".promo-child-plus") ?? null;

		const promoAdultUnitPrice = document.getElementById("promoAdultUnitPrice") as HTMLElement | null;
		const promoAdultUnitOrigPrice = document.getElementById("promoAdultUnitOrigPrice") as HTMLElement | null;
		const promoChildUnitPrice = document.getElementById("promoChildUnitPrice") as HTMLElement | null;
		const promoChildUnitOrigPrice = document.getElementById("promoChildUnitOrigPrice") as HTMLElement | null;
		const promoTotalPrice = document.getElementById("promoTotalPrice") as HTMLElement | null;
		const promoOriginalTotal = document.getElementById("promoOriginalTotal") as HTMLElement | null;

		const promoContinueToBookingBtn = document.getElementById("promoContinueToBookingBtn") as HTMLButtonElement | null;

		// Step 3: Booking Information Modal elements
		const bookingInfoModal = document.getElementById("promoBookingInfoModal") as HTMLElement | null;
			const closeBookingInfoBtn = document.getElementById("closeBookingInfo") as HTMLButtonElement | null;
		const prominentBackBtn = document.getElementById("promoStep3ProminentBackBtn") as HTMLButtonElement | null;
		const proceedToOrderSummaryBtn = document.getElementById("proceedToOrderSummaryBtn") as HTMLButtonElement | null;
		const step3TourDate = document.getElementById("promoStep3TourDate") as HTMLElement | null;
		const step3TicketsSection = document.getElementById("promoStep3TicketsSection") as HTMLElement | null;
		const step3OrderTickets = document.getElementById("promoStep3OrderTickets") as HTMLElement | null;
		const step3AddonsSection = document.getElementById("promoStep3AddonsSection") as HTMLElement | null;
		const step3OrderAddons = document.getElementById("promoStep3OrderAddons") as HTMLElement | null;
		const step3Subtotal = document.getElementById("promoStep3Subtotal") as HTMLElement | null;
		const step3Total = document.getElementById("promoStep3Total") as HTMLElement | null;

			// Step 4: Order Summary Modal elements
			const orderSummaryModal = document.getElementById("promoOrderSummaryModal") as HTMLElement | null;
			const closeOrderSummaryBtn = document.getElementById("closeOrderSummary") as HTMLButtonElement | null;
			const orderBackBtn = document.getElementById("orderBackBtn") as HTMLButtonElement | null;
			const proceedToPaymentBtn = document.getElementById("proceedToPaymentBtn") as HTMLButtonElement | null;
			const orderTourTicketsSection = document.getElementById("orderTourTicketsSection") as HTMLElement | null;
			const orderAddonsSection = document.getElementById("orderAddonsSection") as HTMLElement | null;
			const orderTourDate = document.getElementById("orderTourDate") as HTMLElement | null;
			const orderTourTickets = document.getElementById("orderTourTickets") as HTMLElement | null;
			const orderUpsellItemsList = document.getElementById("orderUpsellItemsList") as HTMLElement | null;
			const upsellSubtotal = document.getElementById("upsellSubtotal") as HTMLElement | null;
			const orderSavingsRow = document.getElementById("orderSavingsRow") as HTMLElement | null;
			const orderSavings = document.getElementById("orderSavings") as HTMLElement | null;
			const orderGrandTotal = document.getElementById("orderGrandTotal") as HTMLElement | null;

		// Step 5: Payment Modal elements
		const paymentModal = document.getElementById("promoPaymentModal") as HTMLElement | null;
			const closePaymentBtn = document.getElementById("closePayment") as HTMLButtonElement | null;
		const paymentBackBtn = document.getElementById("paymentBackBtn") as HTMLButtonElement | null;
		const makePaymentBtn = document.getElementById("makePaymentBtn") as HTMLButtonElement | null;
		const paymentTourDate = document.getElementById("promoPaymentTourDate") as HTMLElement | null;
		const paymentOrderTickets = document.getElementById("promoPaymentOrderTickets") as HTMLElement | null;
		const paymentAddonsSection = document.getElementById("promoPaymentAddonsSection") as HTMLElement | null;
		const paymentOrderAddons = document.getElementById("promoPaymentOrderAddons") as HTMLElement | null;
		const paymentSubtotal = document.getElementById("promoPaymentSubtotal") as HTMLElement | null;
		const paymentTotal = document.getElementById("promoPaymentTotal") as HTMLElement | null;

	  if (!overlay || triggers.length === 0) return () => {};

	  type PromoCartItem = {
	    productId: string;
	    name: string;
	    type: PromoProductType;
	    category: string;
	    price: number;
	    originalPrice: number;
	    quantity: number;
	    image?: string | null;
	    placeholder?: string | null;
	    variant: string;
	    color?: string | null;
	    selectedDate?: string | null;
	    selectedTime?: string | null;
	    selectedTimeSlot?: string | null;
	    cruiseType?: string | null;
	    cruiseTypeName?: string | null;
	    adultQty?: number | null;
	    childQty?: number | null;
	    validUntil?: string | null;
	    computedLinePrice?: number;
	  };

	  const PromoUpsellCart = {
	    items: [] as PromoCartItem[],
	
	    getItemKey(i: PromoCartItem) {
	      if (i.type === "physical") return `${i.productId}-${i.variant}-${i.color || "default"}`;
	      if (i.type === "scheduled") return `${i.productId}-${i.variant}-${i.selectedDate || "no-date"}-${i.selectedTime || "no-time"}`;
	      if (i.type === "validityPass") return `${i.productId}-${i.variant}-validity`;
	      if (i.type === "cruise")
	        return `${i.productId}-${i.cruiseType || "default"}-${i.selectedDate || "no-date"}-${i.selectedTimeSlot || "no-slot"}`;
	      return `${i.productId}-${i.variant}-default`;
	    },
	
		    addItem(item: PromoCartItem) {
		      const wasEmpty = this.items.length === 0;
		      if (wasEmpty && !promoCartExpiresAt) {
		        promoCartExpiresAt = Date.now() + PROMO_CART_SESSION_TTL_MS;
		      }

	      const key = this.getItemKey(item);
	      const existingIndex = this.items.findIndex((i) => this.getItemKey(i) === key);
		      const isExisting = existingIndex >= 0;
	
	      if (existingIndex >= 0) {
	        const existing = this.items[existingIndex];
	        if (item.type === "physical") {
	          existing.quantity += item.quantity;
	          existing.computedLinePrice = (existing.price || 0) * existing.quantity;
	        } else {
	          existing.adultQty = (existing.adultQty || 0) + (item.adultQty || 0);
	          existing.childQty = (existing.childQty || 0) + (item.childQty || 0);
	          existing.quantity = (existing.adultQty || 0) + (existing.childQty || 0);
		
		          // IMPORTANT: adult/child pricing can differ, so treat computedLinePrice as an additive line total.
		          // (Averaging per-unit price would corrupt totals when adultPrice !== childPrice.)
		          const existingLine = typeof existing.computedLinePrice === "number" ? existing.computedLinePrice : 0;
		          const incomingLine = typeof item.computedLinePrice === "number" ? item.computedLinePrice : (item.price || 0) * (item.quantity || 0);
		          existing.computedLinePrice = existingLine + incomingLine;
	        }
	      } else {
	        this.items.push(item);
	      }
	
	      this.updateUI();
		      triggerPromoCartAddFeedback(isExisting ? "Cart updated" : "Added to cart");
	    },

		    removeItem(index: number) {
		      if (index < 0 || index >= this.items.length) return;
		      this.items.splice(index, 1);
		      this.updateUI();
		    },
	
	    getItemCount() {
	      return this.items.reduce((sum, item) => sum + (item.quantity || 0), 0);
	    },
	
	    getTotal() {
	      return this.items.reduce((sum, item) => {
	        if (typeof item.computedLinePrice === "number") return sum + item.computedLinePrice;
	        return sum + (item.price || 0) * (item.quantity || 0);
	      }, 0);
	    },

		    getOriginalTotal() {
		      return this.items.reduce((sum, item) => {
		        const unit = typeof item.originalPrice === "number" ? item.originalPrice : item.price || 0;
		        return sum + unit * (item.quantity || 0);
		      }, 0);
		    },
	
	    updateUI() {
	      if (!cartBar) return;
	
	      const count = this.getItemCount();
	      const total = this.getTotal();
		      const originalTotal = this.getOriginalTotal();
	
	      cartBar.classList.toggle("visible", count > 0);
	      cartBar.setAttribute("aria-hidden", count > 0 ? "false" : "true");
	      if (cartCount) cartCount.textContent = String(count);
	      if (cartTotalPrice) cartTotalPrice.textContent = `$${total.toFixed(2)}`;
		
		      // Keep expanded totals/savings in sync even if the panel isn't open.
		      if (cartTotalExpanded) cartTotalExpanded.textContent = `$${total.toFixed(2)}`;
		      const savings = originalTotal - total;
		      if (cartSavingsRow && cartSavings) {
		        if (savings > 0.005) {
		          cartSavingsRow.style.display = "flex";
		          cartSavings.textContent = `$${savings.toFixed(2)}`;
		        } else {
		          cartSavingsRow.style.display = "none";
		        }
		      }
		
		      // If the expanded cart is open, rerender its items.
		      if (cartExpanded?.classList.contains("show")) {
		        renderPromoCartItems();
		      }
		
		      // If cart is empty, force-collapse expanded view.
		      if (count <= 0 && cartExpanded?.classList.contains("show")) {
		        cartExpanded.classList.remove("show");
		        setViewCartButtonState(false);
		      }

		    // If cart is empty, clear tour selection state (fresh booking context)
		    if (count <= 0) {
		      promoSelectedTour = null;
		      tourSelectionSkipped = false;
		      pendingAddItems = [];
		      pendingAddonTourOptional = false;
		        promoCartExpiresAt = null;
		        stopPromoCartTimer();
		    }
		
		      syncContinueHref();
		      persistPromoCartSession();
		      updatePromoCartTimerUI();
	    },
	  };

	  type PromoCurrentProduct = PromoProduct & { id: string };
	  type PromoSelections = {
	    variant: string | null;
	    quantity?: number;
	    date?: string | null;
	    time?: string | null;
	    adultQty?: number;
	    childQty?: number;
	    cruiseType?: string | null;
	    timeSlot?: string | null;
	    color?: string | null;
	  };

	  let promoCurrentProduct: PromoCurrentProduct | null = null;
	  let promoCurrentVariant: PromoProductVariant | null = null;
	  let promoProductQuantity = 1;
	  let promoProductSelectedDate: string | null = null;
	  let promoProductSelectedTime: string | null = null;
	  let promoProductAdultQty = 0;
	  let promoProductChildQty = 0;
	  let promoProductSelectedCruiseType: string | null = null;
	  let promoProductSelectedTimeSlot: string | null = null;

	  let lastTourContext: string | null = null;
		let promoSelectedTour: string | null = null;
		let tourSelectionSkipped = false;
		let pendingAddItems: PromoCartItem[] = [];
		let pendingAddonTourOptional = false;

		// Step 2: tour-level date and ticket state
		let promoTourSelectedDate: string | null = null;
		let promoTourAdultQty = 1;
		let promoTourChildQty = 0;

			// ─── Promo cart session persistence + expiry timer ─────────────────
			const PROMO_CART_SESSION_KEY = "tb_promo_cart_session_v1";
			const PROMO_CART_SESSION_TTL_MS = 15 * 60 * 1000; // 15 minutes
			const PROMO_CART_EXPIRY_WARNING_MS = 5 * 60 * 1000; // 5 minutes
			let promoCartExpiresAt: number | null = null;
			let promoCartTimerId: number | null = null;

			type PromoCartSessionV1 = {
				v: 1;
				savedAt: number;
				expiresAt: number | null;
				items: PromoCartItem[];
				promoSelectedTour: string | null;
				tourSelectionSkipped: boolean;
				promoTourSelectedDate: string | null;
				promoTourAdultQty: number;
				promoTourChildQty: number;
			};

			const stopPromoCartTimer = () => {
				if (promoCartTimerId != null) {
					window.clearInterval(promoCartTimerId);
					promoCartTimerId = null;
				}
				if (cartTimerEl) {
					cartTimerEl.textContent = "";
					cartTimerEl.classList.remove("show", "expiring");
				}
			};

			const removePromoCartSession = () => {
				try {
					window.sessionStorage.removeItem(PROMO_CART_SESSION_KEY);
				} catch {
					// ignore
				}
			};

			const savePromoCartSession = () => {
				try {
					const count = PromoUpsellCart.getItemCount();
					if (count <= 0) {
						removePromoCartSession();
						return;
					}

					const payload: PromoCartSessionV1 = {
						v: 1,
						savedAt: Date.now(),
						expiresAt: promoCartExpiresAt,
						items: PromoUpsellCart.items,
						promoSelectedTour,
						tourSelectionSkipped,
						promoTourSelectedDate,
						promoTourAdultQty,
						promoTourChildQty,
					};
					window.sessionStorage.setItem(PROMO_CART_SESSION_KEY, JSON.stringify(payload));
				} catch {
					// ignore (private mode / quota / disabled)
				}
			};

			const clearPromoCartSession = () => {
				promoCartExpiresAt = null;
				stopPromoCartTimer();
				removePromoCartSession();
			};

			const onPromoCartExpired = () => {
				// Clear UI + state
				PromoUpsellCart.items = [];
				promoSelectedTour = null;
				tourSelectionSkipped = false;
				pendingAddItems = [];
				pendingAddonTourOptional = false;
				promoTourSelectedDate = null;
				promoTourAdultQty = 1;
				promoTourChildQty = 0;

				// Close any open promo modals/overlays
				overlay?.classList.remove("active");
				overlay?.setAttribute("aria-hidden", "true");
				document.body.classList.remove("promo-product-modal-open", "promo-tour-modal-open");
				if (tourModalOverlay) {
					tourModalOverlay.classList.remove("active");
					tourModalOverlay.setAttribute("aria-hidden", "true");
				}
				if (bookingInfoModal) {
					bookingInfoModal.classList.remove("active");
					bookingInfoModal.setAttribute("aria-hidden", "true");
				}
				if (paymentModal) {
					paymentModal.classList.remove("active");
					paymentModal.setAttribute("aria-hidden", "true");
				}
				if (orderSummaryModal) {
					orderSummaryModal.classList.remove("active");
					orderSummaryModal.setAttribute("aria-hidden", "true");
				}
				document.body.style.overflow = "";

				clearPromoCartSession();
				PromoUpsellCart.updateUI();
				alert("Your cart session expired. Please add your items again.");
			};

			const updatePromoCartTimerUI = () => {
				if (!cartTimerEl) return;
				const count = PromoUpsellCart.getItemCount();
				if (count <= 0 || !promoCartExpiresAt) {
					cartTimerEl.textContent = "";
					cartTimerEl.classList.remove("show", "expiring");
					return;
				}

				const msLeft = promoCartExpiresAt - Date.now();
				if (msLeft <= 0) {
					onPromoCartExpired();
					return;
				}

				const totalSeconds = Math.floor(msLeft / 1000);
				const minutes = Math.floor(totalSeconds / 60);
				const seconds = totalSeconds % 60;
				const mm = String(minutes).padStart(2, "0");
				const ss = String(seconds).padStart(2, "0");
				cartTimerEl.textContent = `Cart expires in ${mm}:${ss}`;
				cartTimerEl.classList.add("show");
				cartTimerEl.classList.toggle("expiring", msLeft <= PROMO_CART_EXPIRY_WARNING_MS);
			};

			const startPromoCartTimer = () => {
				if (!cartTimerEl) return;
				if (promoCartTimerId != null) return;
				promoCartTimerId = window.setInterval(updatePromoCartTimerUI, 1000);
				updatePromoCartTimerUI();
			};

			const ensurePromoCartExpiryInitialized = () => {
				if (PromoUpsellCart.getItemCount() <= 0) return;
				if (!promoCartExpiresAt) promoCartExpiresAt = Date.now() + PROMO_CART_SESSION_TTL_MS;
				startPromoCartTimer();
			};

			const persistPromoCartSession = () => {
				const count = PromoUpsellCart.getItemCount();
				if (count <= 0) {
					clearPromoCartSession();
					return;
				}
				ensurePromoCartExpiryInitialized();
				savePromoCartSession();
			};

			const loadPromoCartSession = () => {
				try {
					const raw = window.sessionStorage.getItem(PROMO_CART_SESSION_KEY);
					if (!raw) return;
					const data = JSON.parse(raw) as Partial<PromoCartSessionV1> | null;
					if (!data || data.v !== 1) return;

					const expiresAt = typeof data.expiresAt === "number" ? data.expiresAt : null;
					if (expiresAt && expiresAt <= Date.now()) {
						clearPromoCartSession();
						return;
					}

					PromoUpsellCart.items = Array.isArray(data.items) ? (data.items as PromoCartItem[]) : [];
					promoSelectedTour = typeof data.promoSelectedTour === "string" ? data.promoSelectedTour : null;
					tourSelectionSkipped = !!data.tourSelectionSkipped;
					promoTourSelectedDate = typeof data.promoTourSelectedDate === "string" ? data.promoTourSelectedDate : null;
					promoTourAdultQty = typeof data.promoTourAdultQty === "number" ? data.promoTourAdultQty : 1;
					promoTourChildQty = typeof data.promoTourChildQty === "number" ? data.promoTourChildQty : 0;
					promoCartExpiresAt = expiresAt;

					// Sync selected tour dropdown + display (if present)
					if (tourSelect && promoSelectedTour) {
						tourSelect.value = promoSelectedTour;
						updatePromoTourDisplay(promoSelectedTour);
						updateTourInfoPanel(promoSelectedTour);
						updatePromoTourPrices(promoSelectedTour);
					}

					// Best-effort UI sync (tour modal widgets read from these state vars)
					if (promoAdultCount) promoAdultCount.textContent = String(promoTourAdultQty);
					if (promoChildCount) promoChildCount.textContent = String(promoTourChildQty);
					if (promoSelectedDateDisplay) {
						if (promoTourSelectedDate) {
							const d = new Date(promoTourSelectedDate);
							promoSelectedDateDisplay.textContent = d.toLocaleDateString("en-US", {
								weekday: "short",
								year: "numeric",
								month: "short",
								day: "numeric",
							});
						} else {
							promoSelectedDateDisplay.textContent = "Please select a date";
						}
					}

					PromoUpsellCart.updateUI();
					updatePromoTotalPrice();
					ensurePromoCartExpiryInitialized();
					updatePromoCartTimerUI();
				} catch {
					// ignore
				}
			};

		const TOUR_PRICES: Record<string, { adult: number; adultOrig: number; child: number; childOrig: number }> = {
			tour01: { adult: 20, adultOrig: 27, child: 14, childOrig: 18 },
			tour02: { adult: 22, adultOrig: 29, child: 15, childOrig: 20 },
			tour04: { adult: 18, adultOrig: 24, child: 12, childOrig: 16 },
		};

		const TOUR_NAMES: Record<string, string> = {
			tour01: "Tour 01 Downtown Palace Namsan Course",
			tour02: "Tour 02 Panorama Course",
			tour04: "Tour 04 Night View Course",
		};

		// promoOrderData: stores resolved booking data for Steps 3-5
		const promoOrderData = {
			tourName: "",
			tourValue: "",
			tourDate: "",
			adultQty: 0,
			adultPrice: 0,
			adultOrigPrice: 0,
			childQty: 0,
			childPrice: 0,
			childOrigPrice: 0,
			backstageAdultQty: 0,
			backstageChildQty: 0,
			backstageDate: "",
			backstagePrice: 8,
		};

		  const getConstrainedToursFromCart = (): string[] | null => {
		    let constrained: Set<string> | null = null;
		
		    PromoUpsellCart.items.forEach((item) => {
		      const p = promoProductData[item.productId];
		      const tours = p?.compatibleTours;
		      if (tours && tours.length > 0) {
		        if (!constrained) constrained = new Set(tours);
		        else constrained = new Set(Array.from(constrained).filter((t) => new Set(tours).has(t)));
		      }
		    });
		
		    return constrained ? Array.from(constrained) : null;
		  };

	  const detectTourContext = (fromEl: Element): string | null => {
	    const slide = fromEl.closest(".homepage-carousel-slide");
	    const label = slide?.querySelector<HTMLElement>(".tour-label-fixed");
	    const text = label?.textContent?.trim().toUpperCase() ?? "";
	    if (text.includes("TOUR 01")) return "tour01";
	    if (text.includes("TOUR 02")) return "tour02";
	    if (text.includes("TOUR 04")) return "tour04";
	    return null;
	  };
		
			  const pickTourForContinue = (): string | null => {
			    // If user explicitly continued without a tour, keep booking link tour-less.
			    if (tourSelectionSkipped) return null;
			
			    const constrained = getConstrainedToursFromCart();
			
			    if (promoSelectedTour && (!constrained || constrained.includes(promoSelectedTour))) return promoSelectedTour;
			
			    // Safety: if selection fell out of constraints (shouldn't happen if we enforce), snap to first allowed.
			    if (promoSelectedTour && constrained && constrained.length > 0 && !constrained.includes(promoSelectedTour)) {
			      promoSelectedTour = constrained[0];
			      lastTourContext = constrained[0];
			      return constrained[0];
			    }
			
			    if (lastTourContext && (!constrained || constrained.includes(lastTourContext))) return lastTourContext;
			
			    if (constrained && constrained.length > 0) {
			      lastTourContext = constrained[0];
			      return constrained[0];
			    }
			
			    return lastTourContext;
			  };

	  const syncContinueHref = () => {
	    if (!continueLink) return;
		    const tour = pickTourForContinue();
		    continueLink.href = tour ? `/booking?tour=${encodeURIComponent(tour)}` : "/booking";
	  };
		
		const ALL_TOURS = ["tour01", "tour02", "tour04"] as const;
		type TourId = (typeof ALL_TOURS)[number];
		const tourData: Record<
		  TourId,
		  { image: string; label: string; labelColor: string; title: string; isPopular: boolean }
		> = {
		  tour01: {
		    image: "/imgs/tour01__.png",
		    label: "TOUR 01",
		    labelColor: "#000080",
		    title: "DOWNTOWN PALACE NAMSAN COURSE",
		    isPopular: false,
		  },
		  tour04: {
			    image: "/imgs/tour04home.png",
		    label: "TOUR 04",
		    labelColor: "#FFD700",
		    title: "NIGHT VIEW COURSE",
		    isPopular: true,
		  },
		  tour02: {
		    image: "/imgs/panorama.png",
		    label: "TOUR 02",
		    labelColor: "#C41E3A",
		    title: "PANORAMA COURSE",
		    isPopular: false,
		  },
		};
		
		const closeTourModal = (clearPending: boolean = true) => {
		  if (!tourModalOverlay) return;
		  tourModalOverlay.classList.remove("active");
		  tourModalOverlay.setAttribute("aria-hidden", "true");
		  document.body.classList.remove("promo-tour-modal-open");
		
		  if (clearPending) {
		    pendingAddItems = [];
		    pendingAddonTourOptional = false;
		  }
		};
		
		const updatePromoTourDisplay = (tourId: string) => {
		  const safeId = (ALL_TOURS.includes(tourId as TourId) ? (tourId as TourId) : "tour01") as TourId;
		  const tour = tourData[safeId];
		
		  if (tourImage) tourImage.src = tour.image;
		  if (tourLabel) {
		    tourLabel.textContent = tour.label;
		    tourLabel.style.background = tour.labelColor;
		  }
		  if (tourPopularBadge) {
		    tourPopularBadge.style.display = tour.isPopular ? "block" : "none";
		  }
		  if (tourTitle) tourTitle.textContent = tour.title;
		};
		
		const updateTourInfoPanel = (tourId: string) => {
		  if (!tourInfoPanel) return;
		  tourInfoPanel.querySelectorAll<HTMLElement>(".tour-info-content").forEach((section) => {
		    section.classList.remove("active");
		  });
		  const target = tourInfoPanel.querySelector<HTMLElement>(`.promo-${tourId}-info`);
		  if (target) target.classList.add("active");
		};

			// Step 2: mark cross-sell cards incompatible based on selected tour (prototype behavior)
			const updateProductCardCompatibility = (tourId: string) => {
				if (!tourModalOverlay) return;
				const cards = tourModalOverlay.querySelectorAll<HTMLElement>(
					'.promo-product-card[data-product-id]',
				);
				cards.forEach((card) => {
					const productId = card.dataset.productId || "";
					const product = promoProductData[productId];
					if (!product) return;
					const compatibleTours = product.compatibleTours;
					const isCompatible = !compatibleTours || compatibleTours.includes(tourId);
					card.classList.toggle("incompatible", !isCompatible);

					// Match prototype: only toggle label if present in markup.
					const label = card.querySelector<HTMLElement>(".promo-incompatible-label");
					if (label) label.style.display = isCompatible ? "none" : "block";
				});
			};

			// Step 2: cross-sell carousel (tabs + slides + dots) (prototype behavior)
			const initPromoCrossSellCarousel = (cleanupFns: Cleanup[]) => {
				if (!tourModalOverlay) return;

				const categoryTabs = Array.from(
					tourModalOverlay.querySelectorAll<HTMLButtonElement>(".promo-category-tab"),
				);
				const grids = Array.from(tourModalOverlay.querySelectorAll<HTMLElement>(".promo-products-grid"));
				if (categoryTabs.length === 0 || grids.length === 0) return;

				const setActiveCategory = (category: string) => {
					categoryTabs.forEach((t) => t.classList.toggle("active", t.dataset.category === category));
					grids.forEach((g) => g.classList.toggle("active", g.dataset.category === category));
				};

				categoryTabs.forEach((tab) => {
					const onTab = (e: MouseEvent) => {
						e.preventDefault();
						e.stopPropagation();
						setActiveCategory(tab.dataset.category || "products");
					};
					tab.addEventListener("click", onTab);
					cleanupFns.push(() => tab.removeEventListener("click", onTab));
				});

				// For each category grid, wire up its carousel controls
				grids.forEach((grid) => {
					const carousel = grid.querySelector<HTMLElement>(".promo-cross-sell-carousel");
					if (!carousel) return;
					const slides = Array.from(carousel.querySelectorAll<HTMLElement>(".promo-cross-sell-slide"));
					const prevBtn = carousel.querySelector<HTMLButtonElement>(".promo-cross-sell-nav.prev");
					const nextBtn = carousel.querySelector<HTMLButtonElement>(".promo-cross-sell-nav.next");
					const dotsContainer = grid.querySelector<HTMLElement>(".promo-cross-sell-dots");
					let currentSlide = 0;

						// Match prototype expectation: hide arrows when there's only 1 product/slide in the category.
						const hasMultipleSlides = slides.length > 1;
						if (prevBtn) {
							prevBtn.style.display = hasMultipleSlides ? "" : "none";
							prevBtn.setAttribute("aria-hidden", hasMultipleSlides ? "false" : "true");
							prevBtn.tabIndex = hasMultipleSlides ? 0 : -1;
						}
						if (nextBtn) {
							nextBtn.style.display = hasMultipleSlides ? "" : "none";
							nextBtn.setAttribute("aria-hidden", hasMultipleSlides ? "false" : "true");
							nextBtn.tabIndex = hasMultipleSlides ? 0 : -1;
						}

					const showSlide = (idx: number) => {
						if (slides.length === 0) return;
						let i = idx;
						if (i < 0) i = slides.length - 1;
						if (i >= slides.length) i = 0;
						currentSlide = i;
						slides.forEach((s, si) => s.classList.toggle("active", si === i));
						if (dotsContainer) {
							Array.from(dotsContainer.querySelectorAll<HTMLElement>(".dot")).forEach((d, di) => {
								d.classList.toggle("active", di === i);
							});
						}
					};

					if (dotsContainer) {
						dotsContainer.innerHTML = "";
						slides.forEach((_, i) => {
							const dot = document.createElement("span");
							dot.className = `dot${i === 0 ? " active" : ""}`;
							dotsContainer.appendChild(dot);
							const onDot = (e: MouseEvent) => {
								e.preventDefault();
								e.stopPropagation();
								showSlide(i);
							};
							dot.addEventListener("click", onDot);
							cleanupFns.push(() => dot.removeEventListener("click", onDot));
						});
					}

					const onPrev = (e: MouseEvent) => {
						e.preventDefault();
						e.stopPropagation();
						showSlide(currentSlide - 1);
					};
					const onNext = (e: MouseEvent) => {
						e.preventDefault();
						e.stopPropagation();
						showSlide(currentSlide + 1);
					};

					prevBtn?.addEventListener("click", onPrev);
					nextBtn?.addEventListener("click", onNext);
					cleanupFns.push(() => {
						prevBtn?.removeEventListener("click", onPrev);
						nextBtn?.removeEventListener("click", onNext);
					});

					showSlide(0);
				});

				// View Details buttons (event delegation)
				const onViewDetails = (e: MouseEvent) => {
					const target = e.target as HTMLElement;
					const btn = target.closest<HTMLButtonElement>(".promo-view-btn");
					if (!btn) return;
					e.preventDefault();
					e.stopPropagation();
					const card = btn.closest<HTMLElement>(".promo-product-card");
					const productId = card?.dataset.productId;
					if (!productId) return;
					openModal(productId, tourSelect?.value || null);
				};
				tourModalOverlay.addEventListener("click", onViewDetails);
				cleanupFns.push(() => tourModalOverlay.removeEventListener("click", onViewDetails));
			};

				// Step 2: map popup open/close (placeholder: icon + title; image will be swapped in later)
			const initPromoTourMapPopup = (cleanupFns: Cleanup[]) => {
				if (!tourModalOverlay || !promoMapPopup) return;

				const openMap = (tourId: string) => {
					const title =
						tourId === "tour01" ? "Tour 01 Map" : tourId === "tour04" ? "Tour 04 Map" : "Tour 02 Map";
					if (promoMapTitle) promoMapTitle.textContent = title;
					promoMapPopup.classList.add("active");
					promoMapPopup.setAttribute("aria-hidden", "false");
				};

				const closeMap = () => {
					promoMapPopup.classList.remove("active");
					promoMapPopup.setAttribute("aria-hidden", "true");
				};

				const onMapClick = (e: MouseEvent) => {
					const target = e.target as HTMLElement;
					const btn = target.closest<HTMLButtonElement>(".promo-tour-map-btn");
					if (!btn) return;
					e.preventDefault();
					e.stopPropagation();
					openMap(btn.dataset.tour || "tour01");
				};
				tourModalOverlay.addEventListener("click", onMapClick);
				cleanupFns.push(() => tourModalOverlay.removeEventListener("click", onMapClick));

				const onClose = (e: MouseEvent) => {
					e.preventDefault();
					e.stopPropagation();
					closeMap();
				};
				promoMapClose?.addEventListener("click", onClose);
				cleanupFns.push(() => promoMapClose?.removeEventListener("click", onClose));

				const onOverlay = (e: MouseEvent) => {
					if (e.target === promoMapPopup) closeMap();
				};
				promoMapPopup.addEventListener("click", onOverlay);
				cleanupFns.push(() => promoMapPopup.removeEventListener("click", onOverlay));
			};

		/** Update unit-price labels + total in the tour modal for a given tour. */
		const updatePromoTourPrices = (tourId: string) => {
			const p = TOUR_PRICES[tourId] || TOUR_PRICES.tour01;
			if (promoAdultUnitPrice) promoAdultUnitPrice.textContent = `$${p.adult.toFixed(2)} USD`;
			if (promoAdultUnitOrigPrice) promoAdultUnitOrigPrice.textContent = `$${p.adultOrig.toFixed(2)} USD`;
			if (promoChildUnitPrice) promoChildUnitPrice.textContent = `$${p.child.toFixed(2)} USD`;
			if (promoChildUnitOrigPrice) promoChildUnitOrigPrice.textContent = `$${p.childOrig.toFixed(2)} USD`;
			updatePromoTotalPrice();
		};

		/** Recalculate the tour-ticket total from current adult/child counts and selected tour. */
		const updatePromoTotalPrice = () => {
			const tourValue = tourSelect?.value || "tour01";
				// Keep state as the source of truth (DOM is kept in sync by the counter handlers)
				const adultQty = promoTourAdultQty;
				const childQty = promoTourChildQty;
			const p = TOUR_PRICES[tourValue] || TOUR_PRICES.tour01;

			const currentTotal = adultQty * p.adult + childQty * p.child;
			const originalTotal = adultQty * p.adultOrig + childQty * p.childOrig;

			if (promoTotalPrice) promoTotalPrice.textContent = `$${currentTotal.toFixed(2)}`;
			if (promoOriginalTotal) promoOriginalTotal.textContent = `$${originalTotal.toFixed(2)}`;

			// Enable/disable Continue button based on date & ticket selections
			updateTourContinueButtonState();
		};

		/** Enable the Continue button only when a date is selected AND at least 1 ticket. */
		const updateTourContinueButtonState = () => {
			if (!tourContinueBtn) return;
			const hasDate = promoSelectedDateDisplay
				? promoSelectedDateDisplay.textContent !== "Please select a date"
				: false;
				const adultQty = promoTourAdultQty;
				const childQty = promoTourChildQty;
			tourContinueBtn.disabled = !hasDate || adultQty + childQty < 1;
		};

		// ─── Step 3 helpers ───────────────────────────────────────────────

		/** Update the Step 3 order totals based on current ticket counts + add-ons + backstage. */
		const updatePromoStep3Totals = () => {
			if (!bookingInfoModal) return;

			const tourValue = tourSelect?.value || "tour01";
			const p = TOUR_PRICES[tourValue] || TOUR_PRICES.tour01;

			const adultQtyEl = bookingInfoModal.querySelector("#promoStep3AdultQty");
			const childQtyEl = bookingInfoModal.querySelector("#promoStep3ChildQty");
			const adultCount = adultQtyEl ? parseInt(adultQtyEl.textContent || "0", 10) || 0 : 0;
			const childCount = childQtyEl ? parseInt(childQtyEl.textContent || "0", 10) || 0 : 0;

			const ticketSubtotal = tourSelectionSkipped ? 0 : adultCount * p.adult + childCount * p.child;
			const addonsSubtotal = PromoUpsellCart.getTotal();
			const backstageTotal = (promoOrderData.backstageAdultQty * 8) + (promoOrderData.backstageChildQty * 5);
			const subtotal = ticketSubtotal + addonsSubtotal + backstageTotal;

			if (step3Subtotal) step3Subtotal.textContent = `$${subtotal.toFixed(2)}`;
			if (step3Total) step3Total.textContent = `$${subtotal.toFixed(2)}`;
		};

		/** Bind +/- ticket controls in the Step 3 order summary. */
		const bindPromoStep3TicketControls = () => {
			if (!bookingInfoModal) return;

			const tourValue = tourSelect?.value || "tour01";
			const p = TOUR_PRICES[tourValue] || TOUR_PRICES.tour01;

			bookingInfoModal.querySelectorAll<HTMLButtonElement>(".promo-step3-ticket-decrease, .promo-step3-ticket-increase").forEach((btn) => {
				btn.addEventListener("click", (e) => {
					e.preventDefault();
					e.stopPropagation();

					const type = btn.dataset.type; // "adult" or "child"
					const isIncrease = btn.classList.contains("promo-step3-ticket-increase");
					const cap = type === "adult" ? "Adult" : "Child";
					const qtySpan = bookingInfoModal.querySelector(`#promoStep3${cap}Qty`);
					const priceSpan = bookingInfoModal.querySelector(`#promoStep3${cap}Price`);

					if (qtySpan) {
						let currentQty = parseInt(qtySpan.textContent || "0", 10) || 0;
						currentQty = isIncrease ? Math.min(10, currentQty + 1) : Math.max(0, currentQty - 1);
						qtySpan.textContent = String(currentQty);

						const price = type === "adult" ? p.adult : p.child;
						if (priceSpan) priceSpan.textContent = `$${(price * currentQty).toFixed(2)}`;

						// Sync back to tour modal spans
						const countSpan = document.getElementById(`promo${cap}Count`);
						if (countSpan) countSpan.textContent = String(currentQty);

							// IMPORTANT: Step 2 total/continue validation uses the state vars as source of truth.
							// Keep them in sync when editing ticket counts in Step 3.
							if (type === "adult") promoTourAdultQty = currentQty;
							if (type === "child") promoTourChildQty = currentQty;
							updatePromoTotalPrice();
								persistPromoCartSession();

						updatePromoStep3Totals();
					}
				});
			});
		};

		/** Bind +/- and remove controls for add-on items in the Step 3 order summary. */
		const bindPromoStep3AddonControls = () => {
			if (!bookingInfoModal) return;

				const recomputeAddonQtyAndLinePrice = (item: PromoCartItem, nextQty: number) => {
					const clampedNextQty = Math.max(1, nextQty);

					// Physical add-ons: simple quantity × unit price.
					if (item.type === "physical") {
						item.quantity = clampedNextQty;
						item.computedLinePrice = (item.price || 0) * item.quantity;
						return;
					}

					// Ticketed add-ons: keep adult/child counts coherent.
					const currentAdult = typeof item.adultQty === "number" ? item.adultQty : 0;
					const currentChild = typeof item.childQty === "number" ? item.childQty : 0;
					const currentQty = currentAdult + currentChild;

					// If adult/child are missing, fall back to adjusting total only.
					if (currentQty <= 0) {
						item.quantity = clampedNextQty;
						item.computedLinePrice = (item.price || 0) * item.quantity;
						return;
					}

					let adult = currentAdult;
					let child = currentChild;
					const delta = clampedNextQty - currentQty;

					if (delta > 0) {
						// No adult/child selector exists in Step 3 UI; default to adding adults.
						adult += delta;
					} else if (delta < 0) {
						// Remove children first, then adults.
						let remaining = Math.abs(delta);
						while (remaining > 0 && (child > 0 || adult > 0)) {
							if (child > 0) child -= 1;
							else if (adult > 0) adult -= 1;
							remaining -= 1;
						}
					}

					item.adultQty = adult;
					item.childQty = child;
					item.quantity = adult + child;

					const product = promoProductData[item.productId];
					let adultPrice = product?.adultPrice ?? product?.price ?? item.price ?? 0;
					let childPrice = product?.childPrice ?? product?.price ?? item.price ?? 0;

					if (item.type === "cruise") {
						const selectedCruise =
							product?.cruiseTypes?.find((c) => c.id === item.cruiseType) || product?.cruiseTypes?.[0];
						adultPrice = selectedCruise?.adultPrice ?? adultPrice;
						childPrice = selectedCruise?.childPrice ?? childPrice;
					}

					item.computedLinePrice = adult * adultPrice + child * childPrice;
				};

			// Remove buttons
			bookingInfoModal.querySelectorAll<HTMLButtonElement>(".promo-step3-remove-addon-btn").forEach((btn) => {
				btn.addEventListener("click", (e) => {
					e.preventDefault();
					e.stopPropagation();
					const index = parseInt(btn.dataset.index || "-1", 10);
					if (index < 0) return;
					PromoUpsellCart.removeItem(index);
						// Keep cart bar hidden while Step 3 modal is open (removeItem() updates UI and may show it).
						if (cartBar) {
							cartBar.classList.remove("visible");
						}
					populatePromoStep3OrderSummary();
				});
			});

			// Quantity controls
			bookingInfoModal.querySelectorAll<HTMLButtonElement>(".promo-step3-addon-decrease, .promo-step3-addon-increase").forEach((btn) => {
				btn.addEventListener("click", (e) => {
					e.preventDefault();
					e.stopPropagation();
					const index = parseInt(btn.dataset.index || "-1", 10);
					if (index < 0) return;
					const isIncrease = btn.classList.contains("promo-step3-addon-increase");
					const item = PromoUpsellCart.items[index];
					if (!item) return;

						const nextQty = isIncrease ? item.quantity + 1 : item.quantity - 1;
						recomputeAddonQtyAndLinePrice(item, nextQty);

						// Update cart UI totals/counts (but keep bar hidden behind modal)
						PromoUpsellCart.updateUI();
						if (cartBar) {
							cartBar.classList.remove("visible");
						}
					populatePromoStep3OrderSummary();
				});
			});
		};

		/** Populate order summary in Step 3 modal from current tour + cart state. */
		const populatePromoStep3OrderSummary = () => {
			if (!bookingInfoModal) return;

			// Tour date
			const dateText = promoSelectedDateDisplay?.textContent || "";
			if (step3TourDate && dateText && dateText !== "Please select a date") {
				step3TourDate.textContent = dateText;
			}

			// Tour info
			const tourValue = tourSelect?.value || "tour01";
			const tourName = TOUR_NAMES[tourValue] || TOUR_NAMES.tour01;
			const adultCount = parseInt(promoAdultCount?.textContent || "0", 10) || 0;
			const childCount = parseInt(promoChildCount?.textContent || "0", 10) || 0;
			const p = TOUR_PRICES[tourValue] || TOUR_PRICES.tour01;

			// ── Tour tickets (editable) ──
			if (step3OrderTickets) {
				if (tourSelectionSkipped || (adultCount === 0 && childCount === 0)) {
					if (step3TicketsSection) step3TicketsSection.style.display = "none";
					step3OrderTickets.innerHTML = "";
				} else {
					if (step3TicketsSection) step3TicketsSection.style.display = "block";
					let html = "";
					if (adultCount > 0) {
							html += `<div class="order-item" data-type="adult"><div class="order-item-info"><div class="order-item-details"><h5>${tourName}</h5><div class="order-item-meta">Adult</div></div></div><div class="order-item-controls"><div class="order-item-qty"><button class="promo-step3-ticket-decrease" data-type="adult">-</button><span id="promoStep3AdultQty">${adultCount}</span><button class="promo-step3-ticket-increase" data-type="adult">+</button></div><div class="order-item-price"><span class="order-item-current" id="promoStep3AdultPrice">$${(p.adult * adultCount).toFixed(2)}</span></div></div></div>`;
					}
					if (childCount > 0) {
							html += `<div class="order-item" data-type="child"><div class="order-item-info"><div class="order-item-details"><h5>${tourName}</h5><div class="order-item-meta">Child</div></div></div><div class="order-item-controls"><div class="order-item-qty"><button class="promo-step3-ticket-decrease" data-type="child">-</button><span id="promoStep3ChildQty">${childCount}</span><button class="promo-step3-ticket-increase" data-type="child">+</button></div><div class="order-item-price"><span class="order-item-current" id="promoStep3ChildPrice">$${(p.child * childCount).toFixed(2)}</span></div></div></div>`;
					}
					step3OrderTickets.innerHTML = html;
					bindPromoStep3TicketControls();
				}
			}

			// ── Backstage pass (read-only) ──
			const bsAdult = promoOrderData.backstageAdultQty || 0;
			const bsChild = promoOrderData.backstageChildQty || 0;
			let backstageHtml = "";
			if (bsAdult > 0) {
				const bsDate = promoOrderData.backstageDate
					? new Date(promoOrderData.backstageDate + "T00:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })
					: "";
				backstageHtml += `<div class="order-item" data-type="backstage-adult"><div class="order-item-info"><div class="order-item-details"><h5>Sejong Backstage Pass</h5><div class="order-item-meta">Adult • ${bsDate}</div></div></div><div class="order-item-controls"><div class="order-item-qty"><span class="qty-display">× ${bsAdult}</span></div><div class="order-item-price"><span class="order-item-current">$${(bsAdult * 8).toFixed(2)}</span></div></div></div>`;
			}
			if (bsChild > 0) {
				const bsDate = promoOrderData.backstageDate
					? new Date(promoOrderData.backstageDate + "T00:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })
					: "";
				backstageHtml += `<div class="order-item" data-type="backstage-child"><div class="order-item-info"><div class="order-item-details"><h5>Sejong Backstage Pass</h5><div class="order-item-meta">Child • ${bsDate}</div></div></div><div class="order-item-controls"><div class="order-item-qty"><span class="qty-display">× ${bsChild}</span></div><div class="order-item-price"><span class="order-item-current">$${(bsChild * 5).toFixed(2)}</span></div></div></div>`;
			}

			// ── Add-ons (editable) ──
			const hasBackstage = bsAdult > 0 || bsChild > 0;
			if ((PromoUpsellCart.items.length > 0 || hasBackstage) && step3AddonsSection && step3OrderAddons) {
				step3AddonsSection.style.display = "block";
				let addonsHtml = "";

				PromoUpsellCart.items.forEach((item, index) => {
					let metaDesc = "";
					if (item.type === "scheduled") {
						const ds = item.selectedDate || "";
						const ts = item.selectedTime ? ` @ ${item.selectedTime}` : "";
						metaDesc = `${ds}${ts}`;
						if (item.adultQty || item.childQty) metaDesc += ` • Adult: ${item.adultQty || 0}, Child: ${item.childQty || 0}`;
					} else if (item.type === "physical") {
						metaDesc = `${item.variant}${item.color ? ` - ${item.color}` : ""}`;
					} else if (item.type === "validityPass") {
						metaDesc = `Adult: ${item.adultQty || 0}, Child: ${item.childQty || 0}`;
					} else if (item.type === "cruise") {
						const cn = item.cruiseTypeName || item.variant || "Cruise";
						const ds = item.selectedDate || "";
						const ts = item.selectedTimeSlot ? ` @ ${item.selectedTimeSlot}` : "";
						metaDesc = `${cn} • ${ds}${ts}`;
						if (item.adultQty || item.childQty) metaDesc += ` • Adult: ${item.adultQty || 0}, Child: ${item.childQty || 0}`;
					}
					const itemTotal = item.computedLinePrice || item.price * item.quantity;
					addonsHtml += `<div class="order-item addon-item" data-addon-index="${index}"><div class="order-item-info"><div class="order-item-details"><h5>${item.name}</h5><div class="order-item-meta">${metaDesc}</div></div></div><div class="order-item-controls"><div class="order-item-qty"><button class="promo-step3-addon-decrease" data-index="${index}">-</button><span>${item.quantity}</span><button class="promo-step3-addon-increase" data-index="${index}">+</button></div><div class="order-item-price"><span class="order-item-current">$${itemTotal.toFixed(2)}</span></div><button class="promo-step3-remove-addon-btn" data-index="${index}" title="Remove add-on">×</button></div></div>`;
				});

				step3OrderAddons.innerHTML = backstageHtml + addonsHtml;
				bindPromoStep3AddonControls();
			} else if (step3AddonsSection) {
				step3AddonsSection.style.display = "none";
				if (step3OrderAddons) step3OrderAddons.innerHTML = "";
			}

			// Totals
			const backstageTotal = (bsAdult * 8) + (bsChild * 5);
			const ticketSubtotal = tourSelectionSkipped ? 0 : (adultCount * p.adult) + (childCount * p.child);
			const addonsSubtotal = PromoUpsellCart.getTotal();
			const subtotal = ticketSubtotal + addonsSubtotal + backstageTotal;

			if (step3Subtotal) step3Subtotal.textContent = `$${subtotal.toFixed(2)}`;
			if (step3Total) step3Total.textContent = `$${subtotal.toFixed(2)}`;
		};

			// ─── Step 4 helpers ───────────────────────────────────────────────

			const updatePromoOrderSummaryTotals = () => {
				const backstageTotal = (promoOrderData.backstageAdultQty * 8) + (promoOrderData.backstageChildQty * 5);
				const ticketTotal = (promoOrderData.adultQty * promoOrderData.adultPrice) + (promoOrderData.childQty * promoOrderData.childPrice);
				const upsellTotal = PromoUpsellCart.getTotal();
				const subtotal = backstageTotal + ticketTotal + upsellTotal;

				const ticketOrigTotal = (promoOrderData.adultQty * promoOrderData.adultOrigPrice) + (promoOrderData.childQty * promoOrderData.childOrigPrice);
				const upsellOrigTotal = PromoUpsellCart.getOriginalTotal();
				const original = backstageTotal + ticketOrigTotal + upsellOrigTotal;
				const savings = original - subtotal;

				if (upsellSubtotal) upsellSubtotal.textContent = `$${subtotal.toFixed(2)}`;
				if (orderGrandTotal) orderGrandTotal.textContent = `$${subtotal.toFixed(2)}`;

				if (orderSavingsRow && orderSavings) {
					if (savings > 0.005) {
						orderSavingsRow.style.display = "flex";
						orderSavings.textContent = `$${savings.toFixed(2)}`;
					} else {
						orderSavingsRow.style.display = "none";
						orderSavings.textContent = "$0.00";
					}
				}
			};

			/** Populate the Step 4 Order Summary modal from promoOrderData + cart. */
			const populatePromoOrderSummary = () => {
				// Tour date meta
				if (orderTourDate) orderTourDate.textContent = promoOrderData.tourDate || "";

				// Tickets list (read-only): backstage + tour tickets
				let ticketsHTML = "";
				if (promoOrderData.backstageAdultQty > 0) {
					const t = promoOrderData.backstageAdultQty * 8;
					const d = promoOrderData.backstageDate
						? new Date(promoOrderData.backstageDate + "T00:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })
						: "";
					ticketsHTML += `<div class="order-item" data-type="backstage-adult"><div class="order-item-info"><div class="order-item-details"><h5>Sejong Backstage Pass</h5><div class="order-item-meta">Adult • ${d}</div></div></div><div class="order-item-controls"><div class="order-item-qty"><span class="qty-display">× ${promoOrderData.backstageAdultQty}</span></div><div class="order-item-price"><span class="order-item-current">$${t.toFixed(2)}</span></div></div></div>`;
				}
				if (promoOrderData.backstageChildQty > 0) {
					const t = promoOrderData.backstageChildQty * 5;
					const d = promoOrderData.backstageDate
						? new Date(promoOrderData.backstageDate + "T00:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })
						: "";
					ticketsHTML += `<div class="order-item" data-type="backstage-child"><div class="order-item-info"><div class="order-item-details"><h5>Sejong Backstage Pass</h5><div class="order-item-meta">Child • ${d}</div></div></div><div class="order-item-controls"><div class="order-item-qty"><span class="qty-display">× ${promoOrderData.backstageChildQty}</span></div><div class="order-item-price"><span class="order-item-current">$${t.toFixed(2)}</span></div></div></div>`;
				}
				if (promoOrderData.adultQty > 0) {
					const t = promoOrderData.adultQty * promoOrderData.adultPrice;
						ticketsHTML += `<div class="order-item" data-type="adult"><div class="order-item-info"><div class="order-item-details"><h5>${promoOrderData.tourName}</h5><div class="order-item-meta">Adult${promoOrderData.tourDate ? " • " + promoOrderData.tourDate : ""}</div></div></div><div class="order-item-controls"><div class="order-item-qty"><span class="qty-display">× ${promoOrderData.adultQty}</span></div><div class="order-item-price"><span class="order-item-current">$${t.toFixed(2)}</span></div></div></div>`;
				}
				if (promoOrderData.childQty > 0) {
					const t = promoOrderData.childQty * promoOrderData.childPrice;
						ticketsHTML += `<div class="order-item" data-type="child"><div class="order-item-info"><div class="order-item-details"><h5>${promoOrderData.tourName}</h5><div class="order-item-meta">Child${promoOrderData.tourDate ? " • " + promoOrderData.tourDate : ""}</div></div></div><div class="order-item-controls"><div class="order-item-qty"><span class="qty-display">× ${promoOrderData.childQty}</span></div><div class="order-item-price"><span class="order-item-current">$${t.toFixed(2)}</span></div></div></div>`;
				}
				if (orderTourTickets) orderTourTickets.innerHTML = ticketsHTML;
				if (orderTourTicketsSection) {
					orderTourTicketsSection.style.display = ticketsHTML ? "block" : "none";
				}

				// Add-ons list (read-only)
				if (orderUpsellItemsList) {
					let addonsHTML = "";
					PromoUpsellCart.items.forEach((item, index) => {
						let desc = item.variant || "Standard";
						if (item.type === "scheduled") {
							desc = `${item.selectedDate || ""}${item.selectedTime ? " @ " + item.selectedTime : ""}`;
						} else if (item.type === "validityPass") {
							desc = `Adult: ${item.adultQty || 0}, Child: ${item.childQty || 0}`;
						} else if (item.type === "cruise") {
							desc = `${item.cruiseTypeName || item.variant || "Cruise"} • ${item.selectedDate || ""}${item.selectedTimeSlot ? " @ " + item.selectedTimeSlot : ""}`;
						} else if (item.type === "physical") {
							desc = `${item.variant}${item.color ? " - " + item.color : ""}`;
						}
						const itemTotal = item.computedLinePrice || item.price * item.quantity;
						addonsHTML += `<div class="order-item" data-addon-index="${index}"><div class="order-item-info"><div class="order-item-details"><h5>${item.name}</h5><div class="order-item-meta">${desc}</div></div></div><div class="order-item-controls"><div class="order-item-qty"><span class="qty-display">× ${item.quantity}</span></div><div class="order-item-price"><span class="order-item-current">$${itemTotal.toFixed(2)}</span></div></div></div>`;
					});
					orderUpsellItemsList.innerHTML = addonsHTML;
					if (orderAddonsSection) orderAddonsSection.style.display = addonsHTML ? "block" : "none";
				}

				updatePromoOrderSummaryTotals();
			};

		// ─── Step 5 helpers ───────────────────────────────────────────────

		/** Calculate and display payment totals. */
		const updatePromoPaymentTotals = () => {
			const backstageTotal = (promoOrderData.backstageAdultQty * 8) + (promoOrderData.backstageChildQty * 5);
			const ticketSubtotal = (promoOrderData.adultQty * promoOrderData.adultPrice) +
				(promoOrderData.childQty * promoOrderData.childPrice);
			const upsellSubtotal = PromoUpsellCart.getTotal();
			const total = ticketSubtotal + upsellSubtotal + backstageTotal;

			if (paymentSubtotal) paymentSubtotal.textContent = `$${total.toFixed(2)}`;
			if (paymentTotal) paymentTotal.textContent = `$${total.toFixed(2)}`;
		};

		/** Populate and open the payment modal from promoOrderData + cart. */
		const openPaymentModal = () => {
			if (!paymentModal) return;

			// Tour date
			if (paymentTourDate && promoOrderData.tourDate) {
				paymentTourDate.textContent = promoOrderData.tourDate;
			}

			// Build tickets HTML (read-only)
			let ticketsHTML = "";

			// Backstage pass
			if (promoOrderData.backstageAdultQty > 0) {
				const t = promoOrderData.backstageAdultQty * 8;
				let bsd = "";
				if (promoOrderData.backstageDate) {
					bsd = new Date(promoOrderData.backstageDate + "T00:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
				}
				ticketsHTML += `<div class="order-item" data-type="backstage-adult"><div class="order-item-info"><div class="order-item-details"><h5>Sejong Backstage Pass</h5><div class="order-item-meta">Adult • ${bsd}</div></div></div><div class="order-item-controls"><div class="order-item-qty"><span class="qty-display">× ${promoOrderData.backstageAdultQty}</span></div><div class="order-item-price"><span class="order-item-current">$${t.toFixed(2)}</span></div></div></div>`;
			}
			if (promoOrderData.backstageChildQty > 0) {
				const t = promoOrderData.backstageChildQty * 5;
				let bsd = "";
				if (promoOrderData.backstageDate) {
					bsd = new Date(promoOrderData.backstageDate + "T00:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
				}
				ticketsHTML += `<div class="order-item" data-type="backstage-child"><div class="order-item-info"><div class="order-item-details"><h5>Sejong Backstage Pass</h5><div class="order-item-meta">Child • ${bsd}</div></div></div><div class="order-item-controls"><div class="order-item-qty"><span class="qty-display">× ${promoOrderData.backstageChildQty}</span></div><div class="order-item-price"><span class="order-item-current">$${t.toFixed(2)}</span></div></div></div>`;
			}

			// Tour tickets
			if (promoOrderData.adultQty > 0) {
				const at = promoOrderData.adultQty * promoOrderData.adultPrice;
					ticketsHTML += `<div class="order-item" data-type="adult"><div class="order-item-info"><div class="order-item-details"><h5>${promoOrderData.tourName}</h5><div class="order-item-meta">Adult${promoOrderData.tourDate ? " • " + promoOrderData.tourDate : ""}</div></div></div><div class="order-item-controls"><div class="order-item-qty"><span class="qty-display">× ${promoOrderData.adultQty}</span></div><div class="order-item-price"><span class="order-item-current">$${at.toFixed(2)}</span></div></div></div>`;
			}
			if (promoOrderData.childQty > 0) {
				const ct = promoOrderData.childQty * promoOrderData.childPrice;
					ticketsHTML += `<div class="order-item" data-type="child"><div class="order-item-info"><div class="order-item-details"><h5>${promoOrderData.tourName}</h5><div class="order-item-meta">Child${promoOrderData.tourDate ? " • " + promoOrderData.tourDate : ""}</div></div></div><div class="order-item-controls"><div class="order-item-qty"><span class="qty-display">× ${promoOrderData.childQty}</span></div><div class="order-item-price"><span class="order-item-current">$${ct.toFixed(2)}</span></div></div></div>`;
			}

			if (paymentOrderTickets) paymentOrderTickets.innerHTML = ticketsHTML;

			// Add-ons (read-only)
			if (PromoUpsellCart.items.length > 0 && paymentAddonsSection && paymentOrderAddons) {
				paymentAddonsSection.style.display = "block";
				let addonsHTML = "";

				PromoUpsellCart.items.forEach((item, index) => {
					let desc = item.variant || "Standard";
					if (item.type === "scheduled") {
						desc = `${item.selectedDate || ""}${item.selectedTime ? " @ " + item.selectedTime : ""}`;
					} else if (item.type === "validityPass") {
						desc = `Adult: ${item.adultQty || 0}, Child: ${item.childQty || 0}`;
					} else if (item.type === "cruise") {
						desc = `${item.cruiseTypeName || item.variant || "Cruise"} • ${item.selectedDate || ""}`;
					}
					const itemTotal = item.computedLinePrice || item.price * item.quantity;
					addonsHTML += `<div class="order-item" data-addon-index="${index}"><div class="order-item-info"><div class="order-item-details"><h5>${item.name}</h5><div class="order-item-meta">${desc}</div></div></div><div class="order-item-controls"><div class="order-item-qty"><span class="qty-display">× ${item.quantity}</span></div><div class="order-item-price"><span class="order-item-current">$${itemTotal.toFixed(2)}</span></div></div></div>`;
				});

				paymentOrderAddons.innerHTML = addonsHTML;
			} else if (paymentAddonsSection) {
				paymentAddonsSection.style.display = "none";
			}

			updatePromoPaymentTotals();
				paymentModal.classList.add("active");
				paymentModal.setAttribute("aria-hidden", "false");
				document.body.style.overflow = "hidden";
		};

		const applyTourOptions = (allowedTours: string[]) => {
		  if (!tourSelect) return;
		  const allowed = new Set(allowedTours);
		
		  Array.from(tourSelect.options).forEach((opt) => {
		    const ok = allowed.has(opt.value);
		    opt.disabled = !ok;
		    // Hide disallowed options to match prototype filtering behavior.
		    (opt as HTMLOptionElement).style.display = ok ? "" : "none";
		  });
		
		  const defaultTour =
		    (lastTourContext && allowed.has(lastTourContext) ? lastTourContext : allowedTours[0]) || "tour01";
		  tourSelect.value = defaultTour;
		  updatePromoTourDisplay(defaultTour);
		  updateTourInfoPanel(defaultTour);
		
		  if (tourContinueBtn) tourContinueBtn.disabled = allowedTours.length === 0;
		};
		
		const computeAllowedTours = (pendingTours: string[] | null): string[] => {
		  let allowed = [...ALL_TOURS] as string[];
		  if (pendingTours && pendingTours.length > 0) {
		    const pendingSet = new Set(pendingTours);
		    allowed = allowed.filter((t) => pendingSet.has(t));
		  }
		
		  const constrained = getConstrainedToursFromCart();
		  if (constrained && constrained.length > 0) {
		    const constrainedSet = new Set(constrained);
		    allowed = allowed.filter((t) => constrainedSet.has(t));
		  }
			
			  // Prototype quirk: Tour 02 is only surfaced when either:
			  // - there is at least one "universal" add-on in the cart (compatibleTours: null), OR
			  // - the user came from a Tour 02 context (homepage slide)
			  // Even if other add-ons constrain tours, the prototype still surfaces Tour 02 in these cases.
			  const hasUniversalAddonInCart = PromoUpsellCart.items.some((item) => {
			    const p = promoProductData[item.productId];
			    return p?.compatibleTours === null;
			  });
			  if (hasUniversalAddonInCart || lastTourContext === "tour02") {
			    const set = new Set(allowed);
			    set.add("tour02");
			    // Keep stable ordering (tour01, tour02, tour04)
			    allowed = (Array.from(ALL_TOURS) as string[]).filter((t) => set.has(t));
			  }
			
			  return allowed;
		};
		
			const openTourModalForAddon = (opts: {
			  addonName: string;
			  compatibleTours: string[] | null;
			  /** Whether the *pending* add-on can be purchased without selecting a tour. */
			  tourOptional: boolean;
			  /** Items that should be added after tour selection (prototype only defers adds in some flows). */
			  itemsToAdd: PromoCartItem[];
			}) => {
		  if (!tourModalOverlay) return;
		
		  pendingAddItems = opts.itemsToAdd;
			  // Match prototype: show "Continue without Tour" only when *all cart items* are tour-optional
			  // AND there is no pending add-on that requires a tour.
			  const pendingAddonRequiresTour = pendingAddItems.length > 0 && !opts.tourOptional;
			  const allCartItemsTourOptional =
			    PromoUpsellCart.items.length > 0 &&
			    PromoUpsellCart.items.every((item) => {
			      const p = promoProductData[item.productId];
			      return p && p.tourOptional === true;
			    });
			  const canSkipTour = allCartItemsTourOptional && !pendingAddonRequiresTour;
			  pendingAddonTourOptional = canSkipTour;
		
		  // Subtitle
		  if (tourSelectionSubtitle) {
			    tourSelectionSubtitle.textContent = `Choose a tour to pair with your ${opts.addonName}.`;
		  }
		
			  // Skip button: prototype rules (see canSkipTour above)
		  if (tourSkipBtn) {
			    tourSkipBtn.style.display = canSkipTour ? "" : "none";
		  }
		
		  const allowedTours = computeAllowedTours(opts.compatibleTours);
		  applyTourOptions(allowedTours);

						// Ensure Step 2 UI pieces are ready (cross-sell compatibility labels)

			  // If user already has a cart session, keep their previously entered date/tickets.
			  // Otherwise, reset to a fresh Step 2 state.
			  if (PromoUpsellCart.getItemCount() <= 0) {
			    promoTourSelectedDate = null;
			    promoTourAdultQty = 1;
			    promoTourChildQty = 0;
			    if (promoSelectedDateDisplay) promoSelectedDateDisplay.textContent = "Please select a date";
			    if (promoAdultCount) promoAdultCount.textContent = "1";
			    if (promoChildCount) promoChildCount.textContent = "0";
			  } else {
			    if (promoAdultCount) promoAdultCount.textContent = String(promoTourAdultQty);
			    if (promoChildCount) promoChildCount.textContent = String(promoTourChildQty);
			    if (promoSelectedDateDisplay) {
			      if (promoTourSelectedDate) {
			        const d = new Date(promoTourSelectedDate);
			        promoSelectedDateDisplay.textContent = d.toLocaleDateString("en-US", {
			          weekday: "short",
			          year: "numeric",
			          month: "short",
			          day: "numeric",
			        });
			      } else {
			        promoSelectedDateDisplay.textContent = "Please select a date";
			      }
			    }
			  }
		  const defaultTourId = tourSelect?.value || "tour01";
		  updatePromoTourPrices(defaultTourId);
				updateProductCardCompatibility(defaultTourId);
		  // Continue starts disabled (no date selected yet)
		  updateTourContinueButtonState();

		  tourModalOverlay.classList.add("active");
		  tourModalOverlay.setAttribute("aria-hidden", "false");
		  document.body.classList.add("promo-tour-modal-open");
		};

			type OpenTourModalFromHeroDetail = {
			  preferredTour?: string | null;
			  adultCount?: number;
			  childCount?: number;
			  dateText?: string | null;
			};

			/**
			 * Open the full promo tour selection modal from the homepage hero booking CTA.
			 * This reuses the same UI (tour image, bullets, map popup, add-on carousel) as the add-on-first flow.
			 */
			const openTourModalFromHero = (detail: OpenTourModalFromHeroDetail = {}) => {
			  if (!tourModalOverlay) return;

			  // No deferred add-on items in the hero-start flow.
			  pendingAddItems = [];
			  pendingAddonTourOptional = false;

			  if (tourSelectionSubtitle) {
			    tourSelectionSubtitle.textContent = "Choose your tour, date, and tickets. Add-ons are optional.";
			  }
			  // Hero booking should always require a tour.
			  if (tourSkipBtn) tourSkipBtn.style.display = "none";

			  const preferred = (detail.preferredTour || null) as TourId | null;
			  if (preferred && ALL_TOURS.includes(preferred)) {
			    lastTourContext = preferred;
			  }

			  const allowedTours = computeAllowedTours(null);
			  applyTourOptions(allowedTours);

			  // If a preferred tour is allowed, snap to it after options are applied.
			  if (preferred && allowedTours.includes(preferred) && tourSelect) {
			    tourSelect.value = preferred;
			    updatePromoTourDisplay(preferred);
			    updateTourInfoPanel(preferred);
			  }

			  // Reset or restore date/tickets like the add-on flow.
			  if (PromoUpsellCart.getItemCount() <= 0) {
			    promoTourSelectedDate = null;
			    promoTourAdultQty = 1;
			    promoTourChildQty = 0;
			    if (promoSelectedDateDisplay) promoSelectedDateDisplay.textContent = "Please select a date";
			    if (promoAdultCount) promoAdultCount.textContent = "1";
			    if (promoChildCount) promoChildCount.textContent = "0";
			  } else {
			    if (promoAdultCount) promoAdultCount.textContent = String(promoTourAdultQty);
			    if (promoChildCount) promoChildCount.textContent = String(promoTourChildQty);
			    if (promoSelectedDateDisplay) {
			      if (promoTourSelectedDate) {
			        const d = new Date(promoTourSelectedDate);
			        promoSelectedDateDisplay.textContent = d.toLocaleDateString("en-US", {
			          weekday: "short",
			          year: "numeric",
			          month: "short",
			          day: "numeric",
			        });
			      } else {
			        promoSelectedDateDisplay.textContent = "Please select a date";
			      }
			    }
			  }

			  // Best-effort: sync from booking widget values if present.
			  const clampQty = (n: number) => Math.max(0, Math.min(10, n));
			  const aFromWidget = typeof detail.adultCount === "number" ? clampQty(detail.adultCount) : null;
			  const cFromWidget = typeof detail.childCount === "number" ? clampQty(detail.childCount) : null;
			  if (aFromWidget != null && cFromWidget != null && aFromWidget + cFromWidget > 0) {
			    promoTourAdultQty = aFromWidget;
			    promoTourChildQty = cFromWidget;
			    if (promoAdultCount) promoAdultCount.textContent = String(aFromWidget);
			    if (promoChildCount) promoChildCount.textContent = String(cFromWidget);
			  }

			  const dateText = (detail.dateText || "").trim();
			  if (dateText && dateText !== "Select a date") {
			    const parsed = new Date(dateText);
			    if (!Number.isNaN(parsed.getTime())) {
			      promoTourSelectedDate = parsed.toISOString();
			      if (promoSelectedDateDisplay) {
			        promoSelectedDateDisplay.textContent = parsed.toLocaleDateString("en-US", {
			          weekday: "short",
			          year: "numeric",
			          month: "short",
			          day: "numeric",
			        });
			      }
			    }
			  }

			  const defaultTourId = tourSelect?.value || "tour01";
			  updatePromoTourPrices(defaultTourId);
			  updateProductCardCompatibility(defaultTourId);
			  updateTourContinueButtonState();

			  tourModalOverlay.classList.add("active");
			  tourModalOverlay.setAttribute("aria-hidden", "false");
			  document.body.classList.add("promo-tour-modal-open");
			};
		
		  const setViewCartButtonState = (isExpanded: boolean) => {
		    if (!viewCartBtn) return;
		    viewCartBtn.innerHTML = isExpanded
		      ? `Hide Cart <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="18 15 12 9 6 15"></polyline></svg>`
		      : `View Cart <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>`;
		  };
		
		  const renderPromoCartItems = () => {
		    if (!cartItemsList) return;
		
		    const items = PromoUpsellCart.items;
		
		    if (items.length === 0) {
		      cartItemsList.innerHTML = '<div style="padding: 20px; text-align: center; color: #666;">Your cart is empty</div>';
		      if (cartTotalExpanded) cartTotalExpanded.textContent = "$0.00";
		      if (cartSavingsRow) cartSavingsRow.style.display = "none";
		      return;
		    }
		
		    let html = "";
		    let total = 0;
		    let originalTotal = 0;
		
		    items.forEach((item, index) => {
		      const product = promoProductData[item.productId];
		      const imageUrl = item.image || product?.image || null;
		      const placeholder = item.placeholder || product?.placeholder || "🛒";
		
		      const itemPrice =
		        typeof item.computedLinePrice === "number" ? item.computedLinePrice : (item.price || 0) * (item.quantity || 0);
		      const itemOrigPrice = (item.originalPrice || item.price || 0) * (item.quantity || 0);
		
		      total += itemPrice;
		      originalTotal += itemOrigPrice;
		
		      let metaInfo = "";
		      if (item.type === "physical") {
		        metaInfo = `${item.variant}${item.color ? " - " + item.color : ""}`;
		      } else if (item.type === "scheduled") {
		        metaInfo = `${item.selectedDate || ""} ${item.selectedTime || ""}`.trim();
		      } else if (item.type === "cruise") {
		        metaInfo = `${item.cruiseTypeName || item.variant} - ${item.selectedDate || ""} ${item.selectedTimeSlot || ""}`.trim();
		      } else if (item.type === "validityPass") {
		        metaInfo = `Valid until ${item.validUntil || "N/A"}`;
		      }
		
		      html += `
		        <div class="cart-item">
		          <div class="cart-item-image">
		            ${imageUrl ? `<img src="${imageUrl}" alt="${item.name}">` : `<div class="cart-item-placeholder">${placeholder}</div>`}
		          </div>
		          <div class="cart-item-details">
		            <div class="cart-item-name">${item.name}</div>
		            ${metaInfo ? `<div class="cart-item-meta"><div class="cart-item-meta-line">${metaInfo}</div></div>` : ""}
		            <div class="cart-item-price">$${itemPrice.toFixed(2)}</div>
		          </div>
		          <button class="cart-item-remove" data-index="${index}" type="button" aria-label="Remove">×</button>
		        </div>
		      `;
		    });
		
		    cartItemsList.innerHTML = html;
		
		    if (cartTotalExpanded) cartTotalExpanded.textContent = `$${total.toFixed(2)}`;
		
		    const savings = originalTotal - total;
		    if (savings > 0.005 && cartSavingsRow && cartSavings) {
		      cartSavingsRow.style.display = "flex";
		      cartSavings.textContent = `$${savings.toFixed(2)}`;
		    } else if (cartSavingsRow) {
		      cartSavingsRow.style.display = "none";
		    }
		
		    cartItemsList.querySelectorAll<HTMLButtonElement>(".cart-item-remove").forEach((btn) => {
		      btn.addEventListener("click", () => {
		        const idx = parseInt(btn.dataset.index || "-1", 10);
		        if (!Number.isFinite(idx) || idx < 0) return;
		        PromoUpsellCart.removeItem(idx);
		        // removeItem() triggers updateUI(), which will rerender if expanded is open.
		      });
		    });
		  };
		
		  const initPromoCartBar = (cleanupFns: Cleanup[]) => {
		    if (!viewCartBtn || !cartExpanded) return;
		
		    const onToggle = (e: MouseEvent) => {
		      e.preventDefault();
		      e.stopPropagation();
		
		      cartExpanded.classList.toggle("show");
		      const isExpanded = cartExpanded.classList.contains("show");
		      setViewCartButtonState(isExpanded);
		      if (isExpanded) renderPromoCartItems();
		    };
		
		    viewCartBtn.addEventListener("click", onToggle);
		    cleanupFns.push(() => viewCartBtn.removeEventListener("click", onToggle));
		
		    if (collapseCartBtn) {
		      const onCollapse = (e: MouseEvent) => {
		        e.preventDefault();
		        e.stopPropagation();
		        cartExpanded.classList.remove("show");
		        setViewCartButtonState(false);
		      };
		      collapseCartBtn.addEventListener("click", onCollapse);
		      cleanupFns.push(() => collapseCartBtn.removeEventListener("click", onCollapse));
		    }
		
		    // Ensure initial label state
		    setViewCartButtonState(cartExpanded.classList.contains("show"));

			    // "Continue to Booking" button → open tour selection modal (match prototype behavior)
		    if (promoContinueToBookingBtn) {
		      const onContinueToBooking = (e: MouseEvent) => {
		        e.preventDefault();
		        e.stopPropagation();
			        // Prototype: once the user explicitly continues, they are in the "with tour" path
			        // unless they click "Continue without Tour" again.
			        tourSelectionSkipped = false;
		        // Collapse expanded cart first
		        cartExpanded.classList.remove("show");
		        setViewCartButtonState(false);

			        // Open tour modal for date/ticket selection; cart items are already in the cart.
			        openTourModalForAddon({
			          addonName: "selected add-ons",
			          compatibleTours: null,
			          tourOptional: true,
			          itemsToAdd: [],
			        });
		      };
		      promoContinueToBookingBtn.addEventListener("click", onContinueToBooking);
		      cleanupFns.push(() => promoContinueToBookingBtn.removeEventListener("click", onContinueToBooking));
		    }
		  };

	  const promoCanAddToCart = (product: PromoCurrentProduct, selections: PromoSelections) => {
	    if (product.type === "physical") {
	      return (selections.quantity || 0) >= 1;
	    }

	    if (product.type === "scheduled") {
	      const hasDate = !!selections.date;
	      const requiresTime = !!(product.availableTimes && product.availableTimes.length > 0);
	      const hasTime = !requiresTime || !!selections.time;
	      const hasTickets = ((selections.adultQty || 0) + (selections.childQty || 0)) >= 1;
	      return hasDate && hasTime && hasTickets;
	    }

	    if (product.type === "validityPass") {
	      const hasTickets = ((selections.adultQty || 0) + (selections.childQty || 0)) >= 1;
	      return hasTickets;
	    }

	    if (product.type === "cruise") {
	      const hasCruiseType = !!selections.cruiseType;
	      const hasDate = !!selections.date;
	      const hasTimeSlot = !!selections.timeSlot;
	      const hasTickets = ((selections.adultQty || 0) + (selections.childQty || 0)) >= 1;
	      return hasCruiseType && hasDate && hasTimeSlot && hasTickets;
	    }

	    return (selections.quantity || 0) >= 1;
	  };

	  const promoBuildCartPayload = (product: PromoCurrentProduct, selections: PromoSelections): PromoCartItem => {
	    const basePayload = {
	      productId: product.id,
	      name: product.name,
	      type: product.type,
	      category: product.category,
	      price: product.price,
	      originalPrice: product.originalPrice,
	      image: product.image,
	      placeholder: product.placeholder,
	    };

	    if (product.type === "physical") {
	      const qty = selections.quantity || 1;
	      return {
	        ...basePayload,
	        variant: selections.variant || "Standard",
	        color: selections.color || null,
	        quantity: qty,
	        computedLinePrice: product.price * qty,
	      };
	    }

	    if (product.type === "scheduled") {
	      const adultQty = selections.adultQty || 0;
	      const childQty = selections.childQty || 0;
	      const adultPrice = product.adultPrice || product.price;
	      const childPrice = product.childPrice || product.price;
	      return {
	        ...basePayload,
	        variant: selections.variant || "Standard",
	        selectedDate: selections.date || null,
	        selectedTime: selections.time || null,
	        adultQty,
	        childQty,
	        quantity: adultQty + childQty,
	        computedLinePrice: adultQty * adultPrice + childQty * childPrice,
	      };
	    }

	    if (product.type === "validityPass") {
	      const adultQty = selections.adultQty || 0;
	      const childQty = selections.childQty || 0;
	      const adultPrice = product.adultPrice || product.price;
	      const childPrice = product.childPrice || product.price;
	      return {
	        ...basePayload,
	        variant: selections.variant || "Standard",
	        validUntil: product.validUntil || null,
	        adultQty,
	        childQty,
	        quantity: adultQty + childQty,
	        computedLinePrice: adultQty * adultPrice + childQty * childPrice,
	      };
	    }

	    if (product.type === "cruise") {
	      const cruiseTypes = product.cruiseTypes || [];
	      const selectedCruise = cruiseTypes.find((c) => c.id === selections.cruiseType) || cruiseTypes[0];
	      const adultQty = selections.adultQty || 0;
	      const childQty = selections.childQty || 0;
	      const adultPrice = selectedCruise?.adultPrice || product.adultPrice || 0;
	      const childPrice = selectedCruise?.childPrice || product.childPrice || 0;

	      return {
	        ...basePayload,
	        variant: selectedCruise?.name || selections.variant || "Standard",
	        cruiseType: selections.cruiseType || null,
	        cruiseTypeName: selectedCruise?.name || null,
	        image: selectedCruise?.image || product.image,
	        selectedDate: selections.date || null,
	        selectedTimeSlot: selections.timeSlot || null,
	        adultQty,
	        childQty,
	        quantity: adultQty + childQty,
	        computedLinePrice: adultQty * adultPrice + childQty * childPrice,
	      };
	    }

	    const qty = selections.quantity || 1;
	    return {
	      ...basePayload,
	      variant: selections.variant || "Standard",
	      quantity: qty,
	      computedLinePrice: product.price * qty,
	    };
	  };

	  let typeUiCleanups: Cleanup[] = [];
	  const cleanupTypeUI = () => {
	    typeUiCleanups.forEach((fn) => fn());
	    typeUiCleanups = [];
	    document.getElementById("promoTypeSpecificUI")?.remove();
	  };

	  const updatePromoAddToCartButton = () => {
	    if (!addBtn) return;

	    let total = 0;
	    let disable = false;

	    if (!promoCurrentProduct) {
	      disable = true;
	    } else if (promoCurrentProduct.type === "physical") {
	      const qtyValues = overlay.querySelectorAll<HTMLElement>(".promo-color-qty-value");
	      if (qtyValues.length > 0) {
	        let items = 0;
	        qtyValues.forEach((el) => {
	          const q = parseInt(el.textContent || "0", 10) || 0;
	          items += q;
	          total += q * promoCurrentProduct!.price;
	        });
	        disable = items === 0;
	      } else {
	        total = promoCurrentProduct.price * promoProductQuantity;
	        disable = promoProductQuantity <= 0;
	      }
	    } else if (promoCurrentProduct.type === "scheduled" || promoCurrentProduct.type === "validityPass") {
	      const adultPrice = promoCurrentProduct.adultPrice || promoCurrentProduct.price;
	      const childPrice = promoCurrentProduct.childPrice || promoCurrentProduct.price;
	      total = promoProductAdultQty * adultPrice + promoProductChildQty * childPrice;
	      disable =
	        !promoCanAddToCart(promoCurrentProduct, {
	          variant: promoCurrentVariant?.name || promoCurrentVariant?.id || "Standard",
	          date: promoProductSelectedDate,
	          time: promoProductSelectedTime,
	          adultQty: promoProductAdultQty,
	          childQty: promoProductChildQty,
	        });
	    } else if (promoCurrentProduct.type === "cruise") {
	      const selectedCruise =
	        promoCurrentProduct.cruiseTypes?.find((c) => c.id === promoProductSelectedCruiseType) ||
	        promoCurrentProduct.cruiseTypes?.[0];
	      const adultPrice = selectedCruise?.adultPrice || promoCurrentProduct.adultPrice || 0;
	      const childPrice = selectedCruise?.childPrice || promoCurrentProduct.childPrice || 0;
	      total = promoProductAdultQty * adultPrice + promoProductChildQty * childPrice;
	      disable =
	        !promoCanAddToCart(promoCurrentProduct, {
	          variant: promoCurrentVariant?.name || promoCurrentVariant?.id || "Standard",
	          cruiseType: promoProductSelectedCruiseType,
	          date: promoProductSelectedDate,
	          timeSlot: promoProductSelectedTimeSlot,
	          adultQty: promoProductAdultQty,
	          childQty: promoProductChildQty,
	        });
	    }

	    addBtn.textContent = `Add to Cart - $${total.toFixed(2)}`;
	    addBtn.disabled = disable;
	  };

	  const renderPromoTypeSpecificUI = (product: PromoCurrentProduct) => {
	    cleanupTypeUI();
	    if (!descEl) return;

	    const today = new Date().toISOString().slice(0, 10);
	    let html = "";

	    if (product.type === "physical" && product.colors && product.colors.length > 0) {
	      html = `
	        <div class="promo-type-ui promo-physical" id="promoTypeSpecificUI">
	          <h3 class="promo-section-title">Select Color & Quantity</h3>
	          <div class="promo-color-qty-list">
	            ${product.colors
	              .map(
	                (c, idx) => `
	                <div class="promo-color-qty-item" data-color-index="${idx}" data-color-name="${c.name}">
	                  <div class="promo-color-qty-left">
	                    <img class="promo-color-thumb" src="${c.image}" alt="${c.name}" />
	                    <div class="promo-color-meta">
	                      <div class="promo-color-name">${c.name}</div>
	                      <div class="promo-color-price">$${product.price.toFixed(2)}</div>
	                    </div>
	                  </div>
	                  <div class="promo-color-qty-controls">
	                    <button type="button" class="promo-color-qty-btn" data-action="decrease" data-color-index="${idx}" disabled>-</button>
	                    <span class="promo-color-qty-value" data-color-index="${idx}">0</span>
	                    <button type="button" class="promo-color-qty-btn" data-action="increase" data-color-index="${idx}">+</button>
	                  </div>
	                </div>
	              `,
	              )
	              .join("")}
	          </div>
	          <div class="promo-color-totals">
	            <span class="promo-color-total-items">0 items selected</span>
	            <span class="promo-color-total-price">$0.00</span>
	          </div>
	        </div>
	      `;
	    }

		    if (product.type === "scheduled") {
	      const hasTimes = !!(product.availableTimes && product.availableTimes.length > 0);
	      html = `
	        <div class="promo-type-ui promo-scheduled" id="promoTypeSpecificUI">
	          <h3 class="promo-section-title">Select Date${hasTimes ? " & Time" : ""}</h3>
	          <div class="promo-datetime-row">
	            <input class="promo-date-input" id="promoAddonDatePicker" type="date" min="${today}" />
	            ${
	              hasTimes
	                ? `<select class="promo-time-select" id="promoAddonTimePicker">
	                    <option value="">Select Time</option>
	                    ${(product.availableTimes || []).map((t) => `<option value="${t}">${t}</option>`).join("")}
	                  </select>`
	                : ""
	            }
		            ${
		              product.operationHours
		                ? `<div class="promo-operation-hours-box">All day, operation hours &quot;${product.operationHours}&quot;</div>`
		                : ""
		            }
	          </div>
	
	          <div class="promo-ticket-section">
	            <h3 class="promo-section-title">Select Tickets</h3>
	            <div class="promo-ticket-row">
	              <div class="promo-ticket-label">Adult <span class="promo-ticket-price" id="promoAddonAdultPrice">$${(
	                product.adultPrice || product.price
	              ).toFixed(2)}</span></div>
	              <div class="promo-ticket-controls">
		                <button type="button" class="promo-addon-qty-btn" data-type="adult" data-action="decrease" disabled>-</button>
	                <span class="promo-ticket-qty" id="promoAddonAdultQty">0</span>
	                <button type="button" class="promo-addon-qty-btn" data-type="adult" data-action="increase">+</button>
	              </div>
	            </div>
	            <div class="promo-ticket-row">
	              <div class="promo-ticket-label">Child <span class="promo-ticket-price" id="promoAddonChildPrice">$${(
	                product.childPrice || product.price
	              ).toFixed(2)}</span></div>
	              <div class="promo-ticket-controls">
		                <button type="button" class="promo-addon-qty-btn" data-type="child" data-action="decrease" disabled>-</button>
	                <span class="promo-ticket-qty" id="promoAddonChildQty">0</span>
	                <button type="button" class="promo-addon-qty-btn" data-type="child" data-action="increase">+</button>
	              </div>
	            </div>
	          </div>
	        </div>
	      `;
	    }

	    if (product.type === "validityPass") {
	      html = `
	        <div class="promo-type-ui promo-validity" id="promoTypeSpecificUI">
		          ${
		            product.validUntil
		              ? `<div class="promo-validity-banner"><span class="promo-validity-icon">📅</span> Valid until ${product.validUntil}</div>`
		              : ""
		          }
	
	          <div class="promo-ticket-section">
	            <h3 class="promo-section-title">Select Tickets</h3>
	            <div class="promo-ticket-row">
	              <div class="promo-ticket-label">Adult <span class="promo-ticket-price" id="promoAddonAdultPrice">$${(
	                product.adultPrice || product.price
	              ).toFixed(2)}</span></div>
	              <div class="promo-ticket-controls">
		                <button type="button" class="promo-addon-qty-btn" data-type="adult" data-action="decrease" disabled>-</button>
	                <span class="promo-ticket-qty" id="promoAddonAdultQty">0</span>
	                <button type="button" class="promo-addon-qty-btn" data-type="adult" data-action="increase">+</button>
	              </div>
	            </div>
	            <div class="promo-ticket-row">
	              <div class="promo-ticket-label">Child <span class="promo-ticket-price" id="promoAddonChildPrice">$${(
	                product.childPrice || product.price
	              ).toFixed(2)}</span></div>
	              <div class="promo-ticket-controls">
		                <button type="button" class="promo-addon-qty-btn" data-type="child" data-action="decrease" disabled>-</button>
	                <span class="promo-ticket-qty" id="promoAddonChildQty">0</span>
	                <button type="button" class="promo-addon-qty-btn" data-type="child" data-action="increase">+</button>
	              </div>
	            </div>
	          </div>
	        </div>
	      `;
	    }

	    if (product.type === "cruise" && product.cruiseTypes && product.cruiseTypes.length > 0) {
	      const initial = product.cruiseTypes[0];
	      promoProductSelectedCruiseType = initial.id;
	      promoProductSelectedTimeSlot = null;
	
	      html = `
	        <div class="promo-type-ui promo-cruise" id="promoTypeSpecificUI">
	          <h3 class="promo-section-title">Select Cruise Type</h3>
	          <div class="promo-cruise-type-selector">
	            ${product.cruiseTypes
	              .map(
	                (c, idx) => `
	                <button type="button" class="promo-cruise-type-option ${idx === 0 ? "selected" : ""}" data-cruise-id="${
	                  c.id
	                }" data-adult-price="${c.adultPrice}" data-child-price="${c.childPrice}">
	                  <img src="${c.image}" alt="${c.name}" />
	                  <span class="promo-cruise-name">${c.name}</span>
		                  <span class="promo-cruise-price">$${c.adultPrice.toFixed(2)}</span>
		                  <span class="promo-cruise-orig">$${c.originalPrice.toFixed(2)}</span>
	                </button>
	              `,
	              )
	              .join("")}
	          </div>

	          <h3 class="promo-section-title">Select Date</h3>
	          <input class="promo-date-input" id="promoAddonDatePicker" type="date" min="${today}" />

	          <h3 class="promo-section-title">Select Time Slot</h3>
	          <div class="promo-time-slot-selector">
	            ${(product.timeSlots || [])
	              .map(
	                (s) => `
	                <button type="button" class="promo-time-slot-option" data-slot-value="${s.value}">${s.label}</button>
	              `,
	              )
	              .join("")}
	          </div>

	          <div class="promo-ticket-section">
	            <h3 class="promo-section-title">Select Tickets</h3>
	            <div class="promo-ticket-row">
	              <div class="promo-ticket-label">Adult <span class="promo-ticket-price" id="promoAddonAdultPrice">$${initial.adultPrice.toFixed(
	                2,
	              )}</span></div>
	              <div class="promo-ticket-controls">
		                <button type="button" class="promo-addon-qty-btn" data-type="adult" data-action="decrease" disabled>-</button>
	                <span class="promo-ticket-qty" id="promoAddonAdultQty">0</span>
	                <button type="button" class="promo-addon-qty-btn" data-type="adult" data-action="increase">+</button>
	              </div>
	            </div>
	            <div class="promo-ticket-row">
	              <div class="promo-ticket-label">Child <span class="promo-ticket-price" id="promoAddonChildPrice">$${initial.childPrice.toFixed(
	                2,
	              )}</span></div>
	              <div class="promo-ticket-controls">
		                <button type="button" class="promo-addon-qty-btn" data-type="child" data-action="decrease" disabled>-</button>
	                <span class="promo-ticket-qty" id="promoAddonChildQty">0</span>
	                <button type="button" class="promo-addon-qty-btn" data-type="child" data-action="increase">+</button>
	              </div>
	            </div>
	          </div>
	        </div>
	      `;
	    }

	    if (!html) return;
	    descEl.insertAdjacentHTML("afterend", html);

	    const typeUI = document.getElementById("promoTypeSpecificUI");
	    if (!typeUI) return;

	    const colorList = typeUI.querySelector<HTMLElement>(".promo-color-qty-list");
	    if (colorList) {
	      const updateTotals = () => {
	        let items = 0;
	        let total = 0;
	        typeUI.querySelectorAll<HTMLElement>(".promo-color-qty-value").forEach((el) => {
	          const q = parseInt(el.textContent || "0", 10) || 0;
	          items += q;
	          total += q * product.price;
	        });
	        const itemsEl = typeUI.querySelector<HTMLElement>(".promo-color-total-items");
	        const priceEl2 = typeUI.querySelector<HTMLElement>(".promo-color-total-price");
	        if (itemsEl) itemsEl.textContent = `${items} item${items === 1 ? "" : "s"} selected`;
	        if (priceEl2) priceEl2.textContent = `$${total.toFixed(2)}`;
	        updatePromoAddToCartButton();
	      };

	      const onColorClick = (e: MouseEvent) => {
	        const target = e.target as HTMLElement;
	        const btn = target.closest<HTMLButtonElement>(".promo-color-qty-btn");
	        if (!btn) return;
	        e.preventDefault();
	        e.stopPropagation();

	        const action = btn.dataset.action;
	        const idx = btn.dataset.colorIndex;
	        if (!action || idx === undefined) return;
	
	        const valueEl = typeUI.querySelector<HTMLElement>(`.promo-color-qty-value[data-color-index="${idx}"]`);
	        const decBtn = typeUI.querySelector<HTMLButtonElement>(
	          `.promo-color-qty-btn[data-action="decrease"][data-color-index="${idx}"]`,
	        );
	        if (!valueEl) return;
	
	        let q = parseInt(valueEl.textContent || "0", 10) || 0;
	        if (action === "increase") q += 1;
	        if (action === "decrease") q = Math.max(0, q - 1);
	        valueEl.textContent = String(q);
	        if (decBtn) decBtn.disabled = q === 0;
	
	        const row = valueEl.closest<HTMLElement>(".promo-color-qty-item");
	        if (row) row.classList.toggle("selected", q > 0);
	
	        updateTotals();
	      };
	
	      colorList.addEventListener("click", onColorClick);
	      typeUiCleanups.push(() => colorList.removeEventListener("click", onColorClick));
	      updateTotals();
	    }

	    const datePicker = typeUI.querySelector<HTMLInputElement>("#promoAddonDatePicker");
	    if (datePicker) {
	      const onDateChange = () => {
	        promoProductSelectedDate = datePicker.value || null;
	        updatePromoAddToCartButton();
	      };
	      datePicker.addEventListener("change", onDateChange);
	      datePicker.addEventListener("input", onDateChange);
	      typeUiCleanups.push(() => {
	        datePicker.removeEventListener("change", onDateChange);
	        datePicker.removeEventListener("input", onDateChange);
	      });
	    }

	    const timePicker = typeUI.querySelector<HTMLSelectElement>("#promoAddonTimePicker");
	    if (timePicker) {
	      const onTimeChange = () => {
	        promoProductSelectedTime = timePicker.value || null;
	        updatePromoAddToCartButton();
	      };
	      timePicker.addEventListener("change", onTimeChange);
	      typeUiCleanups.push(() => timePicker.removeEventListener("change", onTimeChange));
	    }

	    const cruiseOptions = Array.from(typeUI.querySelectorAll<HTMLButtonElement>(".promo-cruise-type-option"));
	    if (cruiseOptions.length > 0) {
	      const onCruiseOption = (e: MouseEvent) => {
	        const target = e.target as HTMLElement;
	        const btn = target.closest<HTMLButtonElement>(".promo-cruise-type-option");
	        if (!btn) return;
	        e.preventDefault();
	        e.stopPropagation();
	
	        cruiseOptions.forEach((b) => b.classList.remove("selected"));
	        btn.classList.add("selected");
	        promoProductSelectedCruiseType = btn.dataset.cruiseId || null;
		
		        const selectedCruise = (product.cruiseTypes || []).find((c) => c.id === promoProductSelectedCruiseType);
		        if (selectedCruise) {
		          // Update the headline image + pricing to match the selected cruise type (prototype behavior)
		          if (imgEl) {
		            imgEl.src = selectedCruise.image;
		            imgEl.style.display = "block";
		            if (placeholderEl) (placeholderEl as HTMLElement).style.display = "none";
		          }
		          if (priceEl) priceEl.textContent = `$${selectedCruise.price.toFixed(2)} USD`;
		          if (origPriceEl) origPriceEl.textContent = `$${selectedCruise.originalPrice.toFixed(2)} USD`;
		        }
	
	        const adult = parseFloat(btn.dataset.adultPrice || "0") || 0;
	        const child = parseFloat(btn.dataset.childPrice || "0") || 0;
	        const adultPriceEl = typeUI.querySelector<HTMLElement>("#promoAddonAdultPrice");
	        const childPriceEl = typeUI.querySelector<HTMLElement>("#promoAddonChildPrice");
	        if (adultPriceEl) adultPriceEl.textContent = `$${adult.toFixed(2)}`;
	        if (childPriceEl) childPriceEl.textContent = `$${child.toFixed(2)}`;
	
	        updatePromoAddToCartButton();
	      };
	
	      typeUI.addEventListener("click", onCruiseOption);
	      typeUiCleanups.push(() => typeUI.removeEventListener("click", onCruiseOption));
	    }

	    const slots = Array.from(typeUI.querySelectorAll<HTMLButtonElement>(".promo-time-slot-option"));
	    if (slots.length > 0) {
	      const onSlot = (e: MouseEvent) => {
	        const target = e.target as HTMLElement;
	        const btn = target.closest<HTMLButtonElement>(".promo-time-slot-option");
	        if (!btn) return;
	        e.preventDefault();
	        e.stopPropagation();
	        slots.forEach((b) => b.classList.remove("selected"));
	        btn.classList.add("selected");
	        promoProductSelectedTimeSlot = btn.dataset.slotValue || null;
	        updatePromoAddToCartButton();
	      };
	      typeUI.addEventListener("click", onSlot);
	      typeUiCleanups.push(() => typeUI.removeEventListener("click", onSlot));
	    }

	    const onTicketClick = (e: MouseEvent) => {
	      const target = e.target as HTMLElement;
	      const btn = target.closest<HTMLButtonElement>(".promo-addon-qty-btn");
	      if (!btn) return;
	      e.preventDefault();
	      e.stopPropagation();
	
	      const type = btn.dataset.type;
	      const action = btn.dataset.action;
	
	      if (type === "adult") {
	        if (action === "increase") promoProductAdultQty += 1;
	        if (action === "decrease") promoProductAdultQty = Math.max(0, promoProductAdultQty - 1);
	        const display = typeUI.querySelector<HTMLElement>("#promoAddonAdultQty");
	        if (display) display.textContent = String(promoProductAdultQty);
		        const dec = typeUI.querySelector<HTMLButtonElement>(
		          `.promo-addon-qty-btn[data-type="adult"][data-action="decrease"]`,
		        );
		        if (dec) dec.disabled = promoProductAdultQty === 0;
	      }
	
	      if (type === "child") {
	        if (action === "increase") promoProductChildQty += 1;
	        if (action === "decrease") promoProductChildQty = Math.max(0, promoProductChildQty - 1);
	        const display = typeUI.querySelector<HTMLElement>("#promoAddonChildQty");
	        if (display) display.textContent = String(promoProductChildQty);
		        const dec = typeUI.querySelector<HTMLButtonElement>(
		          `.promo-addon-qty-btn[data-type="child"][data-action="decrease"]`,
		        );
		        if (dec) dec.disabled = promoProductChildQty === 0;
	      }
	
	      updatePromoAddToCartButton();
	    };
	
	    typeUI.addEventListener("click", onTicketClick);
	    typeUiCleanups.push(() => typeUI.removeEventListener("click", onTicketClick));
	  };

	  const openModal = (productId: string, sourceTour: string | null) => {
	    const product = promoProductData[productId];
	    if (!product) return;

	    promoCurrentProduct = { id: productId, ...product };
	    promoCurrentVariant = product.variants?.[0] || null;
	    promoProductQuantity = 1;
	    promoProductSelectedDate = null;
	    promoProductSelectedTime = null;
	    promoProductAdultQty = 0;
	    promoProductChildQty = 0;
		    promoProductSelectedCruiseType = null;
	    promoProductSelectedTimeSlot = null;
	
	    lastTourContext = sourceTour ?? lastTourContext;
	    syncContinueHref();

	    if (titleEl) titleEl.textContent = product.name;
	    if (nameEl) nameEl.textContent = product.name;
	    if (descEl) descEl.textContent = product.description;
	    if (priceEl) priceEl.textContent = `$${product.price.toFixed(2)} USD`;
	    if (origPriceEl) origPriceEl.textContent = `$${product.originalPrice.toFixed(2)} USD`;
		
		    // Cruise products have per-cruise pricing; default to the first cruise type (prototype behavior)
		    if (product.type === "cruise" && product.cruiseTypes && product.cruiseTypes.length > 0) {
		      const firstCruise = product.cruiseTypes[0];
		      promoProductSelectedCruiseType = firstCruise.id;
		      if (priceEl) priceEl.textContent = `$${firstCruise.price.toFixed(2)} USD`;
		      if (origPriceEl) origPriceEl.textContent = `$${firstCruise.originalPrice.toFixed(2)} USD`;
		    }

		    if (imgEl) {
		      const emptyImgSrc = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
		
		      if (product.type === "cruise" && product.cruiseTypes && product.cruiseTypes.length > 0) {
		        // Show the selected cruise type image in the header (not the generic product image)
		        const firstCruise = product.cruiseTypes[0];
		        imgEl.src = firstCruise.image;
		        imgEl.style.display = "block";
		        if (placeholderEl) (placeholderEl as HTMLElement).style.display = "none";
		      } else if (product.image) {
		        imgEl.src = product.image;
		        imgEl.style.display = "block";
		        if (placeholderEl) (placeholderEl as HTMLElement).style.display = "none";
		      } else {
		        // Never set src="" in React; it triggers a warning + can cause a needless network fetch.
		        imgEl.src = emptyImgSrc;
		        imgEl.style.display = "none";
		        if (placeholderEl) {
		          (placeholderEl as HTMLElement).style.display = "block";
		          placeholderEl.textContent = product.placeholder ?? "📦";
		        }
		      }
		    }

	    if (variantTabs) {
	      if (product.variants && product.variants.length > 0) {
	        variantTabs.innerHTML = product.variants
	          .map(
	            (v, idx) => `
		              <button type="button" class="promo-variant-tab ${idx === 0 ? "active" : ""}" data-variant-index="${idx}">
		                ${product.image ? `<img src="${product.image}" alt="${v.name}" />` : `<div class="tab-placeholder">${product.placeholder || "📦"}</div>`}
		                <span>${v.name}</span>
		              </button>
	            `,
	          )
	          .join("");
	      } else {
	        variantTabs.innerHTML = "";
	      }
	    }

	    renderPromoTypeSpecificUI(promoCurrentProduct);
	    updatePromoAddToCartButton();

	    overlay.classList.add("active");
	    overlay.setAttribute("aria-hidden", "false");
	    document.body.classList.add("promo-product-modal-open");
	  };

	  const closeModal = () => {
	    overlay.classList.remove("active");
	    overlay.setAttribute("aria-hidden", "true");
	    document.body.classList.remove("promo-product-modal-open");

	    cleanupTypeUI();
	    promoCurrentProduct = null;
	    promoCurrentVariant = null;
	    promoProductSelectedCruiseType = null;
	    promoProductSelectedTimeSlot = null;
	  };

			  const cleanupFns: Cleanup[] = [];
				  initPromoCartBar(cleanupFns);
				  loadPromoCartSession();
				  cleanupFns.push(() => stopPromoCartTimer());
					  cleanupFns.push(() => {
						  if (promoCartPulseTimeoutId != null) window.clearTimeout(promoCartPulseTimeoutId);
						  if (promoCartIconTimeoutId != null) window.clearTimeout(promoCartIconTimeoutId);
						  if (promoCartFeedbackTimeoutId != null) window.clearTimeout(promoCartFeedbackTimeoutId);
						  if (promoCartToastTimeoutId != null) window.clearTimeout(promoCartToastTimeoutId);
						  if (cartBar) cartBar.classList.remove("pulse");
						  const icon = cartBar?.querySelector<HTMLElement>(".cart-bar-icon") ?? null;
						  if (icon) icon.style.transform = "";
						  if (cartFeedbackEl) cartFeedbackEl.classList.remove("show");
						  if (cartToastEl) cartToastEl.classList.remove("show");
					  });
			
			  const initPromoTourSelectionModal = (cleanupFns: Cleanup[]) => {
			    if (!tourModalOverlay) return;

			    // ---------- Close / overlay dismiss ----------
			    const onCloseTour = (e: Event) => {
			      e.preventDefault();
			      closeTourModal(true);
			    };
			    tourModalCloseBtn?.addEventListener("click", onCloseTour);
			    cleanupFns.push(() => tourModalCloseBtn?.removeEventListener("click", onCloseTour));

			    const onOverlayClickTour = (e: MouseEvent) => {
			      if (e.target === tourModalOverlay) closeTourModal(true);
			    };
			    tourModalOverlay.addEventListener("click", onOverlayClickTour);
			    cleanupFns.push(() => tourModalOverlay.removeEventListener("click", onOverlayClickTour));

			    // ---------- Tour dropdown → update display + prices ----------
			    const onTourSelectChange = () => {
			      if (!tourSelect) return;
			      const selected = tourSelect.value;
			      updatePromoTourDisplay(selected);
			      updateTourInfoPanel(selected);
			      updatePromoTourPrices(selected);
						updateProductCardCompatibility(selected);
			    };
			    tourSelect?.addEventListener("change", onTourSelectChange);
			    cleanupFns.push(() => tourSelect?.removeEventListener("change", onTourSelectChange));

						// Step 2: cross-sell carousel + map popup
					initPromoCrossSellCarousel(cleanupFns);
					initPromoTourMapPopup(cleanupFns);
					updateProductCardCompatibility(tourSelect?.value || "tour01");

						// Allow the hero booking CTA to open this same modal (full UI parity).
						const onOpenFromHero = (e: Event) => {
							const ce = e as CustomEvent<OpenTourModalFromHeroDetail>;
							openTourModalFromHero(ce.detail || {});
						};
						document.addEventListener("tb:openPromoTourSelectionFromHero", onOpenFromHero);
						cleanupFns.push(() => document.removeEventListener("tb:openPromoTourSelectionFromHero", onOpenFromHero));

			    // ---------- Calendar (date picker) ----------
			    if (promoCalendarDropdown && promoCalendarDays && promoCurrentMonth && promoSelectedDateDisplay) {
				      // The tour modal uses an inner scroll container (overflow-y: auto). If the calendar dropdown
				      // stays inside that container (position: absolute), it can get clipped/cut off. To prevent that,
				      // we temporarily "portal" the dropdown to the tour modal overlay and position it with `fixed`.
				      let promoCalendarOriginalParent: HTMLElement | null = null;
				      let promoCalendarOriginalNextSibling: Element | null = null;
				      let promoCalendarPortaled = false;
				      let promoCalendarRaf = 0;

				      const clearPromoCalendarInlineStyles = () => {
				        promoCalendarDropdown.style.position = "";
				        promoCalendarDropdown.style.top = "";
				        promoCalendarDropdown.style.left = "";
				        promoCalendarDropdown.style.right = "";
					        promoCalendarDropdown.style.transform = "";
				        promoCalendarDropdown.style.width = "";
					        promoCalendarDropdown.style.maxWidth = "";
					        promoCalendarDropdown.style.boxSizing = "";
				        promoCalendarDropdown.style.zIndex = "";
				      };

				      const portalPromoCalendar = () => {
				        if (promoCalendarPortaled) return;
				        if (!tourModalOverlay) return;
				        promoCalendarOriginalParent = promoCalendarDropdown.parentElement as HTMLElement | null;
				        promoCalendarOriginalNextSibling = promoCalendarDropdown.nextElementSibling;
				        tourModalOverlay.appendChild(promoCalendarDropdown);
				        promoCalendarPortaled = true;
				      };

				      const restorePromoCalendar = () => {
				        if (!promoCalendarPortaled) return;
				        if (promoCalendarOriginalParent) {
				          if (promoCalendarOriginalNextSibling) {
				            promoCalendarOriginalParent.insertBefore(promoCalendarDropdown, promoCalendarOriginalNextSibling);
				          } else {
				            promoCalendarOriginalParent.appendChild(promoCalendarDropdown);
				          }
				        }
				        promoCalendarPortaled = false;
				        clearPromoCalendarInlineStyles();
				      };

				      const positionPromoCalendar = () => {
				        if (!promoDateTrigger) return;
				        if (!promoCalendarDropdown.classList.contains("active")) return;
				        if (!promoCalendarPortaled) return;

				        const margin = 12;
				        const triggerRect = promoDateTrigger.getBoundingClientRect();
				        const dropdownHeight = promoCalendarDropdown.getBoundingClientRect().height || promoCalendarDropdown.offsetHeight;
					        const maxWidth = 350;
					        let width = Math.min(maxWidth, triggerRect.width || maxWidth);
					        width = Math.max(0, Math.min(width, window.innerWidth - margin * 2));

					        let left = triggerRect.left + (triggerRect.width / 2) - (width / 2);
				        left = Math.max(margin, Math.min(left, window.innerWidth - margin - width));

				        let top = triggerRect.bottom + 6;
				        if (top + dropdownHeight > window.innerHeight - margin) {
				          top = triggerRect.top - dropdownHeight - 6;
				        }
				        top = Math.max(margin, Math.min(top, window.innerHeight - margin - dropdownHeight));

					        // Neutralize any global `.calendar-dropdown` transforms/positioning that might bleed in.
					        promoCalendarDropdown.style.position = "fixed";
				        promoCalendarDropdown.style.left = `${left}px`;
				        promoCalendarDropdown.style.top = `${top}px`;
				        promoCalendarDropdown.style.right = "auto";
					        promoCalendarDropdown.style.transform = "none";
				        promoCalendarDropdown.style.width = `${width}px`;
					        promoCalendarDropdown.style.maxWidth = `${maxWidth}px`;
					        promoCalendarDropdown.style.boxSizing = "border-box";
					        // Keep above the tour modal overlay (10000000) content, but below the product modal overlay (10000001).
					        promoCalendarDropdown.style.zIndex = "10000000";
				      };

				      const schedulePromoCalendarPosition = () => {
				        if (promoCalendarRaf) cancelAnimationFrame(promoCalendarRaf);
				        promoCalendarRaf = requestAnimationFrame(() => {
				          promoCalendarRaf = 0;
					          // Run twice to account for layout changes after the dropdown becomes visible.
					          positionPromoCalendar();
					          requestAnimationFrame(positionPromoCalendar);
				        });
				      };

				      const openPromoCalendar = () => {
				        portalPromoCalendar();
				        promoCalendarDropdown.classList.add("active");
				        renderPromoCalendar();
				        schedulePromoCalendarPosition();
				      };

				      const closePromoCalendar = () => {
				        promoCalendarDropdown.classList.remove("active");
				        restorePromoCalendar();
				      };

			      const now = new Date();
			      let calMonth = now.getMonth();
			      let calYear = now.getFullYear();

			      const monthNames = [
			        "January","February","March","April","May","June",
			        "July","August","September","October","November","December",
			      ];

			      const renderPromoCalendar = () => {
			        if (!promoCurrentMonth || !promoCalendarDays) return;
			        const firstDay = new Date(calYear, calMonth, 1).getDay();
			        const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
			        promoCurrentMonth.textContent = `${monthNames[calMonth]} ${calYear}`;
			        promoCalendarDays.innerHTML = "";

			        const today = new Date();
			        today.setHours(0, 0, 0, 0);

			        for (let i = 0; i < firstDay; i++) {
			          const empty = document.createElement("span");
			          empty.className = "day empty";
			          promoCalendarDays.appendChild(empty);
			        }

			        for (let d = 1; d <= daysInMonth; d++) {
			          const dayEl = document.createElement("span");
			          dayEl.className = "day";
			          dayEl.textContent = String(d);

			          const dateObj = new Date(calYear, calMonth, d);
			          const isPast = dateObj < today;
			          const isMonday = dateObj.getDay() === 1;
			          // 70% available demo (matches prototype)
			          const isAvailable = !isPast && !isMonday && Math.random() < 0.7;

			          if (isPast || isMonday) {
			            dayEl.classList.add("disabled");
			            if (isMonday && !isPast) dayEl.title = "Closed on Mondays";
			          } else if (isAvailable) {
			            dayEl.classList.add("available");
			            const dot = document.createElement("span");
			            dot.className = "dot available";
			            dayEl.appendChild(dot);

			            // Highlight if already selected
			            if (
			              promoTourSelectedDate &&
			              dateObj.toDateString() === new Date(promoTourSelectedDate).toDateString()
			            ) {
			              dayEl.classList.add("selected");
			            }

			            dayEl.addEventListener("click", () => {
			              promoCalendarDays?.querySelectorAll(".day").forEach((el) => el.classList.remove("selected"));
			              dayEl.classList.add("selected");

			              const sel = new Date(calYear, calMonth, d);
			              promoTourSelectedDate = sel.toISOString();
			              if (promoSelectedDateDisplay) {
			                promoSelectedDateDisplay.textContent = sel.toLocaleDateString("en-US", {
			                  weekday: "short", year: "numeric", month: "short", day: "numeric",
			                });
			              }
				          	  closePromoCalendar();
			              updateTourContinueButtonState();
			        persistPromoCartSession();
			            });
			          } else {
			            dayEl.classList.add("sold-out", "disabled");
			            const dot = document.createElement("span");
			            dot.className = "dot sold-out";
			            dayEl.appendChild(dot);
			          }

			          promoCalendarDays.appendChild(dayEl);
			        }
			      };

			      // Toggle calendar
			      const onDateTriggerClick = (e: MouseEvent) => {
			        e.preventDefault();
			        e.stopPropagation();
				        const isOpening = !promoCalendarDropdown.classList.contains("active");
				        if (isOpening) openPromoCalendar();
				        else closePromoCalendar();
			      };
			      promoDateTrigger?.addEventListener("click", onDateTriggerClick);
			      cleanupFns.push(() => promoDateTrigger?.removeEventListener("click", onDateTriggerClick));

			      // Close calendar button
				      const onCloseCalendar = () => closePromoCalendar();
			      promoCloseCalendar?.addEventListener("click", onCloseCalendar);
			      cleanupFns.push(() => promoCloseCalendar?.removeEventListener("click", onCloseCalendar));

			      // Month navigation
				      const onPrevMonth = () => {
				        calMonth--;
				        if (calMonth < 0) {
				          calMonth = 11;
				          calYear--;
				        }
				        renderPromoCalendar();
				        schedulePromoCalendarPosition();
				      };
				      const onNextMonth = () => {
				        calMonth++;
				        if (calMonth > 11) {
				          calMonth = 0;
				          calYear++;
				        }
				        renderPromoCalendar();
				        schedulePromoCalendarPosition();
				      };
			      promoPrevMonth?.addEventListener("click", onPrevMonth);
			      promoNextMonth?.addEventListener("click", onNextMonth);
			      cleanupFns.push(() => { promoPrevMonth?.removeEventListener("click", onPrevMonth); promoNextMonth?.removeEventListener("click", onNextMonth); });

			      // Outside click closes calendar
			      const onDocClickCal = (e: MouseEvent) => {
			        const t = e.target as Node | null;
			        if (!t) return;
			        if (!promoCalendarDropdown.contains(t) && !promoDateTrigger?.contains(t)) {
				          closePromoCalendar();
			        }
			      };
			      document.addEventListener("click", onDocClickCal);
			      cleanupFns.push(() => document.removeEventListener("click", onDocClickCal));

				      // Keep positioned correctly if the user scrolls the modal content while the calendar is open.
				      const promoTourScrollable =
				        tourModalOverlay.querySelector<HTMLElement>(".promo-tour-modal .popup-scrollable-content") ??
				        tourModalOverlay.querySelector<HTMLElement>(".popup-scrollable-content");
				      const onPromoCalendarScrollOrResize = () => {
				        if (!promoCalendarDropdown.classList.contains("active")) return;
				        schedulePromoCalendarPosition();
				      };
				      promoTourScrollable?.addEventListener("scroll", onPromoCalendarScrollOrResize);
				      window.addEventListener("resize", onPromoCalendarScrollOrResize);
				      cleanupFns.push(() => {
				        promoTourScrollable?.removeEventListener("scroll", onPromoCalendarScrollOrResize);
				        window.removeEventListener("resize", onPromoCalendarScrollOrResize);
				        if (promoCalendarRaf) cancelAnimationFrame(promoCalendarRaf);
				        closePromoCalendar();
				      });

			      renderPromoCalendar();
			    }

			    // ---------- Ticket counters ----------
			    const updateCounter = (span: HTMLElement | null, delta: number) => {
			      if (!span) return;
			      let val = parseInt(span.textContent || "0", 10) || 0;
			      val = Math.max(0, Math.min(10, val + delta));
			      span.textContent = String(val);
			      // Sync state
			      if (span === promoAdultCount) promoTourAdultQty = val;
			      if (span === promoChildCount) promoTourChildQty = val;
			      updatePromoTotalPrice();
			      persistPromoCartSession();
			    };

			    const onAdultMinus = () => updateCounter(promoAdultCount, -1);
			    const onAdultPlus  = () => updateCounter(promoAdultCount, 1);
			    const onChildMinus = () => updateCounter(promoChildCount, -1);
			    const onChildPlus  = () => updateCounter(promoChildCount, 1);

			    promoAdultMinus?.addEventListener("click", onAdultMinus);
			    promoAdultPlus?.addEventListener("click", onAdultPlus);
			    promoChildMinus?.addEventListener("click", onChildMinus);
			    promoChildPlus?.addEventListener("click", onChildPlus);
			    cleanupFns.push(() => {
			      promoAdultMinus?.removeEventListener("click", onAdultMinus);
			      promoAdultPlus?.removeEventListener("click", onAdultPlus);
			      promoChildMinus?.removeEventListener("click", onChildMinus);
			      promoChildPlus?.removeEventListener("click", onChildPlus);
			    });

			    // ---------- Continue with Tour ----------
			    const onContinue = (e: Event) => {
			      e.preventDefault();
			      if (!tourSelect) return;

			      // Validate date
			      if (!promoTourSelectedDate || promoSelectedDateDisplay?.textContent === "Please select a date") {
			        alert("Please select a date");
			        return;
			      }
			      // Validate at least 1 ticket
					const aQty = promoTourAdultQty;
					const cQty = promoTourChildQty;
			      if (aQty + cQty < 1) {
			        alert("Please select at least 1 ticket");
			        return;
			      }

			      promoSelectedTour = tourSelect.value;
			      tourSelectionSkipped = false;
			      lastTourContext = promoSelectedTour;
					// (promoTourAdultQty / promoTourChildQty are already in sync via the counter handlers)

			      const toAdd = pendingAddItems.slice();
			      closeTourModal(true);
			      toAdd.forEach((item) => PromoUpsellCart.addItem(item));

			      // Open Step 3: Booking Information
			      populatePromoStep3OrderSummary();
			      if (bookingInfoModal) {
			        bookingInfoModal.classList.add("active");
			        bookingInfoModal.setAttribute("aria-hidden", "false");
			        document.body.style.overflow = "hidden";
			      }
			      // Hide cart bar while booking info modal is open
			      if (cartBar) cartBar.classList.remove("visible");
			    };
			    tourContinueBtn?.addEventListener("click", onContinue);
			    cleanupFns.push(() => tourContinueBtn?.removeEventListener("click", onContinue));

			    // ---------- Skip (Continue without Tour) ----------
			    const onSkip = (e: Event) => {
			      e.preventDefault();
			      if (!pendingAddonTourOptional) return;

			      promoSelectedTour = null;
			      tourSelectionSkipped = true;
			      lastTourContext = null;

			      const toAdd = pendingAddItems.slice();
			      closeTourModal(true);
			      toAdd.forEach((item) => PromoUpsellCart.addItem(item));

			      // Open Step 3: Booking Information
			      populatePromoStep3OrderSummary();
			      if (bookingInfoModal) {
			        bookingInfoModal.classList.add("active");
			        bookingInfoModal.setAttribute("aria-hidden", "false");
			        document.body.style.overflow = "hidden";
			      }
			      if (cartBar) cartBar.classList.remove("visible");
			    };
			    tourSkipBtn?.addEventListener("click", onSkip);
			    cleanupFns.push(() => tourSkipBtn?.removeEventListener("click", onSkip));
			  };
			
			  initPromoTourSelectionModal(cleanupFns);

		// ─── Step 3: Booking Information Modal ───────────────────────────
		const initPromoBookingInfoModal = (cFns: (() => void)[]) => {
			if (!bookingInfoModal) return;

			const closeBookingInfo = () => {
				bookingInfoModal.classList.remove("active");
				bookingInfoModal.setAttribute("aria-hidden", "true");
				document.body.style.overflow = "";
				// Show cart bar if items exist
				if (cartBar && PromoUpsellCart.getItemCount() > 0) {
					cartBar.classList.add("visible");
				}
			};

			const goBackToTourModal = () => {
				bookingInfoModal.classList.remove("active");
				bookingInfoModal.setAttribute("aria-hidden", "true");
				// Re-open tour selection modal
				if (tourModalOverlay) {
					tourModalOverlay.classList.add("active");
					tourModalOverlay.setAttribute("aria-hidden", "false");
					document.body.classList.add("promo-tour-modal-open");
				}
				// Show cart bar
				if (cartBar && PromoUpsellCart.getItemCount() > 0) {
					cartBar.classList.add("visible");
				}
			};

			// Back button (prominent)
			const onProminentBack = (e: Event) => { e.preventDefault(); goBackToTourModal(); };
			prominentBackBtn?.addEventListener("click", onProminentBack);
			cFns.push(() => prominentBackBtn?.removeEventListener("click", onProminentBack));

			// Close button
			const onCloseBooking = (e: Event) => { e.preventDefault(); closeBookingInfo(); };
			closeBookingInfoBtn?.addEventListener("click", onCloseBooking);
			cFns.push(() => closeBookingInfoBtn?.removeEventListener("click", onCloseBooking));

			// Overlay click
			const onOverlayClick = (e: Event) => { if (e.target === bookingInfoModal) closeBookingInfo(); };
			bookingInfoModal.addEventListener("click", onOverlayClick);
			cFns.push(() => bookingInfoModal.removeEventListener("click", onOverlayClick));

				// Continue → validate form → populate promoOrderData → open Payment (skip Order Summary)
			const onContinueToOrderSummary = (e: Event) => {
				e.preventDefault();

				const nameEl = document.getElementById("promoUserName") as HTMLInputElement | null;
				const emailEl = document.getElementById("promoUserEmail") as HTMLInputElement | null;
				const phoneEl = document.getElementById("promoUserPhone") as HTMLInputElement | null;
				const termsEl = document.getElementById("promoTerms") as HTMLInputElement | null;

				const name = nameEl?.value.trim() || "";
				const email = emailEl?.value.trim() || "";
				const phone = phoneEl?.value.trim() || "";
				const terms = termsEl?.checked || false;

				if (!name || !email || !phone) {
					alert("Please fill in all required fields");
					return;
				}
				if (!terms) {
					alert("Please agree to the Terms & Conditions");
					return;
				}

				// Read Step 3 ticket counts
				const s3AdultEl = bookingInfoModal.querySelector("#promoStep3AdultQty");
				const s3ChildEl = bookingInfoModal.querySelector("#promoStep3ChildQty");
				const adultQty = s3AdultEl ? parseInt(s3AdultEl.textContent || "0", 10) || 0 : 0;
				const childQty = s3ChildEl ? parseInt(s3ChildEl.textContent || "0", 10) || 0 : 0;

				const tv = tourSelect?.value || "tour01";
				const tp = TOUR_PRICES[tv] || TOUR_PRICES.tour01;
				const rawTourDate = promoSelectedDateDisplay?.textContent || "";
				const tourDate = tourSelectionSkipped || rawTourDate === "Please select a date" ? "" : rawTourDate;

				promoOrderData.tourName = TOUR_NAMES[tv] || TOUR_NAMES.tour01;
				promoOrderData.tourValue = tv;
				promoOrderData.tourDate = tourDate;
				promoOrderData.adultQty = adultQty;
				promoOrderData.adultPrice = tp.adult;
				promoOrderData.adultOrigPrice = tp.adultOrig;
				promoOrderData.childQty = childQty;
				promoOrderData.childPrice = tp.child;
				promoOrderData.childOrigPrice = tp.childOrig;

					// Close booking info → go directly to payment (match prototype)
				bookingInfoModal.classList.remove("active");
				bookingInfoModal.setAttribute("aria-hidden", "true");
					openPaymentModal();
				if (cartBar) cartBar.classList.remove("visible");
			};
			proceedToOrderSummaryBtn?.addEventListener("click", onContinueToOrderSummary);
			cFns.push(() => proceedToOrderSummaryBtn?.removeEventListener("click", onContinueToOrderSummary));

			// Escape key
			const onEscBooking = (e: KeyboardEvent) => {
				if (e.key === "Escape" && bookingInfoModal.classList.contains("active")) {
					closeBookingInfo();
				}
			};
			document.addEventListener("keydown", onEscBooking);
			cFns.push(() => document.removeEventListener("keydown", onEscBooking));
		};
		initPromoBookingInfoModal(cleanupFns);

		// ─── Step 4: Order Summary Modal ──────────────────────────────────
		const initPromoOrderSummaryModal = (cFns: (() => void)[]) => {
			if (!orderSummaryModal) return;

				// Keep Step 4 order summary in sync if it is ever shown (even though the
				// prototype flow skips this step).
				const observer = new MutationObserver(() => {
					if (orderSummaryModal.classList.contains("active")) {
						populatePromoOrderSummary();
					}
				});
				observer.observe(orderSummaryModal, { attributes: true, attributeFilter: ["class"] });
				cFns.push(() => observer.disconnect());

			const closeOrderSummary = () => {
				orderSummaryModal.classList.remove("active");
				orderSummaryModal.setAttribute("aria-hidden", "true");
				document.body.style.overflow = "";
				if (cartBar && PromoUpsellCart.getItemCount() > 0) {
					cartBar.classList.add("visible");
				}
			};

			const goBackToBookingInfo = () => {
				orderSummaryModal.classList.remove("active");
				orderSummaryModal.setAttribute("aria-hidden", "true");
				if (bookingInfoModal) {
					bookingInfoModal.classList.add("active");
					bookingInfoModal.setAttribute("aria-hidden", "false");
					document.body.style.overflow = "hidden";
					populatePromoStep3OrderSummary();
				}
				if (cartBar) cartBar.classList.remove("visible");
			};

			// Back button
			const onBack = (e: Event) => { e.preventDefault(); goBackToBookingInfo(); };
			orderBackBtn?.addEventListener("click", onBack);
			cFns.push(() => orderBackBtn?.removeEventListener("click", onBack));

			// Proceed to Payment
			const onProceed = (e: Event) => {
				e.preventDefault();
				orderSummaryModal.classList.remove("active");
				orderSummaryModal.setAttribute("aria-hidden", "true");
				openPaymentModal();
				if (cartBar) cartBar.classList.remove("visible");
			};
			proceedToPaymentBtn?.addEventListener("click", onProceed);
			cFns.push(() => proceedToPaymentBtn?.removeEventListener("click", onProceed));

			// Close button
			const onClose = (e: Event) => { e.preventDefault(); closeOrderSummary(); };
			closeOrderSummaryBtn?.addEventListener("click", onClose);
			cFns.push(() => closeOrderSummaryBtn?.removeEventListener("click", onClose));

			// Overlay click
			const onOverlay = (e: Event) => { if (e.target === orderSummaryModal) closeOrderSummary(); };
			orderSummaryModal.addEventListener("click", onOverlay);
			cFns.push(() => orderSummaryModal.removeEventListener("click", onOverlay));

			// Escape key
			const onEsc = (e: KeyboardEvent) => {
				if (e.key === "Escape" && orderSummaryModal.classList.contains("active")) {
					closeOrderSummary();
				}
			};
			document.addEventListener("keydown", onEsc);
			cFns.push(() => document.removeEventListener("keydown", onEsc));
		};
		initPromoOrderSummaryModal(cleanupFns);

		// ─── Step 5: Payment Modal ──────────────────────────────────────
		const initPromoPaymentModal = (cFns: (() => void)[]) => {
			if (!paymentModal) return;

			const closePayment = () => {
				paymentModal.classList.remove("active");
				paymentModal.setAttribute("aria-hidden", "true");
				document.body.style.overflow = "";
				if (cartBar && PromoUpsellCart.getItemCount() > 0) {
					cartBar.classList.add("visible");
				}
			};

				// Back → reopen booking info (match prototype)
			const onPaymentBack = (e: Event) => {
				e.preventDefault();
				paymentModal.classList.remove("active");
				paymentModal.setAttribute("aria-hidden", "true");
					if (bookingInfoModal) {
						bookingInfoModal.classList.add("active");
						bookingInfoModal.setAttribute("aria-hidden", "false");
						document.body.style.overflow = "hidden";
						populatePromoStep3OrderSummary();
					}
					if (cartBar) cartBar.classList.remove("visible");
			};
			paymentBackBtn?.addEventListener("click", onPaymentBack);
			cFns.push(() => paymentBackBtn?.removeEventListener("click", onPaymentBack));

			// Close button
			const onClosePayment = (e: Event) => { e.preventDefault(); closePayment(); };
			closePaymentBtn?.addEventListener("click", onClosePayment);
			cFns.push(() => closePaymentBtn?.removeEventListener("click", onClosePayment));

			// Overlay click
			const onPayOverlay = (e: Event) => { if (e.target === paymentModal) closePayment(); };
			paymentModal.addEventListener("click", onPayOverlay);
			cFns.push(() => paymentModal.removeEventListener("click", onPayOverlay));

			// Make Payment
			const onMakePayment = (e: Event) => {
				e.preventDefault();
				alert("Payment processed successfully! Thank you for your booking.");
				paymentModal.classList.remove("active");
				paymentModal.setAttribute("aria-hidden", "true");
				document.body.style.overflow = "";

				// Reset promo order state
				promoSelectedTour = null;
				tourSelectionSkipped = false;
				lastTourContext = null;
				promoTourAdultQty = 0;
				promoTourChildQty = 0;
				promoTourSelectedDate = "";

				// Reset ticket counters in tour modal
				if (promoAdultCount) promoAdultCount.textContent = "0";
				if (promoChildCount) promoChildCount.textContent = "0";
				if (promoSelectedDateDisplay) promoSelectedDateDisplay.textContent = "Please select a date";

				// Clear cart
				PromoUpsellCart.items = [];
				PromoUpsellCart.updateUI();
				if (cartBar) cartBar.classList.remove("visible");
			};
			makePaymentBtn?.addEventListener("click", onMakePayment);
			cFns.push(() => makePaymentBtn?.removeEventListener("click", onMakePayment));

			// Escape key
			const onEscPayment = (e: KeyboardEvent) => {
				if (e.key === "Escape" && paymentModal.classList.contains("active")) {
					closePayment();
				}
			};
			document.addEventListener("keydown", onEscPayment);
			cFns.push(() => document.removeEventListener("keydown", onEscPayment));
		};
		initPromoPaymentModal(cleanupFns);

	  triggers.forEach((btn) => {
	    const onClick = (e: Event) => {
	      e.preventDefault();
	      e.stopPropagation();

	      const card = btn.closest<HTMLElement>(".card");
	      const productId = card?.dataset.productId;
	      if (!productId) return;

	      openModal(productId, detectTourContext(btn));
	    };
	    btn.addEventListener("click", onClick);
	    cleanupFns.push(() => btn.removeEventListener("click", onClick));
	  });

	  const onClose = (e: Event) => {
	    e.preventDefault();
	    closeModal();
	  };
	  closeBtn1?.addEventListener("click", onClose);
	  closeBtn2?.addEventListener("click", onClose);
	  cleanupFns.push(() => closeBtn1?.removeEventListener("click", onClose));
	  cleanupFns.push(() => closeBtn2?.removeEventListener("click", onClose));

	  const onOverlayClick = (e: MouseEvent) => {
	    if (e.target === overlay) closeModal();
	  };
	  overlay.addEventListener("click", onOverlayClick);
	  cleanupFns.push(() => overlay.removeEventListener("click", onOverlayClick));

		  const onKeyDown = (e: KeyboardEvent) => {
		    if (e.key !== "Escape") return;
		    if (tourModalOverlay?.classList.contains("active")) {
		      closeTourModal(true);
		      return;
		    }
		    closeModal();
		  };
	  window.addEventListener("keydown", onKeyDown);
	  cleanupFns.push(() => window.removeEventListener("keydown", onKeyDown));

	  const onVariantClick = (e: MouseEvent) => {
	    const target = e.target as HTMLElement;
	    const tab = target.closest<HTMLElement>(".promo-variant-tab");
	    if (!tab || !promoCurrentProduct?.variants || !variantTabs) return;
	
	    const idx = parseInt(tab.dataset.variantIndex || "0", 10) || 0;
	    promoCurrentVariant = promoCurrentProduct.variants[idx] || promoCurrentProduct.variants[0] || null;
	    variantTabs.querySelectorAll<HTMLElement>(".promo-variant-tab").forEach((t) => t.classList.remove("active"));
	    tab.classList.add("active");
	    updatePromoAddToCartButton();
	  };
	  variantTabs?.addEventListener("click", onVariantClick);
	  cleanupFns.push(() => variantTabs?.removeEventListener("click", onVariantClick));

								const onAdd = (e: Event) => {
			    e.preventDefault();
			    const product = promoCurrentProduct;
			    if (!product) return;
				
				    // Normalize optional compatibleTours to `null` (not `undefined`) so the tour modal wiring is type-safe.
				    const incomingTours = product.compatibleTours ?? null;
			    const itemsToAdd: PromoCartItem[] = [];
		
		    // Build payload(s) first.
			    const colorRows = overlay.querySelectorAll<HTMLElement>(".promo-color-qty-item");
			    if (product.type === "physical" && colorRows.length > 0) {
		      const variantName = promoCurrentVariant?.name || promoCurrentVariant?.id || "Standard";
			      const colors = product.colors || [];
		
		      colorRows.forEach((row) => {
		        const qtyEl = row.querySelector<HTMLElement>(".promo-color-qty-value");
		        const qty = parseInt(qtyEl?.textContent || "0", 10) || 0;
		        if (qty <= 0) return;
		
		        const color = row.dataset.colorName || null;
		        const colorIndex = parseInt(row.dataset.colorIndex || "0", 10) || 0;
			        const img = colors[colorIndex]?.image || product.image;
		
			        itemsToAdd.push({
			          productId: product.id,
			          name: `${product.name} - ${variantName}${color ? ` (${color})` : ""}`,
			          type: product.type,
			          category: product.category,
			          price: product.price,
			          originalPrice: product.originalPrice,
		          quantity: qty,
		          image: img,
			          placeholder: product.placeholder,
		          variant: variantName,
		          color,
			          computedLinePrice: product.price * qty,
		        });
		      });
		
		      if (itemsToAdd.length === 0) {
		        alert("Please select at least 1 item.");
		        return;
		      }
		    } else {
		      const selections: PromoSelections = {
		        variant: promoCurrentVariant?.name || promoCurrentVariant?.id || "Standard",
		        quantity: promoProductQuantity,
		        date: promoProductSelectedDate,
		        time: promoProductSelectedTime,
		        adultQty: promoProductAdultQty,
		        childQty: promoProductChildQty,
		        cruiseType: promoProductSelectedCruiseType,
		        timeSlot: promoProductSelectedTimeSlot,
		      };
		
			      if (!promoCanAddToCart(product, selections)) {
			        if (product.type === "scheduled") {
			          const requiresTime = !!(product.availableTimes && product.availableTimes.length > 0);
		          alert(requiresTime ? "Please select a date, time, and at least one ticket." : "Please select a date and at least one ticket.");
			        } else if (product.type === "validityPass") {
		          alert("Please select at least one ticket.");
			        } else if (product.type === "cruise") {
		          alert("Please select a cruise type, date, time slot, and at least one ticket.");
		        } else {
		          alert("Please complete your selections.");
		        }
		        return;
		      }
		
			      itemsToAdd.push(promoBuildCartPayload(product, selections));
		    }
		
		    // If a tour has already been chosen for this booking, enforce it strictly.
			    if (promoSelectedTour && !tourSelectionSkipped && incomingTours && incomingTours.length > 0) {
		      if (!incomingTours.includes(promoSelectedTour)) {
		        alert(
			          `${product.name} is only available with ${incomingTours.join(", ")}. Please complete your current booking first, then start a new booking.`,
		        );
		        return;
		      }
		    }
		
		    // If no tour is selected (e.g., optional item skipped), still enforce cart-level compatibility via intersection.
		    if ((!promoSelectedTour || tourSelectionSkipped) && incomingTours && incomingTours.length > 0 && PromoUpsellCart.items.length > 0) {
		      let constrained: Set<string> | null = null;
		      PromoUpsellCart.items.forEach((item) => {
		        const p = promoProductData[item.productId];
		        if (p?.compatibleTours && p.compatibleTours.length > 0) {
		          if (!constrained) constrained = new Set(p.compatibleTours);
		          else constrained = new Set(Array.from(constrained).filter((t) => new Set(p.compatibleTours!).has(t)));
		        }
		      });
		
		      if (constrained) {
		        const overlap = incomingTours.filter((t) => constrained!.has(t));
		        if (overlap.length === 0) {
		          alert(
			            `${product.name} is only available with ${incomingTours.join(", ")}. Please complete your current booking first, then start a new booking.`,
		          );
		          return;
		        }
		      }
		    }
		
					    const existingKeys = new Set(PromoUpsellCart.items.map((i) => PromoUpsellCart.getItemKey(i)));
					    const isUpdate = itemsToAdd.some((item) => existingKeys.has(PromoUpsellCart.getItemKey(item)));
					    itemsToAdd.forEach((item) => PromoUpsellCart.addItem(item));
					    triggerPromoCartToast(isUpdate ? "Cart updated" : "Added to cart");
		    closeModal();
		  };
	  addBtn?.addEventListener("click", onAdd);
	  cleanupFns.push(() => addBtn?.removeEventListener("click", onAdd));

		  PromoUpsellCart.updateUI();
	  updatePromoAddToCartButton();

	  return () => cleanupFns.forEach((fn) => fn());
	}
