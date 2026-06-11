/**
 * OP Video Engine — Video Generation Domain Text Maps
 *
 * All strings externalized. No hardcoded labels in JSX.
 * Scope: single-product authoring (golden path).
 */

export const videoGenerationTextMaps = {
  // ─── Page / layout ─────────────────────────────────────────────────────────
  pageTitle: 'Author Video',
  pageDescription: 'Fill in your product details and preview the video live.',

  // ─── Product form ───────────────────────────────────────────────────────────
  formSectionLabel: 'Product Details',
  productNameLabel: 'Product Name',
  productNamePlaceholder: 'e.g. Nike Air Max 270',
  priceCurrentLabel: 'Current Price',
  priceCurrentPlaceholder: 'e.g. 99.99',
  priceOriginalLabel: 'Original Price',
  priceOriginalPlaceholder: 'e.g. 149.99 (optional)',
  promoTagLabel: 'Promo Tag',
  promoTagPlaceholder: 'e.g. 30% OFF (optional)',
  ctaTextLabel: 'Call to Action',
  ctaTextPlaceholder: 'e.g. Shop Now',
  legalTextLabel: 'Legal Text',
  legalTextPlaceholder: 'e.g. *Terms and conditions apply (optional)',

  // ─── Stay form (StayPromo template) ──────────────────────────────────────────
  stayFormSectionLabel: 'Listing Details',
  listingNameLabel: 'Listing Name',
  listingNamePlaceholder: 'e.g. Beachfront Villa',
  locationLabel: 'Location',
  locationPlaceholder: 'e.g. Tulum, Mexico',
  heroImageLabel: 'Hero Image',
  ratingLabel: 'Rating',
  ratingPlaceholder: 'e.g. 4.92',
  reviewCountLabel: 'Reviews',
  reviewCountPlaceholder: 'e.g. 128 reviews (optional)',
  pricePerNightLabel: 'Price per Night',
  pricePerNightPlaceholder: 'e.g. 250',
  currencyLabel: 'Currency',
  currencyPlaceholder: 'e.g. $',
  stayCtaPlaceholder: 'e.g. Book now',

  // ─── Format tabs ────────────────────────────────────────────────────────────
  formatTabsLabel: 'Preview Format',
  format16x9: '16:9',
  format9x16: '9:16',
  format1x1: '1:1',
  formatAriaLabel: (format: string) => `Switch preview to ${format} format`,

  // ─── Preview panel ──────────────────────────────────────────────────────────
  previewPanelLabel: 'Live Preview',
  previewAriaLabel: 'Live video preview',
  previewLoadingLabel: 'Loading preview…',
  previewMobileToggle: 'Show Preview',
  previewMobileHide: 'Hide Preview',

  // ─── Brand info ─────────────────────────────────────────────────────────────
  brandApplied: (name: string) => `Brand applied: ${name}`,
  brandNone: 'No brand — using defaults',

  // ─── Render actions ─────────────────────────────────────────────────────────
  renderButtonLabel: 'Render Video',
  renderButtonRendering: 'Rendering…',
  renderButtonDisabledMissingFields: 'Fix required fields to render',
  renderCountLabel: (n: number) => `${n} job${n === 1 ? '' : 's'} rendering`,
  renderJobCreated: 'Render started',
  renderJobFailed: 'Render failed',
  renderJobCompleted: 'Render complete',
  videosSentToRender: (n: number) =>
    `${n} video${n === 1 ? '' : 's'} sent to render`,
  videosSentPartial: (ok: number, total: number) =>
    `${ok} of ${total} videos started — ${total - ok} failed`,

  // ─── Download ───────────────────────────────────────────────────────────────
  downloadLabel: (format: string) => `Download ${format}`,
  downloadAriaLabel: (format: string) => `Download rendered video in ${format} format`,

  // ─── Progress ───────────────────────────────────────────────────────────────
  progressAriaLabel: 'Render progress',
  progressPercent: (pct: number) => `${pct}% rendered`,
  progressEstimate: (sec: number) => `~${Math.ceil(sec / 60)} min remaining`,

  // ─── Product image upload ────────────────────────────────────────────────────
  productImageLabel: 'Product Image',
  productImageHint: 'JPG, PNG or WebP · max 10 MB',
  productImageUploadPending: 'Image saved locally. Will upload when server is available.',
  productImageTypeError: 'Only JPG, PNG and WebP files are accepted.',
  productImageSizeError: 'File exceeds 10 MB limit.',

  // ─── Validation / errors ────────────────────────────────────────────────────
  errorMissingImage: 'Product image is required before rendering.',
  errorRenderFailed: 'Render failed. Please try again.',
  errorRetry: 'Retry',

  // ─── Template resolution ──────────────────────────────────────────────────
  templateNotFound: 'Template not found.',
  templateUnsupported: (componentId: string) =>
    `This template (${componentId}) isn't available for authoring yet.`,

  // ─── Format selector (render output formats) ────────────────────────────────
  formatSelectorLabel: 'Output Formats',
  formatSelectorHint: 'Select at least one format to render',
  formatLandscape: 'Landscape',
  formatVertical: 'Vertical',
  formatSquare: 'Square',

  // ─── Render button (multi-format) ────────────────────────────────────────────
  renderButtonMultiple: (n: number) => `Generate ${n} Video${n === 1 ? '' : 's'}`,

  // ─── Results sheet ───────────────────────────────────────────────────────────
  resultsSheetTitle: 'Your Videos',
  resultsSheetDescription: 'Videos are being generated. Download when ready.',
  resultsCardRendering: 'Rendering…',
  resultsCardProcessing: 'Processing',
  resultsCardGenerating: 'Generating…',
  resultsCardReady: 'Ready',
  resultsCardFailed: 'Failed',
  resultsCardFormatLabel: (format: string) => format,
  /** Friendly card title, e.g. "Square (1:1)" — mirrors the reference UI. */
  resultsCardFormatTitle: (format: string) => {
    const names: Record<string, string> = {
      '1:1': 'Square (1:1)',
      '9:16': 'Vertical (9:16)',
      '16:9': 'Horizontal (16:9)'
    };
    return names[format] ?? format;
  },
  resultsDownloadFormat: (format: string) => `Download ${format}`,
  resultsDownloadAll: 'Download All',
  resultsJobCount: (n: number) => `${n} video${n === 1 ? '' : 's'}`,

  // ─── Render badge (reopens results sheet) ───────────────────────────────────
  renderBadgeActive: (n: number) => `${n} rendering…`,
  renderBadgeReady: (n: number) => `${n} video${n === 1 ? '' : 's'} ready`,
  renderBadgeViewResults: 'View results',

  // ─── Empty / skeleton ───────────────────────────────────────────────────────
  skeletonAriaLabel: 'Loading authoring view…',
  jobsEmptyTitle: 'No render jobs yet',
  jobsEmptyDescription: 'Fill in the form and click Render to start.',
} as const;
