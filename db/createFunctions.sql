BEGIN TRANSACTION;

CREATE OR REPLACE FUNCTION normalize_string(in_string text)
RETURNS text
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
    RETURN replace(upper(trim(in_string)),'Ё','Е');
END;
$$;

COMMENT ON FUNCTION normalize_string(text) IS 'Функция для приведения любой строки к нормализованному виду - верхний регистр, замена Ё на Е';

CREATE OR REPLACE FUNCTION get_fullname(in_fullname jsonb, mode integer DEFAULT 0)
RETURNS text
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
    lname text;
    fname text;
    mname text;
    result text default '';
BEGIN
    lname = coalesce(in_fullname->>'lastName', '');
    fname = coalesce(in_fullname->>'firstName', '');
    mname = coalesce(in_fullname->>'middleName', '');
    result = lname;
    IF mode = 0 then
        IF fname > '' THEN 
            result = result || ' ' || fname;
            IF mname > '' THEN 
                result = result || ' ' || mname;
            END IF;
        END IF;
    ELSE
        IF fname > '' THEN
            IF mname > '' THEN 
                result = fname || ' ' || mname || ' ' || lname;
            ELSE
                result = fname || ' ' || lname;
            END IF;
        END IF;
    END IF;
    RETURN TRIM(result);
EXCEPTION
  WHEN others THEN RAISE EXCEPTION '%', sqlerrm;
END;
$$;

COMMENT ON FUNCTION get_fullname(in_fullname jsonb, mode integer) IS 'Функция для получение полного ФИО из JSON. Второй параметр опеределяет положение имени и отчества.';

CREATE OR REPLACE FUNCTION get_shortname(in_fullname jsonb, mode integer DEFAULT 0)
RETURNS text
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
	initial varchar(4) DEFAULT '';
	fname text;
	lname text;
	mname text;
BEGIN
	fname := coalesce(in_fullname->>'firstName','');
	lname := coalesce(in_fullname->>'lastName','');
	mname := coalesce(in_fullname->>'middleName','');
	IF fname > '' THEN
		initial := LEFT(fname,1)||'.';
		IF mname > '' THEN
			initial := initial||LEFT(mname,1)||'.';
		END IF;
	END IF;
	IF mode = 0 THEN
		RETURN TRIM(lname || ' ' || initial);
	ELSE
		RETURN TRIM(initial || lname);
	END IF;
EXCEPTION
  WHEN others THEN RAISE EXCEPTION '%', sqlerrm;
END;
$$;

COMMENT ON FUNCTION get_shortname(in_fullname jsonb, mode integer) IS 'Функция для получение короткого ФИО из JSON. Второй параметр определяет положение инициалов';

CREATE OR REPLACE FUNCTION get_initials(fullname jsonb)
RETURNS text
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
    RETURN UPPER(LEFT(COALESCE(fullname ->> 'firstName','n'),1) || LEFT(COALESCE(fullname ->> 'middleName','n'),1));
EXCEPTION
    WHEN others THEN RAISE EXCEPTION '%', sqlerrm;
END;
$$;

COMMENT ON FUNCTION get_initials(jsonb) IS 'Функция формирует иницалы для аватарки из полного ФИО в виде Jsonb';

COMMIT TRANSACTION;