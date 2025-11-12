import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { ordersRouter } from "./routers/orders";
import { pdfRouter } from "./routers/pdf";
import { authRouter } from "./routers/auth";
import { healthRouter } from "./routers/health";
import { metricsRouter } from "./routers/metrics";
import { healthwatchRouter } from "./routers/healthwatch";
import { metricsDetailedRouter } from "./routers/metrics-detailed";
import { csvExportRouter } from "./routers/csv-export";
import { reconciliationRouter } from "./routers/reconciliation";
import { driverLocationRouter } from "./routers/driver-location";
import { couponsRouter } from "./routers/coupons";
import { reviewsRouter } from "./routers/reviews";
import { cartRouter } from "./routers/cart";
import { recommendationsRouter } from "./routers/recommendations";
import { loyaltyRouter } from "./routers/loyalty";
import { paymentRouter } from "./routers/payment";
import { notificationsRouter } from "./routers/notifications";
import { chatRouter } from "./routers/chat";
import { mercadopagoRouter } from "./routers/mercadopago";
import { merchantsRouter } from "./routers/merchants";
import { merchantOrdersRouter } from "./routers/merchant-orders";
import { merchantNotificationsRouter } from "./routers/merchant-notifications";
import { merchantAnalyticsRouter } from "./routers/merchant-analytics";

export const appRouter = router({
  system: systemRouter,
  auth: authRouter,
  orders: ordersRouter,
  pdf: pdfRouter,
  health: healthRouter,
  metrics: metricsRouter,
  metricsDetailed: metricsDetailedRouter,
  csvExport: csvExportRouter,
  healthwatch: healthwatchRouter,
  reconciliation: reconciliationRouter,
  driverLocation: driverLocationRouter,
  coupons: couponsRouter,
  reviews: reviewsRouter,
  cart: cartRouter,
  recommendations: recommendationsRouter,
  loyalty: loyaltyRouter,
  payment: paymentRouter,
  notifications: notificationsRouter,
  chat: chatRouter,
  mercadopago: mercadopagoRouter,
  merchants: merchantsRouter,
  merchantOrders: merchantOrdersRouter,
  merchantNotifications: merchantNotificationsRouter,
  merchantAnalytics: merchantAnalyticsRouter,
});

export type AppRouter = typeof appRouter;

