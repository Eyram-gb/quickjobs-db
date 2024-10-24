import {
  bigserial,
  boolean,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { users } from "./users";

export const notificationType = pgEnum("notification_enum", [
  "chats",
  "application_status",
]);

export const notifications = pgTable("notifications", {
  id: bigserial("id", { mode: "number" }).primaryKey().unique(), 
  user_id: uuid("user_id").references(() => users.id, {
    onDelete: "cascade",
  }), //the use_id of the recipient of the notification
  message: text("message").notNull(),
  type: notificationType("type").notNull(),
  read: boolean("read").notNull().default(false),
  created_at: timestamp("created_at", {
    precision: 0,
    withTimezone: true,
  }).defaultNow(),
  updated_at: timestamp("updated_at", {
    precision: 0,
    withTimezone: true,
  }).$onUpdate(() => new Date()),
});
