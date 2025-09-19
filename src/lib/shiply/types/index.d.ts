/**
 * TypeScript type definitions for Feedbackly SDK
 */

export interface FeedbacklyConfig {
  apiKey: string;
  websiteId: string;
  apiUrl?: string;
  timeout?: number;

  theme?: {
    primaryColor?: string;
    backgroundColor?: string;
    textColor?: string;
    borderColor?: string;
    borderRadius?: string;
    fontFamily?: string;
    fontSize?: string;
    headerBackgroundColor?: string;
    footerBackgroundColor?: string;
  };

  position?: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  };

  size?: {
    width?: string;
    height?: string;
  };

  zIndex?: number;

  trigger?: {
    icon?: string;
    size?: string;
    iconSize?: string;
  };

  text?: {
    title?: string;
    ratingLabel?: string;
    feedbackLabel?: string;
    feedbackPlaceholder?: string;
    categoryLabel?: string;
    submitButton?: string;
    cancelButton?: string;
  };

  categories?: Array<{
    value: string;
    label: string;
  }>;

  autoShow?: boolean;
  autoShowDelay?: number;
  showOnExit?: boolean;

  user?: {
    id?: string;
    email?: string;
    name?: string;
    photoURL?: string;
  };
}

export interface FeedbackData {
  rating: number;
  feedback?: string;
  category?: string;
  user?: {
    id?: string;
    email?: string;
    name?: string;
    photoURL?: string;
  };
  metadata?: Record<string, unknown>;
  timestamp?: string;
  url?: string;
  userAgent?: string;
}

export interface ApiResponse {
  success: boolean;
  message?: string;
  feedbackId?: string;
  data?: unknown;
  error?: string;
}

export interface EventData {
  eventName: string;
  eventData: Record<string, unknown>;
  timestamp?: string;
  url?: string;
  userAgent?: string;
}

export interface WidgetConfig {
  theme?: FeedbacklyConfig['theme'];
  position?: FeedbacklyConfig['position'];
  size?: FeedbacklyConfig['size'];
  text?: FeedbacklyConfig['text'];
  categories?: FeedbacklyConfig['categories'];
  autoShow?: boolean;
  autoShowDelay?: number;
}

export interface User {
  id?: string;
  email?: string;
  name?: string;
  photoURL?: string;
}

export interface FeedbacklyInstance {
  init(config?: Partial<FeedbacklyConfig>): FeedbacklyInstance;
  show(): void;
  hide(): void;
  toggle(): void;
  destroy(): void;
  setUser(user: User): void;
  track(eventName: string, eventData?: Record<string, unknown>): void;
  submitFeedback(feedbackData: FeedbackData): Promise<ApiResponse>;
  updateConfig(config: Partial<FeedbacklyConfig>): void;
  isInitialized(): boolean;
  isVisible(): boolean;
}

declare global {
  interface Window {
    Feedbackly: typeof FeedbacklyInstance;
  }
}

export default FeedbacklyInstance;

