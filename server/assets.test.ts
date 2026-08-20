import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

describe("assets.list", () => {
  it("returns an array for the public asset catalogue", async () => {
    const ctx: TrpcContext = {
      user: null,
      req: {} as TrpcContext["req"],
      res: {} as TrpcContext["res"],
    };
    const result = await appRouter.createCaller(ctx).assets.list();
    expect(Array.isArray(result)).toBe(true);
  });
});
