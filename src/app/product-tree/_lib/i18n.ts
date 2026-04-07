export type Lang = "en" | "ko";

const translations = {
  // Header
  "header.title": { en: "Product Tree", ko: "상품 트리" },
  "header.subtitle": { en: "Internal team tool", ko: "내부 팀 도구" },
  "header.tours": { en: "tours", ko: "투어" },
  "header.exclusive": { en: "exclusive", ko: "독점 상품" },
  "header.addons": { en: "addons", ko: "추가 옵션" },
  "header.products": { en: "products", ko: "상품" },
  "header.changes": { en: "changes", ko: "변경 사항" },
  "header.change": { en: "change", ko: "변경" },

  // View toggle
  "view.diagram": { en: "Diagram", ko: "다이어그램" },
  "view.table": { en: "Table", ko: "테이블" },

  // Diagram tiers
  "tier.tours": { en: "TOURS", ko: "투어" },
  "tier.exclusive": { en: "EXCLUSIVE", ko: "독점" },
  "tier.addons": { en: "ADD-ONS", ko: "추가 옵션" },
  "tier.products": { en: "PRODUCTS", ko: "상품" },

  // Legend
  "legend.tour": { en: "tour", ko: "투어" },
  "legend.exclusive": { en: "exclusive", ko: "독점" },
  "legend.product": { en: "product", ko: "상품" },
  "legend.required": { en: "Required", ko: "필수" },
  "legend.optional": { en: "Optional", ko: "선택" },

  // Table sections
  "table.classicTours": { en: "Classic Tours", ko: "클래식 투어" },
  "table.exclusiveTours": { en: "Exclusive Tours", ko: "독점 투어" },
  "table.addons": { en: "Add-ons", ko: "추가 옵션" },
  "table.products": { en: "Products", ko: "상품" },
  "table.searchPlaceholder": { en: "Search all products...", ko: "전체 상품 검색..." },
  "table.totalProducts": { en: "total products", ko: "전체 상품" },
  "table.noResults": { en: "No products match your search.", ko: "검색 결과가 없습니다." },

  // Table columns
  "col.name": { en: "Name", ko: "이름" },
  "col.type": { en: "Type", ko: "유형" },
  "col.pricing": { en: "Pricing", ko: "가격" },
  "col.compatibleTours": { en: "Compatible Tours", ko: "호환 투어" },
  "col.tourReq": { en: "Tour Req.", ko: "투어 필수" },
  "col.status": { en: "Status", ko: "상태" },

  // Status badges
  "status.active": { en: "Active", ko: "활성" },
  "status.inactive": { en: "Inactive", ko: "비활성" },
  "status.modified": { en: "Modified", ko: "수정됨" },
  "status.universal": { en: "Universal", ko: "전체 호환" },
  "status.optional": { en: "Optional", ko: "선택" },
  "status.required": { en: "Required", ko: "필수" },

  // Add item
  "addItem.button": { en: "Add item", ko: "항목 추가" },
  "addItem.placeholder": { en: "New item name...", ko: "새 항목 이름..." },
  "addItem.add": { en: "Add", ko: "추가" },
  "addItem.cancel": { en: "Cancel", ko: "취소" },

  // Detail modal sections
  "detail.pricing": { en: "Pricing", ko: "가격 정보" },
  "detail.display": { en: "Display", ko: "표시 설정" },
  "detail.overview": { en: "Overview", ko: "개요" },
  "detail.highlights": { en: "Highlights", ko: "하이라이트" },
  "detail.description": { en: "Description", ko: "설명" },
  "detail.tourCompatibility": { en: "Tour Compatibility", ko: "투어 호환성" },
  "detail.compatibleTours": { en: "Compatible Tours", ko: "호환 투어" },
  "detail.tourOptional": { en: "Tour Optional", ko: "투어 선택" },
  "detail.universalAllTours": { en: "Universal — all tours", ko: "전체 투어 호환" },
  "detail.productOptions": { en: "Product Options", ko: "상품 옵션" },
  "detail.schedule": { en: "Schedule", ko: "일정" },
  "detail.validity": { en: "Validity", ko: "유효기간" },
  "detail.experienceTypes": { en: "Experience Types", ko: "체험 유형" },
  "detail.timeSlots": { en: "Time Slots", ko: "시간대" },
  "detail.customFields": { en: "Custom Fields", ko: "사용자 정의 필드" },
  "detail.noCustomFields": { en: "No custom fields yet. Add fields by editing this product in the table view.", ko: "사용자 정의 필드가 없습니다. 테이블 뷰에서 이 상품을 편집하여 필드를 추가하세요." },

  // Detail modal field labels
  "field.name": { en: "Name", ko: "이름" },
  "field.tagline": { en: "Tagline", ko: "태그라인" },
  "field.status": { en: "Status", ko: "상태" },
  "field.popular": { en: "Popular", ko: "인기" },
  "field.baseRoute": { en: "Base Route", ko: "기본 경로" },
  "field.label": { en: "Label", ko: "라벨" },
  "field.title": { en: "Title", ko: "제목" },
  "field.labelColor": { en: "Label Color", ko: "라벨 색상" },
  "field.badge": { en: "Badge", ko: "배지" },
  "field.adultPrice": { en: "Adult Price", ko: "성인 가격" },
  "field.childPrice": { en: "Child Price", ko: "어린이 가격" },
  "field.adultOrig": { en: "Adult Original", ko: "성인 정가" },
  "field.childOrig": { en: "Child Original", ko: "어린이 정가" },
  "field.price": { en: "Price", ko: "가격" },
  "field.originalPrice": { en: "Original Price", ko: "정가" },
  "field.operationHours": { en: "Operation Hours", ko: "운영 시간" },
  "field.validUntil": { en: "Valid Until", ko: "유효기간" },
  "field.adult": { en: "Adult", ko: "성인" },
  "field.child": { en: "Child", ko: "어린이" },
  "field.original": { en: "Original", ko: "정가" },
  "field.hours": { en: "Hours", ko: "시간" },
  "field.variants": { en: "Variants", ko: "옵션" },
  "field.colors": { en: "Colors", ko: "색상" },
  "field.slots": { en: "Slots", ko: "슬롯" },
  "field.yes": { en: "Yes", ko: "예" },
  "field.no": { en: "No", ko: "아니오" },

  // Expanded row
  "expanded.productSettings": { en: "Product Settings", ko: "상품 설정" },

  // Activity feed
  "activity.title": { en: "Team Activity", ko: "팀 활동" },
  "activity.feed": { en: "Feed", ko: "피드" },
  "activity.board": { en: "Board", ko: "보드" },
  "activity.allActivity": { en: "All Activity", ko: "전체 활동" },
  "activity.edits": { en: "Edits", ko: "편집" },
  "activity.comments": { en: "Comments", ko: "댓글" },
  "activity.filterByProduct": { en: "Filter by product", ko: "상품별 필터" },
  "activity.all": { en: "All", ko: "전체" },
  "activity.editedField": { en: "edited", ko: "편집함" },
  "activity.on": { en: "on", ko: "에서" },
  "activity.noActivity": { en: "No activity yet. Comments and edits will appear here.", ko: "아직 활동이 없습니다. 댓글과 편집 내역이 여기에 표시됩니다." },
  "activity.yourName": { en: "Your name", ko: "이름" },
  "activity.addNote": { en: "Add a note or insight for the team...", ko: "팀을 위한 메모나 인사이트를 추가하세요..." },
  "activity.post": { en: "Post", ko: "게시" },
  "activity.enterName": { en: "Enter your name to post", ko: "게시하려면 이름을 입력하세요" },

  // Priority board
  "priority.unsorted": { en: "Unsorted", ko: "미분류" },
  "priority.low": { en: "Low", ko: "낮음" },
  "priority.medium": { en: "Medium", ko: "보통" },
  "priority.high": { en: "High", ko: "높음" },

  // Changelog panel
  "changelog.title": { en: "Change Log", ko: "변경 로그" },
  "changelog.exportJson": { en: "Export JSON", ko: "JSON 내보내기" },
  "changelog.clearAll": { en: "Clear All", ko: "전체 삭제" },
  "changelog.clearConfirm": { en: "Clear all changes? This cannot be undone.", ko: "모든 변경 사항을 삭제하시겠습니까? 이 작업은 취소할 수 없습니다." },
  "changelog.field": { en: "Field", ko: "필드" },
  "changelog.from": { en: "From", ko: "이전" },
  "changelog.to": { en: "To", ko: "이후" },
  "changelog.noChanges": { en: "No changes recorded.", ko: "기록된 변경 사항이 없습니다." },
  "changelog.copied": { en: "Copied to clipboard!", ko: "클립보드에 복사되었습니다!" },
} as const;

