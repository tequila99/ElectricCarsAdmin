BEGIN TRANSACTION;
DROP TYPE IF EXISTS user_roles CASCADE;
CREATE TYPE user_roles AS ENUM ('admin', 'operator');
COMMENT ON TYPE user_roles IS 'Роли доступа пользователей панели администрирования';

DROP TABLE IF EXISTS auth_user CASCADE;

CREATE TABLE auth_user (
  user_id   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name      varchar(50) NOT NULL,
  full_name jsonb,
  caption   text,
  PASSWORD  varchar(100),
  user_role user_roles DEFAULT 'operator',
  mobile_phone  varchar(10),
  email     text,
  avatar    text,
  thmb_avatar text,
  active    boolean NOT NULL DEFAULT true, 
  deleted   boolean NOT NULL DEFAULT false,
  deleted_at  timestamp,

  constraint full_name_exists check (
    full_name ? 'lastName'::text and 
    full_name ? 'firstName'::text and
    full_name ? 'middleName'::text
  ),
  constraint full_name_notnull check (
    (full_name ->> 'lastName'::text) is not NULL            
  )       
); 

COMMENT ON TABLE  auth_user                  IS 'Таблица для хранения учетных данных пользователей';
COMMENT ON COLUMN auth_user.user_id          IS 'Уникальный ключ (id) для пользователя в формате UUID';
COMMENT ON COLUMN auth_user.name             IS 'Имя пользователя (логин)';
COMMENT ON COLUMN auth_user.full_name        IS 'ФИО пользователя в формате JSON';
COMMENT ON COLUMN auth_user.caption          IS 'Представление (описание) пользователя';
COMMENT ON COLUMN auth_user.password         IS 'Пароль пользователя в зашифрованном виде';
COMMENT ON COLUMN auth_user.mobile_phone     IS 'Номер мобильного телефона пользователя в упакованном виде (только цифры без кода страны)';
COMMENT ON COLUMN auth_user.email            IS 'Электронная почта пользователя';
COMMENT ON COLUMN auth_user.user_role        IS 'Уровень доступа (тип пользователя). Принимает значения - администратор, оператор';
COMMENT ON COLUMN auth_user.avatar           IS 'Путь к фотографии (аватару) пользователя';
COMMENT ON COLUMN auth_user.thmb_avatar      IS 'Путь к уменьшенной копии фотографии (аватара) пользователя';
COMMENT ON COLUMN auth_user.active           IS 'Признак активности учетной записи, т.е. может ли пользователь входить в систему';
COMMENT ON COLUMN auth_user.deleted          IS 'Пометка удаления. Признак удаленной записи';
COMMENT ON COLUMN auth_user.deleted_at       IS 'Дата и время удаления записи';

DROP INDEX IF EXISTS auth_user_name_btree_idx;
CREATE UNIQUE INDEX auth_user_name_btree_idx ON auth_user(name) WHERE NOT deleted;
COMMENT ON INDEX auth_user_name_btree_idx IS 'Индекс для поиска по совпадению наименования (логина) в таблице пользователей';

DROP INDEX IF EXISTS auth_user_full_name_gin_idx;
CREATE INDEX auth_user_full_name_gin_idx ON auth_user USING gin (get_fullname(full_name) gin_trgm_ops);
COMMENT ON INDEX auth_user_full_name_gin_idx IS 'Индекс для поиска по вхождению подстроки в ФИО в таблице пользователей';

DROP INDEX IF EXISTS auth_user_full_name_btree_idx;
CREATE INDEX auth_user_full_name_btree_idx ON auth_user(normalize_string(get_fullname(full_name)));
COMMENT ON INDEX auth_user_full_name_btree_idx IS 'Индекс для сортировки по полному ФИО пользователя';

DROP INDEX IF EXISTS auth_user_mobile_phone_btree_idx;
CREATE INDEX auth_user_mobile_phone_btree_idx ON auth_user(mobile_phone);
COMMENT ON INDEX auth_user_mobile_phone_btree_idx IS 'Индекс для поиска по сотовому телефону';

CREATE OR REPLACE RULE auth_user_delete_rule AS
        ON DELETE TO auth_user
        DO INSTEAD (UPDATE auth_user SET active = false, deleted = true, deleted_at = now() WHERE user_id = old.user_id);
COMMENT ON RULE auth_user_delete_rule ON auth_user IS 'Правило которое вместо удаление записи о пользователе помечает его удаленным и неактивным';


COMMIT TRANSACTION;