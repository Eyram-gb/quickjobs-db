import { pgTable, pgEnum, bigserial, varchar, index, unique, uuid, timestamp, foreignKey, smallint, text, jsonb, boolean } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"

export const applicationStatus = pgEnum("application_status", ['pending', 'accepted', 'rejected', 'reviewing'])
export const experience = pgEnum("experience", ['entry level', 'intermediate', 'expert', 'entry_level'])
export const industryEnum = pgEnum("industry_enum", ['Marketing and Communications', 'Banking and Finance', 'Healthcare and Life Sciences', 'Education and Research', 'Entertainment and Media', 'Environment and Sustainability', 'Government and Non-Profit', 'Professional Services'])
export const notificationEnum = pgEnum("notification_enum", ['chats', 'application_status'])
export const schedule = pgEnum("schedule", ['part-time', 'full-time', 'part_time', 'full_time', 'internship'])
export const userEnum = pgEnum("user_enum", ['admin', 'client', 'company'])


export const industries = pgTable("industries", {
	id: bigserial("id", { mode: "bigint" }).primaryKey().notNull(),
	name: industryEnum("name"),
});

export const skills = pgTable("skills", {
	id: bigserial("id", { mode: "bigint" }).primaryKey().notNull(),
	name: varchar("name", { length: 150 }).notNull(),
});

export const users = pgTable("users", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	email: varchar("email").notNull(),
	passwordHash: varchar("password_hash").notNull(),
	userType: userEnum("user_type").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
},
(table) => {
	return {
		emailIdx: index("email_idx").using("btree", table.email),
		idIdx: index("id_idx").using("btree", table.id),
		usersEmailUnique: unique("users_email_unique").on(table.email),
	}
});

export const education = pgTable("education", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" } ),
	institution: varchar("institution").notNull(),
	certificate: varchar("certificate"),
	startDate: timestamp("start_date", { mode: 'string' }),
	endDate: timestamp("end_date", { mode: 'string' }),
	description: varchar("description"),
	degreeType: varchar("degree_type"),
	fieldOfStudy: varchar("field_of_study"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
});

export const reviews = pgTable("reviews", {
	id: bigserial("id", { mode: "bigint" }).notNull(),
	reviewerId: uuid("reviewer_id").references(() => users.id, { onDelete: "cascade" } ),
	reviewedId: uuid("reviewed_id").references(() => users.id, { onDelete: "cascade" } ),
	gigId: uuid("gig_id").references(() => gigs.id, { onDelete: "cascade", onUpdate: "cascade" } ),
	rating: smallint("rating").default(5),
	reviewText: text("review_text"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
});

export const messages = pgTable("messages", {
	id: bigserial("id", { mode: "bigint" }).primaryKey().notNull(),
	senderId: uuid("sender_id").references(() => users.id, { onDelete: "cascade" } ),
	recipientId: uuid("recipient_id").references(() => users.id, { onDelete: "cascade" } ),
	messageText: text("message_text").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
},
(table) => {
	return {
		createdAtIdx: index("messages_created_at_idx").using("btree", table.createdAt),
		recipientIdIdx: index("messages_recipient_id_idx").using("btree", table.recipientId),
		senderIdIdx: index("messages_sender_id_idx").using("btree", table.senderId),
		messagesIdUnique: unique("messages_id_unique").on(table.id),
	}
});

export const applications = pgTable("applications", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	gigId: uuid("gig_id").references(() => gigs.id, { onDelete: "cascade" } ),
	applicantId: uuid("applicant_id").references(() => applicantProfile.id, { onDelete: "cascade" } ),
	cvUrl: varchar("cv_url"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	applicationStatus: applicationStatus("application_status").default('pending'),
});

export const applicantProfile = pgTable("applicant_profile", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" } ),
	firstName: varchar("first_name").notNull(),
	lastName: varchar("last_name").notNull(),
	profileUrl: varchar("profile_url").notNull(),
	bannerUrl: varchar("banner_url"),
	otherName: varchar("other_name"),
	bio: varchar("bio"),
	resumeUrl: varchar("resume_url"),
	skills: varchar("skills"),
	location: varchar("location"),
	education: varchar("education"),
	experience: varchar("experience"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	industryId: bigserial("industry_id", { mode: "bigint" }).notNull().references(() => industries.id, { onDelete: "cascade" } ),
});

export const employerProfile = pgTable("employer_profile", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" } ),
	name: varchar("name").notNull(),
	description: varchar("description").notNull(),
	logoUrl: varchar("logo_url"),
	location: varchar("location"),
	websiteUrl: varchar("website_url"),
	industryId: bigserial("industry_id", { mode: "bigint" }).notNull().references(() => industries.id, { onDelete: "cascade" } ),
},
(table) => {
	return {
		nameIdx: index("name_idx").using("btree", table.id),
		userIdIdx: index("user_id_idx").using("btree", table.userId),
	}
});

export const gigs = pgTable("gigs", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" } ),
	employerId: uuid("employer_id").references(() => employerProfile.id, { onDelete: "cascade" } ),
	title: varchar("title"),
	description: varchar("description"),
	duration: varchar("duration"),
	location: jsonb("location"),
	budgetRange: varchar("budget_range"),
	requirements: text("requirements").array(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	isActive: boolean("is_active").default(true),
	isDeleted: boolean("is_deleted").default(false),
	industryId: bigserial("industry_id", { mode: "bigint" }).notNull().references(() => industries.id, { onDelete: "cascade" } ),
	negotiable: boolean("negotiable"),
	remote: boolean("remote"),
	experience: experience("experience"),
	schedule: schedule("schedule"),
});

export const notifications = pgTable("notifications", {
	id: bigserial("id", { mode: "bigint" }).primaryKey().notNull(),
	userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" } ),
	message: text("message").notNull(),
	type: notificationEnum("type").notNull(),
	read: boolean("read").default(false).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
});