type TranslationKey = keyof typeof translations;

export function t(key: TranslationKey, lang: Lang): string {
  return translations[key][lang];
}

/** Currency symbol for the current language */
export function currencyForLang(lang: Lang): "USD" | "KRW" {
  return lang === "ko" ? "KRW" : "USD";
}

// ── Product name & content translations ─────────────────────────────────────

/** Korean translations for product/tour/addon names keyed by node ID */
const productNames: Record<string, { name: string; tagline?: string; description?: string; baseRoute?: string; badge?: string }> = {
  // Tours
  tour01: { name: "투어 01 도심 고궁 남산 코스" },
  tour02: { name: "투어 02 파노라마 코스" },
  tour04: { name: "투어 04 야경 코스" },

  // Exclusive packages
  "pkg-bts-day": {
    name: "BTS 더 시티 서울 (주간)",
    tagline: "서울 전역의 BTS 촬영지를 방문하세요 — 주간 에디션",
    badge: "독점",
    baseRoute: "투어 01 기반",
  },
  "pkg-bts-night": {
    name: "BTS 더 시티 서울 (야간)",
    tagline: "서울 전역의 BTS 촬영지를 방문하세요 — 야간 에디션",
    badge: "독점",
    baseRoute: "투어 04 기반",
  },
  "pkg-glow-up": {
    name: "글로우 업 패키지",
    tagline: "K-뷰티 쇼핑 거리 + 뷰티 체험",
    badge: "인기",
    baseRoute: "투어 01 기반",
  },
  "pkg-kculture": {
    name: "K-컬처 익스플로러",
    tagline: "BTS 촬영지 + 박물관 패스 콤보",
    badge: "독점",
    baseRoute: "투어 01 기반",
  },
  "pkg-kbeauty": {
    name: "K-뷰티 & 스타일 투어",
    tagline: "쇼핑 거리 + 뷰티 체험",
    badge: "인기",
    baseRoute: "투어 02 기반",
  },

  // Add-ons
  kwangjuyo: {
    name: "광주요",
    description: "광주요의 정교한 컬렉션으로 전통 한국 도자기의 우아함을 경험하세요. 모든 작품은 장인이 수공으로 제작합니다.",
  },
  "sejong-backstage": {
    name: "세종문화회관 백스테이지 패스",
    description: "한국 최고의 공연 예술 시설인 세종문화회관의 무대 뒤를 독점적으로 관람하세요.",
  },
  "museum-pass": {
    name: "뮤지엄 패스",
    description: "서울 주요 박물관 입장권. 유효 기간 내 여러 번 입장 가능합니다.",
  },
  "han-river-cruise": {
    name: "한강 크루즈",
    description: "서울 스카이라인의 멋진 전망과 함께하는 한강 유람선. 주간, 일몰, 야간 크루즈 중 선택하세요.",
  },
  "hanbok-rental": {
    name: "한복 대여",
    description: "전통 한복 대여 서비스. 소품 포함, 주요 관광지에서 촬영 가능합니다.",
  },
};

