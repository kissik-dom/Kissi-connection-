import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

const recordingValidator = v.object({
  _id: v.id("recordings"),
  _creationTime: v.number(),
  meetingId: v.id("meetings"),
  roomId: v.id("rooms"),
  title: v.string(),
  duration: v.optional(v.number()),
  size: v.optional(v.number()),
  status: v.union(
    v.literal("recording"),
    v.literal("processing"),
    v.literal("ready"),
    v.literal("failed")
  ),
  recordedBy: v.id("users"),
});

export const list = query({
  args: {},
  returns: v.array(recordingValidator),
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return await ctx.db.query("recordings").order("desc").collect();
  },
});

export const listByRoom = query({
  args: { roomId: v.id("rooms") },
  returns: v.array(recordingValidator),
  handler: async (ctx, args) => {
    return await ctx.db
      .query("recordings")
      .withIndex("by_roomId", (q) => q.eq("roomId", args.roomId))
      .collect();
  },
});

export const create = mutation({
  args: {
    meetingId: v.id("meetings"),
    roomId: v.id("rooms"),
    title: v.string(),
  },
  returns: v.id("recordings"),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    return await ctx.db.insert("recordings", {
      ...args,
      status: "recording",
      recordedBy: userId,
    });
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("recordings"),
    status: v.union(
      v.literal("recording"),
      v.literal("processing"),
      v.literal("ready"),
      v.literal("failed")
    ),
    duration: v.optional(v.number()),
    size: v.optional(v.number()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const { id, ...updates } = args;
    const patch: Record<string, unknown> = { status: updates.status };
    if (updates.duration !== undefined) patch.duration = updates.duration;
    if (updates.size !== undefined) patch.size = updates.size;

    await ctx.db.patch(id, patch);
    return null;
  },
});

export const remove = mutation({
  args: { id: v.id("recordings") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    await ctx.db.delete(args.id);
    return null;
  },
});

export const stats = query({
  args: {},
  returns: v.object({
    total: v.number(),
    ready: v.number(),
    recording: v.number(),
    totalDuration: v.number(),
  }),
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId)
      return { total: 0, ready: 0, recording: 0, totalDuration: 0 };
    const all = await ctx.db.query("recordings").collect();
    return {
      total: all.length,
      ready: all.filter((r) => r.status === "ready").length,
      recording: all.filter((r) => r.status === "recording").length,
      totalDuration: all.reduce((sum, r) => sum + (r.duration ?? 0), 0),
    };
  },
});
