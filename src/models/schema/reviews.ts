import { bigserial, pgTable, smallint, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./users";
import { gigs } from "./gigs";

export const reviews = pgTable("reviews", {
  id: bigserial("id", { mode: "number" }),
  reviewer_id: uuid("reviewer_id").references(() => users.id, {
    onDelete: "cascade",
  }),
  reviewed_id: uuid("reviewed_id").references(() => users.id, {
    onDelete: "cascade",
  }),
  gig_id: uuid("gig_id").references(() => gigs.id, {
    onDelete: "cascade",
    onUpdate: "cascade",
  }),
  rating: smallint("rating").default(5),
  review_text: text("review_text"),
  created_at: timestamp("created_at", {
    precision: 0,
    withTimezone: true,
  }).defaultNow(),
  updated_at: timestamp("updated_at", {
    precision: 0,
    withTimezone: true,
  }).$onUpdate(() => new Date()),
});