/** Korean translations for tour meta titles (uppercase display) */
const tourTitles: Record<string, string> = {
  tour01: "도심 고궁 남산 코스",
  tour02: "파노라마 코스",
  tour04: "야경 코스",
  "pkg-kculture": "BTS 더 시티 서울",
  "pkg-kbeauty": "글로우 업 인 서울",
  "pkg-bts-day": "BTS 더 시티 서울 (주간)",
  "pkg-bts-night": "BTS 더 시티 서울 (야간)",
  "pkg-glow-up": "글로우 업 패키지",
};

/** Korean translations for highlights */
const highlightsKo: Record<string, string[]> = {
  "pkg-bts-day": ["BTS 촬영지", "K-팝 박물관 입장", "한강 크루즈", "한복 체험"],
  "pkg-bts-night": ["BTS 촬영지", "K-팝 박물관 입장", "야간 도시 전경", "한복 체험"],
  "pkg-glow-up": ["명동 뷰티 마켓", "홍대 쇼핑", "스킨케어 워크숍", "스타일 포토 촬영"],
  "pkg-kculture": ["BTS 촬영지", "K-팝 박물관 입장", "한강 크루즈", "한복 체험"],
  "pkg-kbeauty": ["명동 뷰티 마켓", "홍대 쇼핑", "스킨케어 워크숍", "스타일 포토 촬영"],
};

