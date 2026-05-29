import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

const meetingValidator = v.object({
  _id: v.id("meetings"),
  _creationTime: v.number(),
  title: v.string(),
  description: v.optional(v.string()),
  roomId: v.id("rooms"),
  hostId: v.id("users"),
  status: v.union(
    v.literal("scheduled"),
    v.literal("live"),
    v.literal("ended"),
    v.literal("cancelled")
  ),
  scheduledAt: v.number(),
  startedAt: v.optional(v.number()),
  endedAt: v.optional(v.number()),
  duration: v.optional(v.number()),
  meetingType: v.union(
    v.literal("diplomatic"),
    v.literal("council"),
    v.literal("general"),
    v.literal("ceremony")
  ),
  agenda: v.optional(v.string()),
  isRecorded: v.boolean(),
});

export const list = query({
  args: {},
  returns: v.array(meetingValidator),
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return await ctx.db.query("meetings").order("desc").collect();
  },
});

export const listByStatus = query({
  args: {
    status: v.union(
      v.literal("scheduled"),
      v.literal("live"),
      v.literal("ended"),
      v.literal("cancelled")
    ),
  },
  returns: v.array(meetingValidator),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return await ctx.db
      .query("meetings")
      .withIndex("by_status", (q) => q.eq("status", args.status))
      .collect();
  },
});

export const listUpcoming = query({
  args: {},
  returns: v.array(meetingValidator),
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    const now = Date.now();
    const meetings = await ctx.db
      .query("meetings")
      .withIndex("by_status", (q) => q.eq("status", "scheduled"))
      .collect();
    return meetings
      .filter((m) => m.scheduledAt > now)
      .sort((a, b) => a.scheduledAt - b.scheduledAt);
  },
});

export const get = query({
  args: { id: v.id("meetings") },
  returns: v.union(meetingValidator, v.null()),
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getByRoom = query({
  args: { roomId: v.id("rooms") },
  returns: v.array(meetingValidator),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return await ctx.db
      .query("meetings")
      .withIndex("by_roomId", (q) => q.eq("roomId", args.roomId))
      .collect();
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    roomId: v.id("rooms"),
    scheduledAt: v.number(),
    meetingType: v.union(
      v.literal("diplomatic"),
      v.literal("council"),
      v.literal("general"),
      v.literal("ceremony")
    ),
    agenda: v.optional(v.string()),
    isRecorded: v.boolean(),
  },
  returns: v.id("meetings"),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    return await ctx.db.insert("meetings", {
      ...args,
      hostId: userId,
      status: "scheduled",
    });
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("meetings"),
    status: v.union(
      v.literal("scheduled"),
      v.literal("live"),
      v.literal("ended"),
      v.literal("cancelled")
    ),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const meeting = await ctx.db.get(args.id);
    if (!meeting) throw new Error("Meeting not found");

    const patch: Record<string, unknown> = { status: args.status };
    if (args.status === "live") {
      patch.startedAt = Date.now();
    } else if (args.status === "ended") {
      patch.endedAt = Date.now();
      if (meeting.startedAt) {
        patch.duration = Math.floor((Date.now() - meeting.startedAt) / 1000);
      }
    }

    await ctx.db.patch(args.id, patch);
    return null;
  },
});

export const remove = mutation({
  args: { id: v.id("meetings") },
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
    scheduled: v.number(),
    live: v.number(),
    ended: v.number(),
  }),
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId)
      return { total: 0, scheduled: 0, live: 0, ended: 0 };
    const all = await ctx.db.query("meetings").collect();
    return {
      total: all.length,
      scheduled: all.filter((m) => m.status === "scheduled").length,
      live: all.filter((m) => m.status === "live").length,
      ended: all.filter((m) => m.status === "ended").length,
    };
  },
});
