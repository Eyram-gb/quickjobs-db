import { relations } from "drizzle-orm/relations";
import { users, education, reviews, gigs, messages, applications, applicantProfile, industries, employerProfile, notifications } from "./schema";

export const educationRelations = relations(education, ({one}) => ({
	user: one(users, {
		fields: [education.userId],
		references: [users.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	educations: many(education),
	reviews_reviewerId: many(reviews, {
		relationName: "reviews_reviewerId_users_id"
	}),
	reviews_reviewedId: many(reviews, {
		relationName: "reviews_reviewedId_users_id"
	}),
	messages_senderId: many(messages, {
		relationName: "messages_senderId_users_id"
	}),
	messages_recipientId: many(messages, {
		relationName: "messages_recipientId_users_id"
	}),
	applicantProfiles: many(applicantProfile),
	employerProfiles: many(employerProfile),
	gigs: many(gigs),
	notifications: many(notifications),
}));

export const reviewsRelations = relations(reviews, ({one}) => ({
	user_reviewerId: one(users, {
		fields: [reviews.reviewerId],
		references: [users.id],
		relationName: "reviews_reviewerId_users_id"
	}),
	user_reviewedId: one(users, {
		fields: [reviews.reviewedId],
		references: [users.id],
		relationName: "reviews_reviewedId_users_id"
	}),
	gig: one(gigs, {
		fields: [reviews.gigId],
		references: [gigs.id]
	}),
}));

export const gigsRelations = relations(gigs, ({one, many}) => ({
	reviews: many(reviews),
	applications: many(applications),
	user: one(users, {
		fields: [gigs.userId],
		references: [users.id]
	}),
	employerProfile: one(employerProfile, {
		fields: [gigs.employerId],
		references: [employerProfile.id]
	}),
	industry: one(industries, {
		fields: [gigs.industryId],
		references: [industries.id]
	}),
}));

export const messagesRelations = relations(messages, ({one}) => ({
	user_senderId: one(users, {
		fields: [messages.senderId],
		references: [users.id],
		relationName: "messages_senderId_users_id"
	}),
	user_recipientId: one(users, {
		fields: [messages.recipientId],
		references: [users.id],
		relationName: "messages_recipientId_users_id"
	}),
}));

export const applicationsRelations = relations(applications, ({one}) => ({
	gig: one(gigs, {
		fields: [applications.gigId],
		references: [gigs.id]
	}),
	applicantProfile: one(applicantProfile, {
		fields: [applications.applicantId],
		references: [applicantProfile.id]
	}),
}));

export const applicantProfileRelations = relations(applicantProfile, ({one, many}) => ({
	applications: many(applications),
	user: one(users, {
		fields: [applicantProfile.userId],
		references: [users.id]
	}),
	industry: one(industries, {
		fields: [applicantProfile.industryId],
		references: [industries.id]
	}),
}));

export const industriesRelations = relations(industries, ({many}) => ({
	applicantProfiles: many(applicantProfile),
	employerProfiles: many(employerProfile),
	gigs: many(gigs),
}));

export const employerProfileRelations = relations(employerProfile, ({one, many}) => ({
	user: one(users, {
		fields: [employerProfile.userId],
		references: [users.id]
	}),
	industry: one(industries, {
		fields: [employerProfile.industryId],
		references: [industries.id]
	}),
	gigs: many(gigs),
}));

export const notificationsRelations = relations(notifications, ({one}) => ({
	user: one(users, {
		fields: [notifications.userId],
		references: [users.id]
	}),
}));