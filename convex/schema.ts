import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const schema = defineSchema({
  ...authTables,

  rooms: defineTable({
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
    .index("by_slug", ["slug"])
    .index("by_createdBy", ["createdBy"])
    .index("by_type", ["type"])
    .index("by_isActive", ["isActive"]),

  meetings: defineTable({
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
  })
    .index("by_roomId", ["roomId"])
    .index("by_hostId", ["hostId"])
    .index("by_status", ["status"])
    .index("by_scheduledAt", ["scheduledAt"]),

  participants: defineTable({
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
  })
    .index("by_meetingId", ["meetingId"])
    .index("by_userId", ["userId"])
    .index("by_meetingId_userId", ["meetingId", "userId"]),

  recordings: defineTable({
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
  })
    .index("by_meetingId", ["meetingId"])
    .index("by_roomId", ["roomId"]),
});

export default schema;
