alter table "public"."outputs" alter column "submitted_at" set default (now() AT TIME ZONE 'utc'::text);


