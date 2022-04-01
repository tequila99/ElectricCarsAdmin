BEGIN TRANSACTION;

DROP TABLE IF EXISTS auth_session CASCADE;

CREATE TABLE auth_session (
  session_id   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id   uuid NOT NULL,
  payload   jsonb,
  login_dts timestamp with time zone default now(),
  valid_dts timestamp with time zone default now() + interval '1 hour',
  constraint payload_exists check (
    payload ? 'userId'::text and
    payload ? 'userName'::text and 
    payload ? 'userRole'::text
  )
); 

COMMENT ON TABLE  auth_session               IS 'Таблица для хранения сессий пользователей';
COMMENT ON COLUMN auth_session.session_id    IS 'Уникальный код сессии в формате UUID';
COMMENT ON COLUMN auth_session.user_id       IS 'Уникальный ключ (id) для пользователя в формате UUID';
COMMENT ON COLUMN auth_session.payload       IS 'Соджержимое сессии для формирования нового токена';
COMMENT ON COLUMN auth_session.login_dts     IS 'Время последнего входа пользователя в систему';
COMMENT ON COLUMN auth_session.valid_dts     IS 'Время действия сессии (по умолчанию - час от последнего обновления токена';

DROP INDEX IF EXISTS auth_session_user_id_btree_idx;
CREATE INDEX auth_session_user_id_btree_idx ON auth_session(user_id);
COMMENT ON INDEX auth_session_user_id_btree_idx IS 'Индекс для поиска по ID пользователя';

COMMIT TRANSACTION;