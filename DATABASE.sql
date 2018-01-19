

DROP INDEX IF EXISTS x1;
DROP INDEX IF EXISTS x2;
DROP INDEX IF EXISTS x3;
DROP INDEX IF EXISTS x4;
DROP INDEX IF EXISTS x5;
DROP INDEX IF EXISTS x6;
DROP INDEX IF EXISTS x7;
DROP INDEX IF EXISTS x8;
DROP INDEX IF EXISTS x9;
DROP INDEX IF EXISTS x10;

DROP TRIGGER IF EXISTS t1 ON t;
DROP TRIGGER IF EXISTS t2 ON v;
DROP TRIGGER IF EXISTS t3 ON v;

DROP FUNCTION IF EXISTS q1();
DROP FUNCTION IF EXISTS q2();
DROP FUNCTION IF EXISTS q3();

--DROP SEQUENCE IF EXISTS posts_id_seq;

DROP TABLE IF EXISTS fp;
DROP TABLE IF EXISTS v;
DROP TABLE IF EXISTS p;
DROP TABLE IF EXISTS t;
DROP TABLE IF EXISTS f;
DROP TABLE IF EXISTS u;


/* ------------------------------------------------------------------------------- */

CREATE TABLE u
(
  u1 SERIAL PRIMARY KEY,
  u2 TEXT COLLATE "ucs_basic" NOT NULL UNIQUE,
  u3 TEXT NOT NULL,
  u4 TEXT NOT NULL UNIQUE,
  u5 TEXT
);

CREATE TABLE f
(
  f1 SERIAL PRIMARY KEY,
  f2 INTEGER DEFAULT 0 CHECK (f2 >= 0),
  f3 TEXT NOT NULL UNIQUE,
  f4 TEXT NOT NULL,
  f5 INTEGER DEFAULT 0,
  f6 TEXT REFERENCES u(u2) NOT NULL,
  f7 INTEGER REFERENCES u(u1) NOT NULL
);

CREATE TABLE fp
(
  fp_1 INTEGER  NOT NULL,          /* REFERENCES u(u1) NOT NULL, */
  fp_2 INTEGER  NOT NULL,           /* REFERENCES f(f1) NOT NULL, */
  UNIQUE (fp_1, fp_2)
);

CREATE TABLE t
(
  t1  SERIAL PRIMARY KEY,
  t2  TEXT REFERENCES u(u2) NOT NULL,
  t3  INTEGER REFERENCES u(u1) NOT NULL,
  t4  TEXT REFERENCES f(f3) NOT NULL,
  t5  INTEGER REFERENCES f(f1) NOT NULL,
  t6  TEXT NOT NULL,
  t7  TEXT NOT NULL,
  t8  TEXT NULL UNIQUE,
  t9  INTEGER DEFAULT 0,
  t10 TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE p
(
  p1  INTEGER unique,                             /* p1  SERIAL PRIMARY KEY, */
  p2  TEXT REFERENCES u(u2) NOT NULL,
  p3  INTEGER REFERENCES u(u1) NOT NULL,
  p4  INTEGER REFERENCES t(t1) NOT NULL,
  p5  INTEGER REFERENCES f(f1) NOT NULL,
  p6  TEXT REFERENCES f(f3) NOT NULL,
  p7  INTEGER DEFAULT 0,                               /* p7  INTEGER REFERENCES p(p1) NULL DEFAULT NULL, */
  p8  INTEGER DEFAULT 0,                               /* p8  INTEGER REFERENCES p(p1) NULL DEFAULT NULL, */        /* p8 TEXT DEFAULT '', */
  p9  TEXT NOT NULL DEFAULT now(),
  p10 TIMESTAMPTZ NOT NULL DEFAULT now(),
  p11 BOOLEAN NOT NULL DEFAULT FALSE,
  p12 INTEGER [] DEFAULT ARRAY [0]             /* p12 INTEGER[] NOT NULL */      /* p12 TEXT DEFAULT '' */
);

CREATE TABLE v
(
  v1 SERIAL PRIMARY KEY,
  v2 INTEGER REFERENCES u(u1) NOT NULL,
  v3 INTEGER REFERENCES t(t1) NOT NULL,
  v4 SMALLINT NOT NULL CHECK (v4 = 1 OR v4 = -1)
);

/* ------------------------------------------------------------------------------- */

CREATE UNIQUE INDEX x1 ON u ( LOWER(u2) );
CREATE UNIQUE INDEX x2 ON u ( LOWER(u4) );
CREATE UNIQUE INDEX x3 ON f ( LOWER(f3) );
CREATE INDEX x4 ON fp ( fp_2, fp_1 );
CREATE INDEX x5 ON t ( t5, t10 );
CREATE UNIQUE INDEX x6 ON t ( LOWER(t8) );
CREATE INDEX x7 ON p (p4, p12, p1) WHERE p7 = 0;
CREATE INDEX x8 ON p (p4, p12);
CREATE INDEX x9 ON p (p8, p12);
CREATE INDEX x10 ON v (v3, v2, v1, v4);

/* ------------------------------------------------------------------------------- */

CREATE FUNCTION q1() RETURNS TRIGGER AS $$
BEGIN
    UPDATE f SET f5 = f5 + 1 WHERE f1 = NEW.t5;
    RETURN NULL;
END
$$ LANGUAGE plpgsql;

CREATE FUNCTION q2() RETURNS TRIGGER AS $$
BEGIN
    UPDATE t SET t9 = t9 + NEW.v4 WHERE t1 = NEW.v3;
    RETURN NULL;
END
$$ LANGUAGE plpgsql;

CREATE FUNCTION q3() RETURNS TRIGGER AS $$
BEGIN
  UPDATE t SET t9 = t9 - OLD.v4 + NEW.v4 WHERE t1 = NEW.v3;
  RETURN NULL;
END
$$ LANGUAGE plpgsql;

/* ------------------------------------------------------------------------------- */

CREATE TRIGGER t1 AFTER INSERT ON t FOR EACH ROW EXECUTE PROCEDURE q1();
--CREATE SEQUENCE posts_id_seq;
CREATE TRIGGER t2 AFTER INSERT ON v FOR EACH ROW EXECUTE PROCEDURE q2();
CREATE TRIGGER t3 AFTER UPDATE ON v FOR EACH ROW EXECUTE PROCEDURE q3();

/* ------------------------------------------------------------------------------- */


/* ////////////////////////////////////////////// */

DROP INDEX IF EXISTS y1;
DROP INDEX IF EXISTS y2;
DROP INDEX IF EXISTS y3;
DROP INDEX IF EXISTS y4;

CREATE INDEX y1 ON t USING btree (t5);
CREATE INDEX y2 ON p USING btree (p7);
CREATE INDEX y3 ON p USING btree (p12);
CREATE INDEX y4 ON fp USING btree (fp_2);
