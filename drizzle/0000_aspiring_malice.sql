CREATE TYPE "public"."learning_curve" AS ENUM('easy', 'moderate', 'steep');--> statement-breakpoint
CREATE TYPE "public"."maturity" AS ENUM('emerging', 'growing', 'established', 'legacy');--> statement-breakpoint
CREATE TYPE "public"."pricing_model" AS ENUM('free', 'freemium', 'paid', 'open_source', 'self_hosted');--> statement-breakpoint
CREATE TYPE "public"."subscription_tier" AS ENUM('free', 'pro', 'team');--> statement-breakpoint
CREATE TABLE "ai_recommendations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"model_used" varchar(100) NOT NULL,
	"prompt_hash" varchar(64),
	"raw_response" jsonb NOT NULL,
	"recommendations" jsonb NOT NULL,
	"generation_time_ms" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "ai_recommendations_project_id_unique" UNIQUE("project_id")
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"display_order" integer DEFAULT 0,
	"icon" varchar(50),
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "categories_name_unique" UNIQUE("name"),
	CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"display_name" varchar(255) NOT NULL,
	"avatar_url" text,
	"subscription_tier" "subscription_tier" DEFAULT 'free' NOT NULL,
	"stripe_customer_id" varchar(255),
	"preferences" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "profiles_stripe_customer_id_unique" UNIQUE("stripe_customer_id")
);
--> statement-breakpoint
CREATE TABLE "project_tools" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"tool_id" uuid NOT NULL,
	"category_id" uuid NOT NULL,
	"selected_tier_id" uuid,
	"monthly_cost" numeric(10, 2) DEFAULT '0',
	"position" integer DEFAULT 0,
	"notes" text,
	"ai_recommended" boolean DEFAULT false,
	"ai_confidence" numeric(3, 2),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "uq_project_category" UNIQUE("project_id","category_id")
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"project_type" varchar(50),
	"status" varchar(20) DEFAULT 'draft' NOT NULL,
	"stack_data" jsonb,
	"total_monthly_cost" numeric(10, 2) DEFAULT '0',
	"is_public" boolean DEFAULT false,
	"share_slug" varchar(100),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "projects_share_slug_unique" UNIQUE("share_slug")
);
--> statement-breakpoint
CREATE TABLE "questionnaire_responses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"responses" jsonb NOT NULL,
	"completed" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "questionnaire_responses_project_id_unique" UNIQUE("project_id")
);
--> statement-breakpoint
CREATE TABLE "tool_pricing_tiers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tool_id" uuid NOT NULL,
	"tier_name" varchar(100) NOT NULL,
	"price_monthly" numeric(10, 2),
	"price_yearly" numeric(10, 2),
	"features" jsonb DEFAULT '[]'::jsonb,
	"limits" jsonb DEFAULT '{}'::jsonb,
	"is_free" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tools" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"tagline" varchar(500),
	"description" text,
	"logo_url" text,
	"website_url" text,
	"docs_url" text,
	"github_url" text,
	"github_stars" integer DEFAULT 0,
	"has_free_tier" boolean DEFAULT false,
	"pricing_model" "pricing_model" NOT NULL,
	"starting_price_monthly" numeric(10, 2),
	"key_features" jsonb DEFAULT '[]'::jsonb,
	"pros" jsonb DEFAULT '[]'::jsonb,
	"cons" jsonb DEFAULT '[]'::jsonb,
	"best_for" text,
	"learning_curve" "learning_curve",
	"maturity" "maturity",
	"is_active" boolean DEFAULT true,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "tools_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "ai_recommendations" ADD CONSTRAINT "ai_recommendations_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_tools" ADD CONSTRAINT "project_tools_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_tools" ADD CONSTRAINT "project_tools_tool_id_tools_id_fk" FOREIGN KEY ("tool_id") REFERENCES "public"."tools"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_tools" ADD CONSTRAINT "project_tools_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_tools" ADD CONSTRAINT "project_tools_selected_tier_id_tool_pricing_tiers_id_fk" FOREIGN KEY ("selected_tier_id") REFERENCES "public"."tool_pricing_tiers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "questionnaire_responses" ADD CONSTRAINT "questionnaire_responses_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tool_pricing_tiers" ADD CONSTRAINT "tool_pricing_tiers_tool_id_tools_id_fk" FOREIGN KEY ("tool_id") REFERENCES "public"."tools"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tools" ADD CONSTRAINT "tools_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_ai_recs_user" ON "ai_recommendations" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_ai_recs_prompt_hash" ON "ai_recommendations" USING btree ("prompt_hash");--> statement-breakpoint
CREATE INDEX "idx_pt_project" ON "project_tools" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "idx_projects_user" ON "projects" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_questionnaire_user" ON "questionnaire_responses" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_pricing_tool" ON "tool_pricing_tiers" USING btree ("tool_id");--> statement-breakpoint
CREATE INDEX "idx_tools_slug" ON "tools" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "idx_tools_category" ON "tools" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "idx_tools_active_category" ON "tools" USING btree ("is_active","category_id");