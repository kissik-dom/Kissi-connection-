import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

const participantValidator = v.object({
  _id: v.id("participants"),
  _creationTime: v.number(),
  meetingId: v.id("meetings"),
  userId: v.id("users"),
  role: v.union(
    v.literal("host"),
    v.literal("moderator"),
    v.literal("speaker"),
    v.literal("attendee")
  ),
  joinedAt: v.optional(v.number()),
  leftAt: v.optional(v.number()),
  status: v.union(
    v.literal("invited"),
    v.literal("joined"),
    v.literal("left")
  ),
});

export const listByMeeting = query({
  args: { meetingId: v.id("meetings") },
  returns: v.array(participantValidator),
  handler: async (ctx, args) => {
    return await ctx.db
      .query("participants")
      .withIndex("by_meetingId", (q) => q.eq("meetingId", args.meetingId))
      .collect();
  },
});

export const join = mutation({
  args: {
    meetingId: v.id("meetings"),
    role: v.optional(
      v.union(
        v.literal("host"),
        v.literal("moderator"),
        v.literal("speaker"),
        v.literal("attendee")
      )
    ),
  },
  returns: v.id("participants"),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("participants")
      .withIndex("by_meetingId_userId", (q) =>
        q.eq("meetingId", args.meetingId).eq("userId", userId)
      )
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        status: "joined",
        joinedAt: Date.now(),
        leftAt: undefined,
      });
      return existing._id;
    }

    return await ctx.db.insert("participants", {
      meetingId: args.meetingId,
      userId,
      role: args.role ?? "attendee",
      joinedAt: Date.now(),
      status: "joined",
    });
  },
});

export const leave = mutation({
  args: { meetingId: v.id("meetings") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const participant = await ctx.db
      .query("participants")
      .withIndex("by_meetingId_userId", (q) =>
        q.eq("meetingId", args.meetingId).eq("userId", userId)
      )
      .unique();

    if (participant) {
      await ctx.db.patch(participant._id, {
        status: "left",
        leftAt: Date.now(),
      });
    }
    return null;
  },
});

export const countByMeeting = query({
  args: { meetingId: v.id("meetings") },
  returns: v.number(),
  handler: async (ctx, args) => {
    const participants = await ctx.db
      .query("participants")
      .withIndex("by_meetingId", (q) => q.eq("meetingId", args.meetingId))
      .collect();
    return participants.filter((p) => p.status === "joined").length;
  },
});
