-- Table: public.Log

-- DROP TABLE IF EXISTS public."Log";

CREATE TABLE IF NOT EXISTS public."Log"
(
    "LogID" integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    "UserID" integer NOT NULL,
    "LogText" character varying COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT "Log_pkey" PRIMARY KEY ("LogID"),
    CONSTRAINT "FK_UserID" FOREIGN KEY ("UserID")
        REFERENCES public."User" ("UserID") MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."Log"
    OWNER to postgres;