import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("rooms"),
      _creationTime: v.number(),
      name: v.string(),
      slug: v.string(),
      description: v.optional(v.string()),
      type: v.union(
        v.literal("diplomatic"),
        v.literal("council"),
        v.literal("public"),
        v.literal("private")
      ),
      createdBy: v.id("users"),
      isActive: v.boolean(),
      maxParticipants: v.number(),
      hasRecording: v.boolean(),
      virtualBackground: v.optional(v.string()),
      scheduledAt: v.optional(v.number()),
      endsAt: v.optional(v.number()),
    })
  ),
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return await ctx.db.query("rooms").collect();
  },
});

export const listActive = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("rooms"),
      _creationTime: v.number(),
      name: v.string(),
      slug: v.string(),
      description: v.optional(v.string()),
      type: v.union(
        v.literal("diplomatic"),
        v.literal("council"),
        v.literal("public"),
        v.literal("private")
      ),
      createdBy: v.id("users"),
      isActive: v.boolean(),
      maxParticipants: v.number(),
      hasRecording: v.boolean(),
      virtualBackground: v.optional(v.string()),
      scheduledAt: v.optional(v.number()),
      endsAt: v.optional(v.number()),
    })
  ),
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return await ctx.db
      .query("rooms")
      .withIndex("by_isActive", (q) => q.eq("isActive", true))
      .collect();
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  returns: v.union(
    v.object({
      _id: v.id("rooms"),
      _creationTime: v.number(),
      name: v.string(),
      slug: v.string(),
      description: v.optional(v.string()),
      type: v.union(
        v.literal("diplomatic"),
        v.literal("council"),
        v.literal("public"),
        v.literal("private")
      ),
      createdBy: v.id("users"),
      isActive: v.boolean(),
      maxParticipants: v.number(),
      hasRecording: v.boolean(),
      virtualBackground: v.optional(v.string()),
      scheduledAt: v.optional(v.number()),
      endsAt: v.optional(v.number()),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    return await ctx.db
      .query("rooms")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    type: v.union(
      v.literal("diplomatic"),
      v.literal("council"),
      v.literal("public"),
      v.literal("private")
    ),
    maxParticipants: v.number(),
    hasRecording: v.boolean(),
    virtualBackground: v.optional(v.string()),
    scheduledAt: v.optional(v.number()),
    endsAt: v.optional(v.number()),
  },
  returns: v.id("rooms"),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const slug =
      args.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") +
      "-" +
      Math.random().toString(36).substring(2, 8);

    return await ctx.db.insert("rooms", {
      ...args,
      slug,
      createdBy: userId,
      isActive: true,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("rooms"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    type: v.optional(
      v.union(
        v.literal("diplomatic"),
        v.literal("council"),
        v.literal("public"),
        v.literal("private")
      )
    ),
    maxParticipants: v.optional(v.number()),
    hasRecording: v.optional(v.boolean()),
    isActive: v.optional(v.boolean()),
    virtualBackground: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const { id, ...updates } = args;
    const room = await ctx.db.get(id);
    if (!room) throw new Error("Room not found");

    const patch: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        patch[key] = value;
      }
    }
    if (Object.keys(patch).length > 0) {
      await ctx.db.patch(id, patch);
    }
    return null;
  },
});

export const remove = mutation({
  args: { id: v.id("rooms") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    await ctx.db.delete(args.id);
    return null;
  },
});
