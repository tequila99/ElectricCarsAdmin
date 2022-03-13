ALTER DATABASE electrocar SET timezone TO 'Europe/Moscow';
DROP USER IF EXISTS electrocar;
-- данный пароль используется только в тестовых целях.
CREATE USER electrocar WITH PASSWORD 'electrocar';
