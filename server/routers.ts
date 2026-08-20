import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createMenuAsset, listMenuAssets } from "./db";
import { storagePut } from "./storage";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { nanoid } from "nanoid";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  assets: router({
    list: publicProcedure.query(() => listMenuAssets()),
    upload: protectedProcedure
      .use(({ ctx, next }) => {
        if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN", message: "Only admins can upload menu assets" });
        return next();
      })
      .input(z.object({
        label: z.string().trim().min(1).max(160),
        productKey: z.string().trim().min(1).max(160),
        mimeType: z.enum(["image/jpeg", "image/png", "image/webp", "image/svg+xml"]),
        dataBase64: z.string().min(1),
      }))
      .mutation(async ({ input, ctx }) => {
        const raw = input.dataBase64.replace(/^data:[^;]+;base64,/, "");
        const buffer = Buffer.from(raw, "base64");
        if (buffer.byteLength > 8 * 1024 * 1024) throw new TRPCError({ code: "PAYLOAD_TOO_LARGE", message: "Image must be smaller than 8MB" });
        const extension = input.mimeType.split("/")[1].replace("svg+xml", "svg");
        const safeLabel = input.label.replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 48) || "asset";
        const key = `menu-assets/${nanoid(12)}-${safeLabel}.${extension}`;
        const stored = await storagePut(key, buffer, input.mimeType);
        return createMenuAsset({ label: input.label, productKey: input.productKey, fileKey: stored.key, fileUrl: stored.url, mimeType: input.mimeType, createdBy: ctx.user.id });
      }),
  }),
});

export type AppRouter = typeof appRouter;
