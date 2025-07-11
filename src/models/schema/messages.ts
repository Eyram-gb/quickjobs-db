import {
  bigserial,
  pgTable,
  text,
  timestamp,
  uuid,
  index,
} from "drizzle-orm/pg-core";
import { users } from "./users";

export const messages = pgTable(
  "messages",
  {
    id: bigserial("id", { mode: "number" }).primaryKey().unique(),
    sender_id: uuid("sender_id").references(() => users.id, {
      onDelete: "cascade",
    }),
    recipient_id: uuid("recipient_id").references(() => users.id, {
      onDelete: "cascade",
    }),
    message_text: text("message_text").notNull(),
    created_at: timestamp("created_at", {
      precision: 0,
      withTimezone: true,
    }).defaultNow(),
    updated_at: timestamp("updated_at", {
      precision: 0,
      withTimezone: true,
    }).$onUpdate(() => new Date()),
  },
  (table) => ({
    senderIdx: index("messages_sender_id_idx").on(table.sender_id),
    recipientIdx: index("messages_recipient_id_idx").on(table.recipient_id),
    createdAtIdx: index("messages_created_at_idx").on(table.created_at),
  })
);
