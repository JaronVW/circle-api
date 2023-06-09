-- Table: public.Message

-- DROP TABLE IF EXISTS public."Message";

CREATE TABLE IF NOT EXISTS public."Message"
(
    "MessageID" integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    "Message" character varying COLLATE pg_catalog."default" NOT NULL,
    "UserID" integer NOT NULL,
    "StreamID" character varying COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT "FK_StreamID" FOREIGN KEY ("StreamID")
        REFERENCES public."Stream" ("StreamID") MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT "FK_UserID" FOREIGN KEY ("UserID")
        REFERENCES public."User" ("UserID") MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."Message"
    OWNER to postgres;