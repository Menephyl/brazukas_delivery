import { publicProcedure, router } from "../_core/trpc";
import { listPix } from "../lib/reconciliation";

export const reconciliationRouter = router({
  list: publicProcedure.query(() => {
    return listPix();
  }),
});