/** Korean translations for addon type display names */
const typeNamesKo: Record<string, string> = {
  physical: "상품",
  scheduled: "예약",
  validityPass: "유효기간 패스",
  cruise: "체험",
};

/** Korean translations for tags */
const tagNamesKo: Record<string, string> = {
  product: "상품",
  scheduled: "예약",
  "validity pass": "유효기간 패스",
  experiences: "체험",
  "e-mail ticket": "이메일 티켓",
  "physical ticket": "실물 티켓",
  ticket: "티켓",
};

/** Korean translations for tour labels */
const tourLabelsKo: Record<string, string> = {
  tour01: "투어 01",
  tour02: "투어 02",
  tour04: "투어 04",
};

/** Korean translations for variant/color names */
const variantNamesKo: Record<string, string> = {
  "Sound Cup": "소리잔",
  "Marble Cup": "대리석잔",
  "Soft Blush": "소프트 블러시",
  "Gentle Pine": "젠틀 파인",
  "Autumn Haze": "어텀 헤이즈",
  "Pure White": "퓨어 화이트",
  "Day Cruise": "주간 크루즈",
  "Sunset Cruise": "일몰 크루즈",
  "Night Cruise": "야간 크루즈",
};

// ── Public helpers for translated product content ───────────────────────────

/** Get translated product name by node ID */
export function tName(id: string, lang: Lang): string | undefined {
  if (lang === "en") return undefined; // use original
  return productNames[id]?.name;
}

/** Get translated tour title (uppercase display) */
export function tTitle(id: string, lang: Lang): string | undefined {
  if (lang === "en") return undefined;
  return tourTitles[id];
}

/** Get translated tagline */
export function tTagline(id: string, lang: Lang): string | undefined {
  if (lang === "en") return undefined;
  return productNames[id]?.tagline;
}

/** Get translated description */
export function tDescription(id: string, lang: Lang): string | undefined {
  if (lang === "en") return undefined;
  return productNames[id]?.description;
}

/** Get translated badge */
export function tBadge(id: string, lang: Lang): string | undefined {
  if (lang === "en") return undefined;
  return productNames[id]?.badge;
}

/** Get translated base route */
export function tBaseRoute(id: string, lang: Lang): string | undefined {
  if (lang === "en") return undefined;
  return productNames[id]?.baseRoute;
}

/** Get translated highlights array */
export function tHighlights(id: string, lang: Lang): string[] | undefined {
  if (lang === "en") return undefined;
  return highlightsKo[id];
}

/** Get translated addon type display name */
export function tTypeName(type: string, lang: Lang): string {
  if (lang === "en") return type;
  return typeNamesKo[type] ?? type;
}

/** Get translated tag name */
export function tTag(tag: string, lang: Lang): string {
  if (lang === "en") return tag;
  return tagNamesKo[tag] ?? tag;
}

/** Get translated tour label */
export function tLabel(id: string, lang: Lang): string | undefined {
  if (lang === "en") return undefined;
  return tourLabelsKo[id];
}

/** Get translated variant/color/cruise type name */
export function tVariant(name: string, lang: Lang): string {
  if (lang === "en") return name;
  return variantNamesKo[name] ?? name;
}
